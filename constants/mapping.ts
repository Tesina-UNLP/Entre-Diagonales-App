export const WALK_SPEED_KMH = 4.8; // promedio caminando

export const WALK_SPEED_M_PER_MIN = (WALK_SPEED_KMH * 1000) / 60;

export const EARTH_RADIUS_M = 6371000;

// Perfil de ORS que vamos a usar para las rutas (caminando)
export const ORS_PROFILE = "foot-walking";
// Si querés usar auto: const ORS_PROFILE = "driving-car";

export const MIN_LOCATION_CHANGE_METERS = 100; // o lo que te cierre más