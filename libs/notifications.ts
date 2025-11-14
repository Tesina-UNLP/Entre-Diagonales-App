import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * Configura el canal de notificaciones para Android
 * Esto es necesario para que las notificaciones muestren banners cuando la app está cerrada
 * En Android 8.0+ (API 26+), todas las notificaciones deben pertenecer a un canal
 *
 * IMPORTANTE: La importancia (importance) debe ser HIGH para que las notificaciones
 * muestren banners cuando la app está en segundo plano o cerrada
 */
export async function setupNotificationChannel(): Promise<void> {
  // Solo configuramos el canal en Android
  if (Platform.OS === "android") {
    try {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        description: "Canal para todas las notificaciones de la aplicación",
        importance: Notifications.AndroidImportance.MAX, // IMPORTANTE: HIGH hace que muestre banners
        vibrationPattern: [0, 250, 250, 250], // Patrón de vibración
        lightColor: "#004643", // Color del LED (si el dispositivo lo soporta)
        sound: "./assets/sfx/notifications.wav", // Sonido personalizado
        enableVibrate: true, // Activar vibración
        showBadge: true, // Mostrar badge en el ícono
      });
    } catch (error) {
      console.error("Error setting up notification channel:", error);
    }
  }
}

// Configuramos el canal al iniciar el módulo
setupNotificationChannel();

/**
 * Configura cómo se mostrarán las notificaciones cuando la app está en primer plano
 * Este es el comportamiento por defecto
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true, // Reproducir sonido
    shouldSetBadge: true, // Mostrar badge en el ícono
    shouldShowBanner: true, // Mostrar banner en la parte superior de la pantalla
    shouldShowList: true, // Mostrar lista de notificaciones
  }),
});

/**
 * Solicita permisos al usuario para enviar notificaciones push
 * @returns {Promise<boolean>} - true si se concedió el permiso, false si no
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    // Primero configuramos el canal de notificaciones en Android
    // Esto asegura que las notificaciones muestren banners cuando la app está cerrada
    await setupNotificationChannel();

    // En Android 13+, se necesita pedir permisos explícitamente
    // En iOS, siempre se necesita pedir permisos
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Si no tenemos permisos, los solicitamos
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Devolvemos true si el permiso fue concedido
    return finalStatus === "granted";
  } catch (error) {
    console.error("Error requesting notification permissions:", error);
    return false;
  }
}

/**
 * Verifica si el usuario ya ha concedido permisos para notificaciones
 * @returns {Promise<boolean>} - true si tiene permisos, false si no
 */
export async function hasNotificationPermissions(): Promise<boolean> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Error checking notification permissions:", error);
    return false;
  }
}

/**
 * Obtiene el token de Expo Push Notifications
 * Este token es único para cada dispositivo y se usa para enviar notificaciones
 * @returns {Promise<string | null>} - El token o null si hubo un error
 */
export async function getExpoPushToken(): Promise<string | null> {
  try {
    // Verificamos que tengamos permisos
    const hasPermissions = await hasNotificationPermissions();
    if (!hasPermissions) {
      console.warn("No notification permissions");
      return null;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    // En dispositivos físicos, obtenemos el token
    // En emuladores/simuladores, puede no funcionar
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId, // ID del proyecto Expo
    });

    return tokenData.data;
  } catch (error) {
    console.error("Error getting push token:", error);
    return null;
  }
}

/**
 * Configura un listener para notificaciones recibidas cuando la app está abierta
 * @param callback - Función que se ejecutará cuando llegue una notificación
 * @returns {Notifications.Subscription} - Suscripción que se puede cancelar
 */
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void,
): Notifications.Subscription {
  return Notifications.addNotificationReceivedListener(callback);
}

/**
 * Configura un listener para cuando el usuario toca una notificación
 * @param callback - Función que se ejecutará cuando se toque una notificación
 * @returns {Notifications.Subscription} - Suscripción que se puede cancelar
 */
export function addNotificationResponseReceivedListener(
  callback: (response: Notifications.NotificationResponse) => void,
): Notifications.Subscription {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

/**
 * Envía una notificación local (para pruebas)
 * @param title - Título de la notificación
 * @param body - Cuerpo de la notificación
 * @param data - Datos adicionales (opcional)
 */
export async function scheduleLocalNotification(
  title: string,
  body: string,
  data?: Record<string, unknown>,
): Promise<string> {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
    },
    trigger: null, // null = mostrar inmediatamente
  });
}

/**
 * Cancela todas las notificaciones programadas
 */
export async function cancelAllScheduledNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
