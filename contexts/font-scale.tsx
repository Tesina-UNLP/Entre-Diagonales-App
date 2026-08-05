import * as SecureStore from "expo-secure-store";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

export type FontScaleLevel = 0.85 | 1 | 1.15 | 1.3;

export const FONT_SCALE_LEVELS: { label: string; value: FontScaleLevel }[] = [
  { label: "Pequeño", value: 0.85 },
  { label: "Normal", value: 1 },
  { label: "Grande", value: 1.15 },
  { label: "Muy grande", value: 1.3 },
];

interface FontScaleCtx {
  userFontScale: FontScaleLevel;
  setUserFontScale: (scale: FontScaleLevel) => Promise<void>;
}

export const FontScaleContext = createContext<FontScaleCtx>({
  userFontScale: 1,
  setUserFontScale: async () => {},
});

const SKEY = "settings-font-scale";

async function getScale(): Promise<FontScaleLevel> {
  if (Platform.OS === "web") return 1;
  const v = await SecureStore.getItemAsync(SKEY);
  const parsed = parseFloat(v ?? "");
  const valid = FONT_SCALE_LEVELS.map((l) => l.value);
  return (
    valid.includes(parsed as FontScaleLevel) ? parsed : 1
  ) as FontScaleLevel;
}

async function saveScale(scale: FontScaleLevel) {
  if (Platform.OS === "web") return;
  await SecureStore.setItemAsync(SKEY, String(scale));
}

export function FontScaleProvider({ children }: { children: React.ReactNode }) {
  const [userFontScale, setScale] = useState<FontScaleLevel>(1);

  useEffect(() => {
    getScale().then(setScale);
  }, []);

  const setUserFontScale = useCallback(async (scale: FontScaleLevel) => {
    setScale(scale);
    await saveScale(scale);
  }, []);

  return (
    <FontScaleContext.Provider value={{ userFontScale, setUserFontScale }}>
      {children}
    </FontScaleContext.Provider>
  );
}
