import { FadeInView } from "@/components/animations/fade-in-view";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/libs/api";
import {
  getExpoPushToken,
  requestNotificationPermissions,
} from "@/libs/notifications";
import { CharacterApiResponse } from "@/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const xThinkingImage = require("../../assets/images/onboarding/choice.png");

const Choice = () => {
  const { completeOnboarding, user } = useAuth();
  const [npcs, setNpcs] = useState<CharacterApiResponse[]>([]);
  const [selectedNpc, setSelectedNpc] = useState<number | null>(null);
  const [showNotificationsPrompt, setShowNotificationsPrompt] =
    useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  // Efecto para cargar los personajes disponibles
  useEffect(() => {
    const fetchNpcs = async () => {
      const token = user?.access;
      if (!token) return;
      const data = await api.getCharacters(token);
      setNpcs(data);
    };

    fetchNpcs();
  }, [user]);

  const finishOnboarding = async (notificationToken = "") => {
    try {
      if (!selectedNpc) return;
      setIsCompleting(true);
      await completeOnboarding({
        characterId: selectedNpc,
        notificationToken,
      });
      router.replace("/(tabs)");
    } catch (error: any) {
      const message = error?.message || "Error desconocido";
      Toast.show({
        type: "error",
        text1: "Error al completar el onboarding",
        text2: message,
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const requestNotificationsAndFinish = async () => {
    let notificationToken = "";

    try {
      const granted = await requestNotificationPermissions();
      if (granted) {
        notificationToken = (await getExpoPushToken()) ?? "";
      }
    } catch (error) {
      // Un error al registrar notificaciones no debe impedir usar la app.
      console.error("Error al configurar notificaciones:", error);
    }

    setShowNotificationsPrompt(false);
    await finishOnboarding(notificationToken);
  };

  const back = () => {
    router.replace("/(onboarding)/presentation");
  };

  return (
    <ThemedBackground style={styles.container}>
      <FadeInView delay={100} style={styles.header}>
        <View style={styles.actionBack}>
          <TouchableOpacity onPress={() => back()}>
            <MaterialIcons name="arrow-back" size={24} color={TOKENS.muted} />
          </TouchableOpacity>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar]} />
        </View>

        <View style={styles.actionNext} />
      </FadeInView>
      <FadeInView delay={300} style={styles.content}>
        <ThemedText type="title">Elige tu personaje</ThemedText>
        <ThemedText type="bigMuted" style={styles.description}>
          Selecciona el personaje que más te guste para acompañarte en tu viaje
          de aprendizaje.
        </ThemedText>

        <View style={styles.grid}>
          {npcs?.map(({ id, name, image_url }: any) => (
            <TouchableOpacity
              key={id}
              onPress={() => setSelectedNpc(Number(id))}
              style={styles.personButton}
            >
              <View
                style={{
                  borderRadius: 100,
                  borderWidth: 3,
                  borderColor:
                    selectedNpc === Number(id) ? "#8CBCB0" : "transparent",
                }}
              >
                <Image
                  source={{ uri: image_url }}
                  style={styles.personImage}
                  resizeMode="contain"
                />
              </View>
              <ThemedText type="muted" style={styles.personName}>
                {name}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
        <Image
          source={xThinkingImage}
          style={styles.xImage}
          resizeMode="contain"
        />
      </FadeInView>
      {selectedNpc && (
        <FadeInView delay={400} style={styles.navigationContainer}>
          <ThemedButton
            variant="primary"
            onPress={() => setShowNotificationsPrompt(true)}
            loading={isCompleting}
          >
            Iniciar aventuras
          </ThemedButton>
        </FadeInView>
      )}
      <Modal
        visible={showNotificationsPrompt}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNotificationsPrompt(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <MaterialIcons
              name="notifications-active"
              size={36}
              color={TOKENS.primary}
            />
            <ThemedText type="title" style={styles.modalTitle}>
              ¿Activar notificaciones?
            </ThemedText>
            <ThemedText type="muted" style={styles.modalDescription}>
              Te avisaremos de nuevos recorridos y recordatorios para continuar
              tus aventuras. Podés cambiarlas cuando quieras desde Ajustes.
            </ThemedText>
            <View style={styles.modalActions}>
              <ThemedButton
                variant="primary"
                onPress={requestNotificationsAndFinish}
                loading={isCompleting}
              >
                Sí, activar
              </ThemedButton>
              <ThemedButton
                variant="ghost"
                onPress={() => {
                  setShowNotificationsPrompt(false);
                  finishOnboarding();
                }}
                disabled={isCompleting}
              >
                Ahora no
              </ThemedButton>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  actionBack: { flex: 1, height: 24 },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 20,
    paddingTop: 40,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    textAlign: "center",
    paddingHorizontal: 20,
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
  },
  progressBarContainer: {
    width: 100,
    height: 4,
    borderRadius: 2,
    backgroundColor: TOKENS.primary,
  },
  progressBar: {
    height: 4,
    backgroundColor: TOKENS.muted,
    borderRadius: 2,
  },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionNext: { flex: 1, height: 24 },
  personButton: { marginBottom: 20, alignItems: "center", width: "30%" },
  personImage: { width: 80, height: 80, borderRadius: 100 },
  personName: { marginTop: 8 },
  xImage: { width: 250, height: 250 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    alignItems: "center",
    backgroundColor: TOKENS.background,
    borderRadius: 20,
    gap: 16,
    padding: 28,
  },
  modalTitle: { textAlign: "center" },
  modalDescription: { textAlign: "center" },
  modalActions: { width: "100%", gap: 8 },
});

export default Choice;
