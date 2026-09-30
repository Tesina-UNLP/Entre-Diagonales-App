import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { i18n } from "@/i18n";
import { AppLanguage } from "@/i18n/resources";
import {
  getCurrentLanguagePreference,
  initializeLanguagePreference,
  localeFor,
  saveLanguagePreference,
} from "@/libs/language-preference";

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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setCurrentLanguage] = useState<AppLanguage>(
    getCurrentLanguagePreference,
  );
  const [isLanguageReady, setIsLanguageReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadLanguage() {
      const nextLanguage = await initializeLanguagePreference();
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
    const savePreference = saveLanguagePreference(nextLanguage);
    setCurrentLanguage(nextLanguage);
    await Promise.all([i18n.changeLanguage(nextLanguage), savePreference]);
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
