// contexts/feedback.tsx (SDK 53/54 - expo-audio)
import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

type HapticType = "light" | "medium" | "heavy" | "success" | "error";
type SoundKey =
  | "success"
  | "error"
  | "achievement"
  | "secretFound"
  | "tourCompleted"
  | "notification";

interface Ctx {
  hapticsEnabled: boolean;
  soundsEnabled: boolean;
  isReady: boolean;
  toggleHaptics: () => Promise<void>;
  toggleSounds: () => Promise<void>;
  haptic: (t?: HapticType) => Promise<void>;
  playSound: (k: SoundKey) => Promise<void>;
}

export const HapticsContext = createContext<Ctx>({
  hapticsEnabled: true,
  soundsEnabled: true,
  isReady: false,
  toggleHaptics: async () => {},
  toggleSounds: async () => {},
  haptic: async () => {},
  playSound: async () => {},
});

const SKEY = { H: "settings-haptics-enabled", S: "settings-sounds-enabled" };

// Helpers de persistencia
async function getBool(key: string, fallback = true) {
  if (Platform.OS === "web") return fallback;
  const v = await SecureStore.getItemAsync(key);
  return v === "false" ? false : fallback;
}
async function setBool(key: string, value: boolean) {
  if (Platform.OS === "web") return;
  await SecureStore.setItemAsync(key, value ? "true" : "false");
}

export function HapticsProvider({ children }: { children: React.ReactNode }) {
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // 🎵 Define tus SFX acá (pueden ser mp3/wav locales)
  const players = {
    success: useAudioPlayer(require("@/assets/sfx/success.wav")),
    error: useAudioPlayer(require("@/assets/sfx/wrong.wav")),
    achievement: useAudioPlayer(require("@/assets/sfx/achievement.wav")),
    secretFound: useAudioPlayer(require("@/assets/sfx/secret-found.wav")),
    tourCompleted: useAudioPlayer(require("@/assets/sfx/tour-completed.wav")),
    notification: useAudioPlayer(require("@/assets/sfx/notifications.wav")),
  };

  useEffect(() => {
    (async () => {
      const h = await getBool(SKEY.H, true);
      const s = await getBool(SKEY.S, true);
      setHapticsEnabled(h);
      setSoundsEnabled(s);
      setIsReady(true);
    })();
  }, []);

  const toggleHaptics = useCallback(async () => {
    setHapticsEnabled((prev) => {
      const next = !prev;
      setBool(SKEY.H, next);
      return next;
    });
  }, []);
  const toggleSounds = useCallback(async () => {
    setSoundsEnabled((prev) => {
      const next = !prev;
      setBool(SKEY.S, next);
      return next;
    });
  }, []);

  const haptic = useCallback(
    async (type: HapticType = "light") => {
      if (!hapticsEnabled) return;
      switch (type) {
        case "light":
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case "medium":
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case "heavy":
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case "success":
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success,
          );
          break;
        case "error":
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Error,
          );
          break;
      }
    },
    [hapticsEnabled],
  );

  const playSound = useCallback(
    async (key: SoundKey) => {
      if (!soundsEnabled) return;
      const p = players[key];
      // patrón recomendado: rebobinar y reproducir
      try {
        p.seekTo(0);
        await p.play();
      } catch (e) {
        // silencioso para no romper la UI
        // console.warn("playSound error", key, e);
      }
    },
    [players, soundsEnabled],
  );

  return (
    <HapticsContext.Provider
      value={{
        hapticsEnabled,
        soundsEnabled,
        isReady,
        toggleHaptics,
        toggleSounds,
        haptic,
        playSound,
      }}
    >
      {children}
    </HapticsContext.Provider>
  );
}
