import {
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
} from "@/libs/notifications";
import * as Notifications from "expo-notifications";
import { useEffect, useRef } from "react";

/**
 * Hook personalizado para manejar notificaciones en la aplicación
 *
 * Este hook se encarga de escuchar:
 * 1. Notificaciones recibidas cuando la app está abierta
 * 2. Cuando el usuario toca una notificación
 *
 * @example
 * ```typescript
 * // Uso en un componente:
 * useNotifications({
 *   onNotificationReceived: (notification) => {
 *     console.log('Nueva notificación:', notification.request.content.title);
 *   },
 *   onNotificationTapped: (response) => {
 *     console.log('Notificación tocada:', response.notification.request.content.data);
 *     // Aquí puedes navegar a una pantalla específica según los datos
 *   }
 * });
 * ```
 */
export function useNotifications(config?: {
  onNotificationReceived?: (notification: Notifications.Notification) => void;
  onNotificationTapped?: (response: Notifications.NotificationResponse) => void;
}) {
  // Usamos useRef para guardar las suscripciones
  // Esto evita que se creen múltiples listeners
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    // Configurar listener para notificaciones recibidas
    if (config?.onNotificationReceived) {
      notificationListener.current = addNotificationReceivedListener(
        config.onNotificationReceived,
      );
    }

    // Configurar listener para cuando se toca una notificación
    if (config?.onNotificationTapped) {
      responseListener.current = addNotificationResponseReceivedListener(
        config.onNotificationTapped,
      );
    }

    // Función de limpieza: se ejecuta cuando el componente se desmonta
    // Es importante remover los listeners para evitar memory leaks
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
        notificationListener.current = null;
      }
      if (responseListener.current) {
        responseListener.current.remove();
        responseListener.current = null;
      }
    };
  }, [config?.onNotificationReceived, config?.onNotificationTapped]);
}
