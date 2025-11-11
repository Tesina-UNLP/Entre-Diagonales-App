import * as Haptics from "expo-haptics";

export async function hSuccess() {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export async function hError() {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}

export async function hSoftTick() {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

// Ejemplo de rampa al acercarse a un POI:
export async function hProximity(strength: "low" | "mid" | "high") {
  const map = {
    low: Haptics.ImpactFeedbackStyle.Light,
    mid: Haptics.ImpactFeedbackStyle.Medium,
    high: Haptics.ImpactFeedbackStyle.Heavy,
  };
  await Haptics.impactAsync(map[strength]);
}
