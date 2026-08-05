import {
  EARTH_RADIUS_M,
  ORS_PROFILE,
  WALK_SPEED_M_PER_MIN,
} from "@/constants/mapping";
import { StopApiResponse } from "../types";

export interface StopDistanceInfo {
  order: number;
  distanceFromPrevious: number | null; // km
  durationFromPrevious: number | null; // minutos
}

// ---------- Helpers locales de distancia ----------

type LatLng = { latitude: number; longitude: number };

const toRad = (value: number) => (value * Math.PI) / 180;

export const getDistanceInMeters = (a: LatLng, b: LatLng): number => {
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);

  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);

  const h =
    sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

  return EARTH_RADIUS_M * c;
};

/**
 * Calcula la distancia y tiempo caminando entre cada par de stops consecutivos,
 * usando Haversine y una velocidad promedio de caminata.
 *
 * @param spots - Array de stops ordenados
 * @param userLocation - Ubicación actual del usuario (opcional)
 * @returns Array con información de distancia y tiempo para cada stop
 */
export const getInformationBetweenStopsLocal = async (
  spots: StopApiResponse[],
  userLocation?: LatLng | null,
): Promise<StopDistanceInfo[]> => {
  if (spots.length === 0) return [];

  const sorted = [...spots].sort((a, b) => a.order - b.order);

  const results: StopDistanceInfo[] = [];

  // 1) Primer stop: desde ubicación del usuario (si la tenemos)
  const first = sorted[0];

  if (
    userLocation &&
    first.spot.latitude != null &&
    first.spot.longitude != null
  ) {
    const distM = getDistanceInMeters(userLocation, {
      latitude: first.spot.latitude,
      longitude: first.spot.longitude,
    });
    const distKm = Number((distM / 1000).toFixed(2));
    const durationMin = Math.round(distM / WALK_SPEED_M_PER_MIN);

    results.push({
      order: first.order,
      distanceFromPrevious: distKm,
      durationFromPrevious: durationMin,
    });
  } else {
    results.push({
      order: first.order,
      distanceFromPrevious: null,
      durationFromPrevious: null,
    });
  }

  // 2) Resto de stops: entre cada par consecutivo
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];

    if (
      prev.spot.latitude != null &&
      prev.spot.longitude != null &&
      curr.spot.latitude != null &&
      curr.spot.longitude != null
    ) {
      const distM = getDistanceInMeters(
        {
          latitude: prev.spot.latitude,
          longitude: prev.spot.longitude,
        },
        {
          latitude: curr.spot.latitude,
          longitude: curr.spot.longitude,
        },
      );

      const distKm = Number((distM / 1000).toFixed(2));
      const durationMin = Math.round(distM / WALK_SPEED_M_PER_MIN);

      results.push({
        order: curr.order,
        distanceFromPrevious: distKm,
        durationFromPrevious: durationMin,
      });
    } else {
      results.push({
        order: curr.order,
        distanceFromPrevious: null,
        durationFromPrevious: null,
      });
    }
  }

  return results;
};

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
  // Resultado base: todos los spots con null
  const baseResults: StopDistanceInfo[] = spots.map((spot) => ({
    order: spot.order,
    distanceFromPrevious: null,
    durationFromPrevious: null,
  }));

  // Filtramos spots válidos y los ordenamos
  const validSpots = spots
    .filter((s) => s.spot.latitude != null && s.spot.longitude != null)
    .sort((a, b) => a.order - b.order);

  if (validSpots.length < 2 && !userLocation) {
    // Nada interesante que calcular
    return baseResults;
  }

  const hasUserLocation = !!userLocation;

  // Armamos coordinates para ORS:
  // - si hay userLocation: [user, spot0, spot1, ...]
  // - si no, solo [spot0, spot1, ...]
  const coordinates: [number, number][] = [];

  if (hasUserLocation && userLocation) {
    coordinates.push([userLocation.longitude, userLocation.latitude]);
  }

  validSpots.forEach((spot) => {
    coordinates.push([
      spot.spot.longitude as number,
      spot.spot.latitude as number,
    ]);
  });

  // Si no hay al menos 2 coordinates, salir
  if (coordinates.length < 2) return baseResults;

  const orsUrl = `https://api.openrouteservice.org/v2/directions/${ORS_PROFILE}/geojson`;

  try {
    const response = await fetch(orsUrl, {
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
      console.warn("Error ORS multi-leg:", response.status, errorText);
      return baseResults;
    }

    const data = await response.json();
    const feature = data.features?.[0];
    const segments = feature?.properties?.segments as
      | { distance: number; duration: number }[]
      | undefined;

    if (!segments || !Array.isArray(segments) || segments.length === 0) {
      console.warn("ORS sin segments válidos:", data);
      return baseResults;
    }

    // Copiamos los resultados base para ir llenando
    const results = [...baseResults];

    // Mapeo de segmentos -> spots
    // Caso 1: con userLocation:
    //   coordinates: [U, S0, S1, S2]
    //   segments:   [U->S0, S0->S1, S1->S2]
    //   Queremos:
    //     S0 ← segments[0]
    //     S1 ← segments[1]
    //     S2 ← segments[2]
    //
    // Caso 2: sin userLocation:
    //   coordinates: [S0, S1, S2]
    //   segments:    [S0->S1, S1->S2]
    //   Queremos:
    //     S0 = null (no tiene "anterior")
    //     S1 ← segments[0]
    //     S2 ← segments[1]

    segments.forEach((segment, index) => {
      const distanceKm = Number((segment.distance / 1000).toFixed(2));
      const durationMin = Math.round(segment.duration / 60);

      let targetSpot: StopApiResponse | undefined;

      if (hasUserLocation) {
        // segments[index] → validSpots[index]
        targetSpot = validSpots[index];
      } else {
        // segments[index] → validSpots[index + 1]
        targetSpot = validSpots[index + 1];
      }

      if (!targetSpot) return;

      const target = results.find((r) => r.order === targetSpot!.order);
      if (!target) return;

      target.distanceFromPrevious = distanceKm;
      target.durationFromPrevious = durationMin;
    });

    return results;
  } catch (error) {
    console.error("Error llamando a ORS multi-leg:", error);
    return baseResults;
  }
};
