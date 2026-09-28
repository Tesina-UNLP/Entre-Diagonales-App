import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  TourGuideOverlay,
  TourGuideProvider,
  useTourGuide,
  type TourButtonProps,
  type TooltipProps,
  type TourStep,
} from "@wrack/react-native-tour-guide";
import { trackProductEvent } from "@/libs/telemetry";
import { useTranslation } from "react-i18next";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
  type ReactNode,
} from "react";
import {
  InteractionManager,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

const STORAGE_KEY = "tutorial_version";
const TUTORIAL_VERSION = 2;

export type TutorialContextId = "home" | "tour" | "camera" | "quiz" | "rewards";
type TutorialTriggerOptions = { scrollRef?: RefObject<any> };

type TutorialState = {
  version: number;
  completed: Partial<Record<TutorialContextId, true>>;
};

type TutorialContextValue = {
  triggerTutorial: (
    context: TutorialContextId,
    force?: boolean,
    options?: TutorialTriggerOptions,
  ) => Promise<boolean>;
  restartTutorials: () => Promise<void>;
  ready: boolean;
};

const TutorialContext = createContext<TutorialContextValue | undefined>(
  undefined,
);

const emptyState = (): TutorialState => ({
  version: TUTORIAL_VERSION,
  completed: {},
});

function TutorialBackButton({ label, onPress, disabled }: TourButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.backButton, disabled && styles.backButtonDisabled]}
    >
      <Text style={styles.backButtonText}>{label}</Text>
    </Pressable>
  );
}

function TutorialNextButton({ label, onPress, disabled }: TourButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.nextButton, disabled && styles.backButtonDisabled]}
    >
      <Text style={styles.nextButtonText}>{label}</Text>
    </Pressable>
  );
}

function HomeFinalTooltip({
  title,
  description,
  position,
  targetWidth = 0,
  currentStep,
  totalSteps,
  onNext,
  onSkip,
  nextDisabled,
  config,
  screenWidth = 360,
  insets,
}: TooltipProps) {
  const width = Math.min(320, screenWidth - 32);
  const left = Math.max(
    16,
    Math.min(
      position.x + targetWidth / 2 - width / 2,
      screenWidth - width - 16,
    ),
  );
  const top = Math.max(insets?.top ?? 16, position.y - 238);

  return (
    <View style={[styles.homeFinalTooltip, { width, left, top }]}>
      <View style={styles.homeFinalHeader}>
        <Text style={styles.homeFinalTitle}>{title}</Text>
        <Pressable
          onPress={onSkip}
          style={styles.homeFinalSkip}
          accessibilityRole="button"
        >
          <Text style={styles.homeFinalSkipText}>{config?.skipButtonText}</Text>
        </Pressable>
      </View>
      <Text style={styles.homeFinalDescription}>{description}</Text>
      <View style={styles.homeFinalDots}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.homeFinalDot,
              index === currentStep && styles.homeFinalDotActive,
            ]}
          />
        ))}
      </View>
      <View style={styles.homeFinalFooter}>
        <Text style={styles.homeFinalCounter}>
          {currentStep + 1}/{totalSteps}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: nextDisabled }}
          disabled={nextDisabled}
          onPress={onNext}
          style={[
            styles.homeFinalDone,
            nextDisabled && styles.backButtonDisabled,
          ]}
        >
          <Text style={styles.homeFinalDoneText}>{config?.doneButtonText}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function TutorialController({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { startTour, isActive, canStartTour } = useTourGuide();
  const [state, setState] = useState<TutorialState>(emptyState);
  const [ready, setReady] = useState(false);
  const stateRef = useRef(state);
  const activeContextRef = useRef<TutorialContextId | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed = raw ? (JSON.parse(raw) as TutorialState) : null;
        const next =
          parsed?.version === TUTORIAL_VERSION ? parsed : emptyState();
        setState(next);
        if (!parsed || parsed.version !== TUTORIAL_VERSION) {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
      } catch {
        setState(emptyState());
      } finally {
        setReady(true);
      }
    };
    void load();
  }, []);

  const persistCompletion = useCallback(async (context: TutorialContextId) => {
    const next: TutorialState = {
      ...stateRef.current,
      version: TUTORIAL_VERSION,
      completed: { ...stateRef.current.completed, [context]: true },
    };
    stateRef.current = next;
    setState(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // The tutorial remains complete for this session even if local storage fails.
    }
  }, []);

  const stepsFor = useCallback(
    (context: TutorialContextId): TourStep[] => {
      const step = (
        id: string,
        targetId: string,
        title: string,
        description: string,
      ): TourStep => ({
        id,
        targetId,
        title,
        description,
        tooltipPosition: "auto",
        spotlightPadding: 8,
        accessibilityLabel: `${title}. ${description}`,
      });

      switch (context) {
        case "home":
          return [
            step(
              "progress",
              "tutorial-home-progress",
              t("tutorial.home.welcomeTitle"),
              t("tutorial.home.welcomeDescription"),
            ),
            {
              ...step(
                "tours",
                "tutorial-home-tours",
                t("tutorial.home.toursTitle"),
                t("tutorial.home.toursDescription"),
              ),
              hidePrevButton: true,
              renderTooltip: (props) => <HomeFinalTooltip {...props} />,
            },
          ];
        case "tour":
          return [
            step(
              "complete",
              "tutorial-tour-complete",
              t("tutorial.tour.completeTitle"),
              t("tutorial.tour.completeDescription"),
            ),
            step(
              "map",
              "tutorial-tour-map",
              t("tutorial.tour.mapTitle"),
              t("tutorial.tour.mapDescription"),
            ),
            step(
              "secret",
              "tutorial-tour-secret",
              t("tutorial.tour.secretTitle"),
              t("tutorial.tour.secretDescription"),
            ),
          ];
        case "camera":
          return [
            step(
              "frame",
              "tutorial-camera-frame",
              t("tutorial.camera.frameTitle"),
              t("tutorial.camera.frameDescription"),
            ),
            step(
              "capture",
              "tutorial-camera-capture",
              t("tutorial.camera.captureTitle"),
              t("tutorial.camera.captureDescription"),
            ),
          ];
        case "quiz":
          return [
            step(
              "quiz",
              "tutorial-quiz-card",
              t("tutorial.quiz.cardTitle"),
              t("tutorial.quiz.cardDescription"),
            ),
          ];
        case "rewards":
          return [
            step(
              "rewards",
              "tutorial-rewards-summary",
              t("tutorial.rewards.summaryTitle"),
              t("tutorial.rewards.summaryDescription"),
            ),
            step(
              "next",
              "tutorial-rewards-actions",
              t("tutorial.rewards.actionsTitle"),
              t("tutorial.rewards.actionsDescription"),
            ),
          ];
      }
    },
    [t],
  );

  const triggerTutorial = useCallback(
    async (
      context: TutorialContextId,
      force = false,
      options?: TutorialTriggerOptions,
    ) => {
      if (
        !ready ||
        isActive ||
        activeContextRef.current ||
        (!force && stateRef.current.completed[context])
      ) {
        return false;
      }

      activeContextRef.current = context;
      InteractionManager.runAfterInteractions(() => {
        const startWhenTargetsAreReady = async () => {
          let steps = stepsFor(context);
          const secretStep = steps.find((step) => step.id === "secret");

          // La lista de paradas entra después de la animación inicial. Esperar
          // su tarjeta evita omitir el secreto por una carrera de montaje.
          if (context === "tour" && secretStep) {
            let secretIsReady = canStartTour([secretStep]);
            for (
              let attempt = 0;
              attempt < 10 && !secretIsReady;
              attempt += 1
            ) {
              await new Promise((resolve) => setTimeout(resolve, 100));
              secretIsReady = canStartTour([secretStep]);
            }
            if (!secretIsReady) {
              steps = steps.filter((step) => step.id !== "secret");
            }
          }

          startTour(steps, {
            tourId: `entre-diagonales-${TUTORIAL_VERSION}-${context}`,
            showProgressDots: true,
            scrollRef: options?.scrollRef,
            waitForInteractions: true,
            nextButtonText: t("tutorial.actions.next"),
            prevButtonText: t("tutorial.actions.back"),
            skipButtonText: t("tutorial.actions.skip"),
            doneButtonText: t("tutorial.actions.done"),
            components: {
              PrevButton: TutorialBackButton,
              NextButton: TutorialNextButton,
            },
            tooltipStyles: {
              backgroundColor: "#004643",
              titleColor: "#FFFFFF",
              descriptionColor: "#FFFFFF",
              buttonTextColor: "#FFFFFF",
              primaryButtonColor: "#F4881B",
              borderRadius: 18,
            },
            spotlightStyles: {
              overlayOpacity: 0.72,
              enablePulse: true,
              pulseColor: "#F4881B",
            },
            onTourStart: () =>
              trackProductEvent("tutorial_started", {
                context,
                version: TUTORIAL_VERSION,
              }),
            onStepChange: (_from, to) =>
              trackProductEvent("tutorial_step_viewed", {
                context,
                step: to + 1,
              }),
            onTourEnd: (completed) => {
              activeContextRef.current = null;
              void persistCompletion(context);
              trackProductEvent(
                completed ? "tutorial_completed" : "tutorial_dismissed",
                { context, version: TUTORIAL_VERSION },
              );
            },
          });
        };
        void startWhenTargetsAreReady();
      });
      return true;
    },
    [canStartTour, isActive, persistCompletion, ready, startTour, stepsFor, t],
  );

  const restartTutorials = useCallback(async () => {
    const next = emptyState();
    stateRef.current = next;
    setState(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    trackProductEvent("tutorial_restarted", { version: TUTORIAL_VERSION });
    router.navigate("/(tabs)");
    setTimeout(() => void triggerTutorial("home", true), 350);
  }, [triggerTutorial]);

  const value = useMemo(
    () => ({ triggerTutorial, restartTutorials, ready }),
    [ready, restartTutorials, triggerTutorial],
  );
  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
}

export function TutorialProvider({ children }: { children: ReactNode }) {
  return (
    <TourGuideProvider>
      <TutorialController>{children}</TutorialController>
      <TourGuideOverlay />
    </TourGuideProvider>
  );
}

export function useTutorial() {
  const value = useContext(TutorialContext);
  if (!value)
    throw new Error("useTutorial must be used within TutorialProvider");
  return value;
}

const styles = StyleSheet.create({
  backButton: {
    width: 96,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  backButtonDisabled: { opacity: 0.45 },
  backButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  nextButton: {
    width: 96,
    backgroundColor: "#F4881B",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  nextButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  homeFinalTooltip: {
    position: "absolute",
    backgroundColor: "#004643",
    borderRadius: 18,
    padding: 20,
    gap: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  homeFinalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  homeFinalTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
  },
  homeFinalSkip: {
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  homeFinalSkipText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  homeFinalDescription: { color: "#FFFFFF", fontSize: 16, lineHeight: 23 },
  homeFinalDots: { flexDirection: "row", justifyContent: "center", gap: 7 },
  homeFinalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#79AAA5",
  },
  homeFinalDotActive: { width: 28, backgroundColor: "#F4881B" },
  homeFinalFooter: {
    height: 48,
    justifyContent: "center",
    position: "relative",
  },
  homeFinalCounter: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    position: "absolute",
    left: 0,
  },
  homeFinalDone: {
    alignSelf: "center",
    minWidth: 100,
    backgroundColor: "#F4881B",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
  },
  homeFinalDoneText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
