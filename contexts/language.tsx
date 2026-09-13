import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { i18n, localeFor } from "@/i18n";
import { AppLanguage } from "@/i18n/resources";

const STORAGE_KEY = "settings-language:v1";

interface LanguageContextValue {
  language: AppLanguage;
  locale: "es-AR" | "en-US" | "pt-BR";
  isLanguageReady: boolean;
  setLanguage: (language: AppLanguage) => Promise<void>;
}

export const LanguageContext = createContext<LanguageContextValue>({
  language: "es",
  locale: "es-AR",
  isLanguageReady: false,
  setLanguage: async () => {},
});

function getDeviceLanguage(): AppLanguage {
  if (getLocales()[0]?.languageCode === "pt") return "pt";
  return getLocales()[0]?.languageCode === "en" ? "en" : "es";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setCurrentLanguage] = useState<AppLanguage>("es");
  const [isLanguageReady, setIsLanguageReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadLanguage() {
      let nextLanguage = getDeviceLanguage();
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === "es" || stored === "en" || stored === "pt") {
          nextLanguage = stored;
        }
      } catch (error) {
        console.warn("Could not load the saved language", error);
      }

      await i18n.changeLanguage(nextLanguage);
      if (mounted) {
        setCurrentLanguage(nextLanguage);
        setIsLanguageReady(true);
      }
    }

    void loadLanguage();
    return () => {
      mounted = false;
    };
  }, []);

  const setLanguage = useCallback(async (nextLanguage: AppLanguage) => {
    setCurrentLanguage(nextLanguage);
    await i18n.changeLanguage(nextLanguage);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, nextLanguage);
    } catch (error) {
      console.warn("Could not save the selected language", error);
    }
  }, []);

  const value = useMemo(
    () => ({
      language,
      locale: localeFor(language),
      isLanguageReady,
      setLanguage,
    }),
    [isLanguageReady, language, setLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
