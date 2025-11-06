import polyline from "@mapbox/polyline";
import { StopApiResponse } from "../types";

// Interfaz que define la información de distancia y tiempo entre stops
export interface StopDistanceInfo {
  order: number; // El orden del stop
  distanceFromPrevious: number | null; // Distancia en km desde el stop anterior
  durationFromPrevious: number | null; // Duración en minutos desde el stop anterior
}

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
  const origin = `${sorted[0].spot.latitude},${sorted[0].spot.longitude}`;
  const destination = `${sorted[sorted.length - 1].spot.latitude},${sorted[sorted.length - 1].spot.longitude}`;
  const waypoints = sorted
    .slice(1, -1)
    .map((p) => `${p.spot.latitude},${p.spot.longitude}`)
    .join("|");

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ""}&key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== "OK") {
    console.error("Error al obtener la ruta:", data);
    return { coordenadas: [] };
  }

  const encodedPolyline = data.routes[0].overview_polyline.points;
  const coordenadas = polyline
    .decode(encodedPolyline)
    .map(([lat, lng]: [number, number]) => ({
      latitude: lat,
      longitude: lng,
    }));

  return { coordenadas };
};

/**
 * Calcula la distancia y tiempo caminando entre cada par de stops consecutivos
 *
 * @param spots - Array de stops ordenados
 * @param apiKey - API key de Google Maps
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

  // Array para almacenar los resultados
  const results: StopDistanceInfo[] = [];

  // Para el primer stop, calculamos la distancia desde la ubicación actual del usuario
  const firstSpot = spots[0];

  // Si tenemos la ubicación del usuario y el primer spot tiene coordenadas válidas
  if (
    userLocation &&
    firstSpot.spot.latitude != null &&
    firstSpot.spot.longitude != null
  ) {
    try {
      // Construimos la URL desde la ubicación del usuario hasta el primer stop
      const origin = `${userLocation.latitude},${userLocation.longitude}`;
      const destination = `${firstSpot.spot.latitude},${firstSpot.spot.longitude}`;
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=walking&key=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs[0];

        const distanceInKm = leg.distance.value / 1000;
        const durationInMinutes = Math.round(leg.duration.value / 60);

        results.push({
          order: firstSpot.order,
          distanceFromPrevious: Number(distanceInKm.toFixed(2)),
          durationFromPrevious: durationInMinutes,
        });
      } else {
        // Si falla la API, guardamos null
        console.warn(
          `Error al obtener ruta desde ubicación actual al primer stop:`,
          data.status,
        );
        results.push({
          order: firstSpot.order,
          distanceFromPrevious: null,
          durationFromPrevious: null,
        });
      }
    } catch (error) {
      // Si hay error, guardamos null
      console.error(
        `Error al calcular distancia desde ubicación actual:`,
        error,
      );
      results.push({
        order: firstSpot.order,
        distanceFromPrevious: null,
        durationFromPrevious: null,
      });
    }
  } else {
    // Si no tenemos ubicación del usuario, el primer stop tiene valores null
    results.push({
      order: firstSpot.order,
      distanceFromPrevious: null,
      durationFromPrevious: null,
    });
  }

  // Iteramos desde el segundo stop hasta el último
  for (let i = 1; i < spots.length; i++) {
    const previousSpot = spots[i - 1];
    const currentSpot = spots[i];

    // Verificamos que ambos stops tengan coordenadas válidas
    if (
      previousSpot.spot.latitude != null &&
      previousSpot.spot.longitude != null &&
      currentSpot.spot.latitude != null &&
      currentSpot.spot.longitude != null
    ) {
      try {
        // Construimos la URL para la API de Google Directions
        const origin = `${previousSpot.spot.latitude},${previousSpot.spot.longitude}`;
        const destination = `${currentSpot.spot.latitude},${currentSpot.spot.longitude}`;

        // mode=walking especifica que queremos rutas a pie
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=walking&key=${apiKey}`;

        // Hacemos la petición a la API
        const response = await fetch(url);
        const data = await response.json();

        // Verificamos que la respuesta sea exitosa
        if (data.status === "OK" && data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const leg = route.legs[0]; // legs[0] contiene la info del tramo

          // Convertimos la distancia de metros a kilómetros
          const distanceInKm = leg.distance.value / 1000;

          // Convertimos la duración de segundos a minutos
          const durationInMinutes = Math.round(leg.duration.value / 60);

          results.push({
            order: currentSpot.order,
            distanceFromPrevious: Number(distanceInKm.toFixed(2)), // Redondeamos a 2 decimales
            durationFromPrevious: durationInMinutes,
          });
        } else {
          // Si la API falla, guardamos valores null
          console.warn(
            `Error al obtener ruta entre stop ${previousSpot.order} y ${currentSpot.order}:`,
            data.status,
          );
          results.push({
            order: currentSpot.order,
            distanceFromPrevious: null,
            durationFromPrevious: null,
          });
        }
      } catch (error) {
        // Si hay un error en la petición, guardamos valores null
        console.error(
          `Error al calcular distancia para stop ${currentSpot.order}:`,
          error,
        );
        results.push({
          order: currentSpot.order,
          distanceFromPrevious: null,
          durationFromPrevious: null,
        });
      }
    } else {
      // Si las coordenadas no son válidas, guardamos valores null
      results.push({
        order: currentSpot.order,
        distanceFromPrevious: null,
        durationFromPrevious: null,
      });
    }
  }

  return results;
};
