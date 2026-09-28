import * as Location from "expo-location";
import { useEffect, useState } from "react";

// Interfaz para definir qué datos retorna nuestro hook
export interface LocationData {
  coords: Location.LocationObjectCoords;
  timestamp: number;
}

const INITIAL_LOCATION_TIMEOUT_MS = 8_000;

interface UseLocationOptions {
  enabled?: boolean;
}

// Hook personalizado para manejar la ubicación del usuario
export const useLocation = ({ enabled = true }: UseLocationOptions = {}) => {
  // Estado para almacenar la ubicación actual
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);

  // Estado para saber si estamos cargando la ubicación inicial
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Estado para almacenar cualquier error que pueda ocurrir
  const [error, setError] = useState<string | null>(null);

  // Estado para saber si se otorgaron los permisos
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    // Variable para almacenar la suscripción a la ubicación para poder limpiarla después
    let locationSubscription: Location.LocationSubscription | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    // Función asíncrona para solicitar permisos y obtener la ubicación
    const obtenerUbicacion = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Solicitamos permiso para acceder a la ubicación
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (cancelled) return;

        if (status !== "granted") {
          setError("Permiso de ubicación denegado");
          setHasPermission(false);
          setIsLoading(false);
          return;
        }

        setHasPermission(true);

        // Usamos la última ubicación disponible de inmediato, si existe. Esto evita
        // que la UI quede sin referencia mientras el GPS obtiene una lectura nueva.
        const lastKnownLocation = await Location.getLastKnownPositionAsync();
        if (cancelled) return;
        if (lastKnownLocation) {
          setLocation(lastKnownLocation.coords);
        }

        // En simuladores o interiores una lectura de alta precisión puede tardar
        // indefinidamente. Esperamos un tiempo acotado y dejamos que el watcher
        // continúe actualizando cuando haya señal.
        const ubicacionActual = await Promise.race([
          Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          }),
          new Promise<null>((resolve) => {
            timeoutId = setTimeout(
              () => resolve(null),
              INITIAL_LOCATION_TIMEOUT_MS,
            );
          }),
        ]);

        if (timeoutId) clearTimeout(timeoutId);
        if (cancelled) return;

        if (ubicacionActual) {
          setLocation(ubicacionActual.coords);
        }
        setIsLoading(false);

        // Observamos los cambios en la ubicación
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000, // Actualizar cada 5 segundos
            distanceInterval: 10, // O cuando el usuario se mueve 10 metros
          },
          (newLocation) => {
            if (cancelled) return;
            setLocation(newLocation.coords);
          },
        );

        if (cancelled) {
          subscription.remove();
          return;
        }

        locationSubscription = subscription;
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.message || "Error al obtener ubicación");
        setIsLoading(false);
      }
    };

    // Llamamos a la función para obtener la ubicación
    obtenerUbicacion();

    // Función de limpieza: cancelamos la suscripción cuando el componente se desmonta
    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [enabled]);

  // Retornamos todos los valores de estado para que los componentes puedan usarlos
  return {
    location, // Las coordenadas de ubicación actuales
    isLoading, // Si estamos cargando la ubicación inicial
    error, // Cualquier error que haya ocurrido
    hasPermission, // Si se otorgó el permiso de ubicación
  };
};
