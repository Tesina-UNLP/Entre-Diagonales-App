export const WALK_SPEED_KMH = 4.8; // promedio caminando

export const WALK_SPEED_M_PER_MIN = (WALK_SPEED_KMH * 1000) / 60;

export const EARTH_RADIUS_M = 6371000;

// Perfil de ORS que vamos a usar para las rutas (caminando)
export const ORS_PROFILE = "foot-walking";
// Si querés usar auto: const ORS_PROFILE = "driving-car";

export const MIN_LOCATION_CHANGE_METERS = 100; // o lo que te cierre más

// Un recorrido turístico a pie es local. Por encima de esta distancia evitamos
// pedir una ruta a ORS, que puede rechazar trayectos muy largos.
export const MAX_ORS_WALKING_ROUTE_DISTANCE_METERS = 25_000;
