import polyline from "@mapbox/polyline";
import { StopApiResponse } from "./api";

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
