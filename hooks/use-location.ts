import * as Location from "expo-location";
import { useEffect, useState } from "react";

// Interfaz para definir qué datos retorna nuestro hook
export interface LocationData {
  coords: Location.LocationObjectCoords;
  timestamp: number;
}

const INITIAL_LOCATION_TIMEOUT_MS = 8_000;

// Hook personalizado para manejar la ubicación del usuario
export const useLocation = () => {
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
    // Variable para almacenar la suscripción a la ubicación para poder limpiarla después
    let locationSubscription: Location.LocationSubscription | null = null;

    // Función asíncrona para solicitar permisos y obtener la ubicación
    const obtenerUbicacion = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Solicitamos permiso para acceder a la ubicación
        const { status } = await Location.requestForegroundPermissionsAsync();

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
        if (lastKnownLocation) {
          setLocation(lastKnownLocation.coords);
        }

        // En simuladores o interiores una lectura de alta precisión puede tardar
        // indefinidamente. Esperamos un tiempo acotado y dejamos que el watcher
        // continúe actualizando cuando haya señal.
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
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

        if (ubicacionActual) {
          setLocation(ubicacionActual.coords);
        }
        setIsLoading(false);

        // Observamos los cambios en la ubicación
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000, // Actualizar cada 5 segundos
            distanceInterval: 10, // O cuando el usuario se mueve 10 metros
          },
          (newLocation) => {
            setLocation(newLocation.coords);
          },
        );
      } catch (e: any) {
        setError(e?.message || "Error al obtener ubicación");
        setIsLoading(false);
      }
    };

    // Llamamos a la función para obtener la ubicación
    obtenerUbicacion();

    // Función de limpieza: cancelamos la suscripción cuando el componente se desmonta
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []); // Array vacío significa que esto se ejecuta una vez al montar

  // Retornamos todos los valores de estado para que los componentes puedan usarlos
  return {
    location, // Las coordenadas de ubicación actuales
    isLoading, // Si estamos cargando la ubicación inicial
    error, // Cualquier error que haya ocurrido
    hasPermission, // Si se otorgó el permiso de ubicación
  };
};
