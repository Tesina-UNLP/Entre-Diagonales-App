import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import type { AppLanguage } from "@/i18n/resources";
import {
  languageFromDeviceCode,
  LanguagePreferenceState,
} from "@/libs/language-preference-core";

export { localeFor } from "@/libs/language-preference-core";
export type { AppLocale } from "@/libs/language-preference-core";

const STORAGE_KEY = "settings-language:v1";

const languagePreference = new LanguagePreferenceState({
  storageKey: STORAGE_KEY,
  storage: AsyncStorage,
  initialLanguage: languageFromDeviceCode(getLocales()[0]?.languageCode),
  onLoadError: (error) =>
    console.warn("Could not load the saved language", error),
  onSaveError: (error) =>
    console.warn("Could not save the selected language", error),
});

export function getCurrentLanguagePreference(): AppLanguage {
  return languagePreference.getCurrent();
}

export function initializeLanguagePreference(): Promise<AppLanguage> {
  return languagePreference.initialize();
}

export function getPreferredLocale() {
  return languagePreference.getLocale();
}

export function saveLanguagePreference(language: AppLanguage): Promise<void> {
  return languagePreference.save(language);
}
