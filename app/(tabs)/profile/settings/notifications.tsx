import { FadeInView } from "@/components/animations/fade-in-view";
import Header from "@/components/header";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/libs/api";
import {
  getExpoPushToken,
  hasNotificationPermissions,
  requestNotificationPermissions,
} from "@/libs/notifications";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const Notifications = () => {
  // Estado local del switch (mientras se actualiza en el servidor)
  const [isEnabled, setIsEnabled] = useState(false);
  // Estado para mostrar un indicador de carga mientras se procesa
  const [isLoading, setIsLoading] = useState(false);
  // Obtener el usuario del contexto de autenticación
  const { user, checkAuthState } = useAuth();

  /**
   * useEffect se ejecuta cuando el componente se monta
   * Aquí inicializamos el estado del switch basándonos en el usuario
   */
  useEffect(() => {
    if (user) {
      // Si el usuario tiene el campo notifications, usamos ese valor
      // Si no lo tiene (undefined), asumimos que están desactivadas (false)
      setIsEnabled(user.notifications ?? false);
    }
  }, [user]);

  /**
   * Función que se ejecuta cuando el usuario cambia el switch
   * @param value - El nuevo valor del switch (true o false)
   */
  const handleToggleNotifications = async (value: boolean) => {
    // Verificamos que tengamos un usuario autenticado
    if (!user) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo obtener la información del usuario",
      });
      return;
    }

    try {
      setIsLoading(true);
      let expoToken = "";

      if (value) {
        // Si el usuario quiere ACTIVAR las notificaciones

        // Paso 1: Verificar si ya tiene permisos
        const hasPermissions = await hasNotificationPermissions();

        if (!hasPermissions) {
          // Si no tiene permisos, los solicitamos
          const granted = await requestNotificationPermissions();

          if (!granted) {
            // Si el usuario rechazó los permisos, mostramos una alerta
            Alert.alert(
              "Permisos requeridos",
              "Necesitas activar los permisos de notificaciones en la configuración de tu dispositivo para recibir notificaciones.",
              [{ text: "OK" }],
            );
            return; // Salimos sin cambiar nada
          }
        }

        // Paso 2: Obtener el token de notificaciones de Expo
        const token = await getExpoPushToken();

        if (!token) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "No se pudo obtener el token de notificaciones",
          });
          return;
        }

        expoToken = token;
      }

      // Paso 3: Actualizar el estado local inmediatamente (optimistic update)
      // Esto hace que la interfaz se sienta más rápida
      setIsEnabled(value);

      // Paso 4: Enviar la actualización al servidor
      await api.updateNotifications(user.access, value, expoToken);

      // Paso 5: Actualizar el estado del usuario en el contexto
      // Esto sincroniza el estado global de la app
      await checkAuthState?.();

      // Mostrar un mensaje de éxito
      Toast.show({
        type: "success",
        text1: "Notificaciones actualizadas",
        text2: value
          ? "Recibirás notificaciones push"
          : "No recibirás más notificaciones push",
      });
    } catch (error) {
      // Si algo salió mal, revertimos el cambio en el switch
      setIsEnabled(!value);

      console.error("Error toggling notifications:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudieron actualizar las notificaciones",
      });
    } finally {
      // Siempre desactivamos el loading al final
      setIsLoading(false);
    }
  };

  return (
    <ThemedBackground style={styles.container} safeArea={false}>
      <Header
        title={"Notificaciones"}
        description={"Configura tus notificaciones"}
        onBack={() => router.back()}
      />
      <View style={styles.content}>
        <FadeInView delay={100}>
          <View style={styles.sectionContainer}>
            <View style={styles.textContainer}>
              <ThemedText type="defaultSemiBold">
                Notificaciones Push
              </ThemedText>
              <ThemedText type="muted">
                Recibe notificaciones sobre nuevos recorridos y actualizaciones
              </ThemedText>
            </View>
            {/* Si está cargando, mostramos un spinner, sino el switch */}
            {isLoading ? (
              <ActivityIndicator size="small" />
            ) : (
              <Switch
                value={isEnabled}
                onValueChange={handleToggleNotifications}
                disabled={isLoading}
              />
            )}
          </View>
        </FadeInView>
      </View>
    </ThemedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    marginTop: 0,
    paddingInline: 0,
    paddingHorizontal: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 30,
  },
  sectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  textContainer: {
    flex: 1,
    gap: 5,
  },
});

export default Notifications;
