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
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import Toast from "react-native-toast-message";

const backgroundImage = require("../../assets/images/onboarding/background.png");

const Choice = () => {
  const { completeOnboarding, user } = useAuth();
  const { width } = useWindowDimensions();
  const [npcs, setNpcs] = useState<CharacterApiResponse[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [largeImageFailed, setLargeImageFailed] = useState(false);
  const [showNotificationsPrompt, setShowNotificationsPrompt] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const fetchNpcs = useCallback(async () => {
    const token = user?.access;
    if (!token) return;

    setIsLoading(true);
    setHasLoadError(false);

    try {
      const data = await api.getCharacters(token);
      setNpcs(data);
      setSelectedIndex(0);
      setHasLoadError(data.length === 0);
    } catch {
      setNpcs([]);
      setHasLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }, [user?.access]);

  useEffect(() => {
    void fetchNpcs();
  }, [fetchNpcs]);

  useEffect(() => {
    setLargeImageFailed(false);
  }, [selectedIndex]);

  const selectedNpc = npcs[selectedIndex];
  const stageHeight = Math.max(500, Math.min(570, width * 1.38));

  const selectRelativeCharacter = useCallback(
    (offset: number) => {
      if (npcs.length < 2) return;
      setSelectedIndex(
        (current) => (current + offset + npcs.length) % npcs.length,
      );
    },
    [npcs.length],
  );

  const swipeGesture = Gesture.Pan()
    .enabled(npcs.length > 1)
    .activeOffsetX([-20, 20])
    .failOffsetY([-20, 20])
    .onEnd((event) => {
      if (event.translationX < -50) {
        runOnJS(selectRelativeCharacter)(1);
      } else if (event.translationX > 50) {
        runOnJS(selectRelativeCharacter)(-1);
      }
    });

  const finishOnboarding = async (notificationToken = "") => {
    if (!selectedNpc) return;

    try {
      setIsCompleting(true);
      await completeOnboarding({
        characterId: selectedNpc.id,
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
      console.error("Error al configurar notificaciones:", error);
    }

    setShowNotificationsPrompt(false);
    await finishOnboarding(notificationToken);
  };

  const characterImageUrl =
    !largeImageFailed && selectedNpc?.large_image_url
      ? selectedNpc.large_image_url
      : selectedNpc?.image_url;

  return (
    <ThemedBackground style={styles.container}>
      <FadeInView delay={100} style={styles.header}>
        <View style={styles.actionBack}>
          <TouchableOpacity
            accessibilityLabel="Volver"
            hitSlop={12}
            onPress={() => router.replace("/(onboarding)/presentation")}
          >
            <MaterialIcons name="arrow-back" size={30} color={TOKENS.muted} />
          </TouchableOpacity>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar} />
        </View>

        <View style={styles.actionNext} />
      </FadeInView>

      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <FadeInView delay={200} style={styles.heading}>
          <ThemedText type="title" style={styles.title}>
            ¿Quién te acompaña?
          </ThemedText>
          <ThemedText type="bigMuted" style={styles.subtitle}>
            Deslizá y elegí tu personaje
          </ThemedText>
        </FadeInView>

        <GestureDetector gesture={swipeGesture}>
          <View style={[styles.stage, { height: stageHeight }]}>
            <Image
              resizeMode="contain"
              source={backgroundImage}
              style={[
                styles.backgroundImage,
                { height: width * (1176 / 780), width },
              ]}
            />

            {isLoading ? (
              <View style={styles.stateContainer}>
                <ActivityIndicator color={TOKENS.muted} size="large" />
                <ThemedText type="muted">Cargando...</ThemedText>
              </View>
            ) : hasLoadError || !selectedNpc ? (
              <View style={styles.stateContainer}>
                <ThemedText type="bigMuted" style={styles.stateText}>
                  No pudimos cargar los personajes.
                </ThemedText>
                <ThemedButton
                  onPress={() => void fetchNpcs()}
                  size="small"
                  style={styles.retryButton}
                  variant="outline"
                >
                  Intentar nuevamente
                </ThemedButton>
              </View>
            ) : (
              <>
                {characterImageUrl ? (
                  <FadeInView
                    key={`character-image-${selectedNpc.id}`}
                    duration={250}
                    style={styles.characterImageContainer}
                  >
                    <Image
                      accessibilityIgnoresInvertColors
                      onError={() => setLargeImageFailed(true)}
                      resizeMode="contain"
                      source={{ uri: characterImageUrl }}
                      style={styles.characterImage}
                    />
                  </FadeInView>
                ) : null}

                <FadeInView
                  key={selectedNpc.id}
                  duration={250}
                  style={styles.characterInfo}
                >
                  <ThemedText
                    adjustsFontSizeToFit
                    minimumFontScale={0.72}
                    numberOfLines={1}
                    style={styles.characterName}
                    type="title"
                  >
                    {selectedNpc.name}
                  </ThemedText>
                  {selectedNpc.tagline ? (
                    <ThemedText
                      style={styles.characterTagline}
                      translateContent={false}
                    >
                      {selectedNpc.tagline.toLocaleUpperCase()}
                    </ThemedText>
                  ) : null}
                  <ThemedText
                    style={styles.characterDescription}
                    translateContent={false}
                    type="bigMuted"
                  >
                    {selectedNpc.description}
                  </ThemedText>
                </FadeInView>

                <View style={styles.carouselNavigation}>
                  <TouchableOpacity
                    accessibilityLabel="Personaje anterior"
                    disabled={npcs.length < 2}
                    onPress={() => selectRelativeCharacter(-1)}
                    style={styles.carouselButton}
                    testID="previous-character"
                  >
                    <MaterialIcons
                      color={TOKENS.muted}
                      name="arrow-back"
                      size={30}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    accessibilityLabel="Personaje siguiente"
                    disabled={npcs.length < 2}
                    onPress={() => selectRelativeCharacter(1)}
                    style={styles.carouselButton}
                    testID="next-character"
                  >
                    <MaterialIcons
                      color={TOKENS.muted}
                      name="arrow-forward"
                      size={30}
                    />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </GestureDetector>
      </ScrollView>

      <FadeInView delay={400} style={styles.footer}>
        <ThemedButton
          disabled={!selectedNpc || hasLoadError}
          loading={isCompleting}
          onPress={() => setShowNotificationsPrompt(true)}
          variant="primary"
        >
          Iniciar aventuras
        </ThemedButton>
      </FadeInView>

      <Modal
        animationType="fade"
        onRequestClose={() => setShowNotificationsPrompt(false)}
        transparent
        visible={showNotificationsPrompt}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <MaterialIcons
              color={TOKENS.primary}
              name="notifications-active"
              size={36}
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
                loading={isCompleting}
                onPress={requestNotificationsAndFinish}
                variant="primary"
              >
                Sí, activar
              </ThemedButton>
              <ThemedButton
                disabled={isCompleting}
                onPress={() => {
                  setShowNotificationsPrompt(false);
                  void finishOnboarding();
                }}
                variant="ghost"
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
    paddingInline: 0,
    paddingTop: 30,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    width: "100%",
  },
  actionBack: { flex: 1, height: 30, justifyContent: "center" },
  actionNext: { flex: 1, height: 30 },
  progressBarContainer: {
    backgroundColor: TOKENS.primary,
    borderRadius: 2,
    height: 4,
    width: 100,
  },
  progressBar: {
    backgroundColor: TOKENS.muted,
    borderRadius: 2,
    height: 4,
    width: "100%",
  },
  scroll: { flex: 1, width: "100%" },
  scrollContent: { flexGrow: 1 },
  heading: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  title: {
    fontSize: 27,
    lineHeight: 34,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 26,
    marginTop: 4,
    textAlign: "center",
  },
  stage: {
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
  backgroundImage: {
    left: 0,
    position: "absolute",
    top: 0,
  },
  characterImageContainer: {
    bottom: 58,
    height: "78%",
    left: 0,
    position: "absolute",
    width: "54%",
  },
  characterImage: {
    height: "100%",
    width: "100%",
  },
  characterInfo: {
    left: "48%",
    position: "absolute",
    right: 18,
    top: "16%",
  },
  characterName: {
    fontFamily: "ClashDisplayBold",
    fontSize: 42,
    lineHeight: 48,
  },
  characterTagline: {
    color: TOKENS.accent,
    fontFamily: "ClashDisplay",
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 10,
  },
  characterDescription: {
    fontSize: 15,
    lineHeight: 23,
  },
  carouselNavigation: {
    alignItems: "center",
    bottom: 16,
    flexDirection: "row",
    gap: 48,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
  },
  carouselButton: {
    alignItems: "center",
    borderColor: "rgba(140, 188, 176, 0.45)",
    borderRadius: 24,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  stateContainer: {
    alignItems: "center",
    flex: 1,
    gap: 16,
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  stateText: { textAlign: "center" },
  retryButton: { width: 220 },
  footer: {
    paddingBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 8,
    width: "100%",
  },
  modalBackdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    flex: 1,
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
  modalActions: { gap: 8, width: "100%" },
});

export default Choice;
