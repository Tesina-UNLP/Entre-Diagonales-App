// ✅ YA NO USAMOS GOOGLE, NI POLYLINE
// import polyline from "@mapbox/polyline";
import { StopApiResponse } from "../types";

// Interfaz que define la información de distancia y tiempo entre stops
export interface StopDistanceInfo {
  order: number; // El orden del stop
  distanceFromPrevious: number | null; // Distancia en km desde el stop anterior
  durationFromPrevious: number | null; // Duración en minutos desde el stop anterior
}

// Perfil de ORS que vamos a usar para las rutas (caminando)
const ORS_PROFILE = "foot-walking";
// Si querés usar auto: const ORS_PROFILE = "driving-car";

/**
 * Obtiene las coordenadas de la ruta para dibujarla en el mapa,
 * usando OpenRouteService.
 *
 * @param puntos - Stops con coordenadas
 * @param apiKey - API key de OpenRouteService
 */
export const getRouteCoords = async (
  puntos: StopApiResponse[],
  apiKey: string,
): Promise<{ coordenadas: { latitude: number; longitude: number }[] }> => {
  if (puntos.length < 2) return { coordenadas: [] };

  // Filtramos puntos con coordenadas nulas
  const puntosValidos = puntos.filter(
    (p) => p.spot.latitude != null && p.spot.longitude != null,
  );

  if (puntosValidos.length < 2) return { coordenadas: [] };

  const sorted = [...puntosValidos].sort((a, b) => a.order - b.order);

  // ORS espera coordinates: [ [lng, lat], [lng, lat], ... ]
  const coordinates = sorted.map((p) => [
    p.spot.longitude as number,
    p.spot.latitude as number,
  ]);

  const url = `https://api.openrouteservice.org/v2/directions/${ORS_PROFILE}/geojson`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
        Accept: "application/json, application/geo+json",
      },
      body: JSON.stringify({ coordinates }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "Error al obtener la ruta ORS:",
        response.status,
        errorText,
      );
      return { coordenadas: [] };
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      console.error("Respuesta ORS sin features válidos:", data);
      return { coordenadas: [] };
    }

    const geometry = data.features[0].geometry;

    if (!geometry || geometry.type !== "LineString") {
      console.error("Geometría de ruta inválida ORS:", geometry);
      return { coordenadas: [] };
    }

    // geometry.coordinates: [ [lng, lat], [lng, lat], ... ]
    const coordenadas = (geometry.coordinates as [number, number][]).map(
      ([lng, lat]) => ({
        latitude: lat,
        longitude: lng,
      }),
    );

    return { coordenadas };
  } catch (error) {
    console.error("Error al llamar a ORS para obtener la ruta:", error);
    return { coordenadas: [] };
  }
};

/**
 * Calcula la distancia y tiempo caminando entre cada par de stops consecutivos
 * usando OpenRouteService (perfil foot-walking).
 *
 * @param spots - Array de stops ordenados
 * @param apiKey - API key de OpenRouteService
 * @param userLocation - Ubicación actual del usuario (opcional)
 * @returns Array con información de distancia y tiempo para cada stop
 */
export const getInformationBetweenStops = async (
  spots: StopApiResponse[],
  apiKey: string,
  userLocation?: { latitude: number; longitude: number } | null,
): Promise<StopDistanceInfo[]> => {
  // Si hay menos de 2 stops, no hay distancias que calcular
  if (spots.length < 2) {
    return spots.map((spot) => ({
      order: spot.order,
      distanceFromPrevious: null,
      durationFromPrevious: null,
    }));
  }

  const results: StopDistanceInfo[] = [];

  const orsUrl = `https://api.openrouteservice.org/v2/directions/${ORS_PROFILE}/geojson`;

  // Helper para pedir a ORS la distancia/duración entre dos puntos
  const getLegInfo = async (
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number },
  ): Promise<{ distanceKm: number | null; durationMin: number | null }> => {
    try {
      const body = {
        coordinates: [
          [origin.longitude, origin.latitude], // [lng, lat]
          [destination.longitude, destination.latitude],
        ],
      };

      const response = await fetch(orsUrl, {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
          Accept: "application/json, application/geo+json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn("Error ORS leg:", response.status, errorText);
        return { distanceKm: null, durationMin: null };
      }

      const data = await response.json();

      if (!data.features || data.features.length === 0) {
        console.warn("ORS sin features para leg:", data);
        return { distanceKm: null, durationMin: null };
      }

      const feature = data.features[0];
      const summary = feature.properties?.summary;

      if (!summary) {
        console.warn("ORS sin summary para leg:", feature);
        return { distanceKm: null, durationMin: null };
      }

      const distanceMeters = summary.distance; // metros
      const durationSeconds = summary.duration; // segundos

      const distanceKm = distanceMeters / 1000;
      const durationMin = Math.round(durationSeconds / 60);

      return {
        distanceKm: Number(distanceKm.toFixed(2)),
        durationMin,
      };
    } catch (error) {
      console.error("Error llamando a ORS para leg:", error);
      return { distanceKm: null, durationMin: null };
    }
  };

  // --- 1) Primer stop: desde ubicación del usuario (si la tenemos) ---
  const firstSpot = spots[0];

  if (
    userLocation &&
    firstSpot.spot.latitude != null &&
    firstSpot.spot.longitude != null
  ) {
    const { distanceKm, durationMin } = await getLegInfo(
      {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      },
      {
        latitude: firstSpot.spot.latitude,
        longitude: firstSpot.spot.longitude,
      },
    );

    results.push({
      order: firstSpot.order,
      distanceFromPrevious: distanceKm,
      durationFromPrevious: durationMin,
    });
  } else {
    // Sin ubicación del usuario → nulls
    results.push({
      order: firstSpot.order,
      distanceFromPrevious: null,
      durationFromPrevious: null,
    });
  }

  // --- 2) Resto de stops: entre cada par consecutivo ---
  for (let i = 1; i < spots.length; i++) {
    const previousSpot = spots[i - 1];
    const currentSpot = spots[i];

    if (
      previousSpot.spot.latitude != null &&
      previousSpot.spot.longitude != null &&
      currentSpot.spot.latitude != null &&
      currentSpot.spot.longitude != null
    ) {
      const { distanceKm, durationMin } = await getLegInfo(
        {
          latitude: previousSpot.spot.latitude,
          longitude: previousSpot.spot.longitude,
        },
        {
          latitude: currentSpot.spot.latitude,
          longitude: currentSpot.spot.longitude,
        },
      );

      results.push({
        order: currentSpot.order,
        distanceFromPrevious: distanceKm,
        durationFromPrevious: durationMin,
      });
    } else {
      results.push({
        order: currentSpot.order,
        distanceFromPrevious: null,
        durationFromPrevious: null,
      });
    }
  }

  return results;
};
