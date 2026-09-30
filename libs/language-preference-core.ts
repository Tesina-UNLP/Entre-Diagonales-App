import type { AppLanguage } from "@/i18n/resources";

export type AppLocale = "es-AR" | "en-US" | "pt-BR";

interface LanguageStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

interface LanguagePreferenceOptions {
  storageKey: string;
  storage: LanguageStorage;
  initialLanguage: AppLanguage;
  onLoadError?: (error: unknown) => void;
  onSaveError?: (error: unknown) => void;
}

export function isAppLanguage(value: string | null): value is AppLanguage {
  return value === "es" || value === "en" || value === "pt";
}

export function languageFromDeviceCode(
  languageCode: string | null | undefined,
): AppLanguage {
  if (languageCode === "pt") return "pt";
  return languageCode === "en" ? "en" : "es";
}

export function localeFor(language: AppLanguage): AppLocale {
  if (language === "en") return "en-US";
  if (language === "pt") return "pt-BR";
  return "es-AR";
}

export function setDefaultAcceptLanguage(
  headers: Headers,
  locale: AppLocale,
): void {
  if (!headers.has("Accept-Language")) {
    headers.set("Accept-Language", locale);
  }
}

export class LanguagePreferenceState {
  private readonly options: LanguagePreferenceOptions;
  private currentLanguage: AppLanguage;
  private languageRevision = 0;
  private initializationPromise: Promise<AppLanguage> | null = null;

  constructor(options: LanguagePreferenceOptions) {
    this.options = options;
    this.currentLanguage = options.initialLanguage;
  }

  getCurrent(): AppLanguage {
    return this.currentLanguage;
  }

  initialize(): Promise<AppLanguage> {
    if (this.initializationPromise) {
      return this.initializationPromise.then(() => this.currentLanguage);
    }

    const revisionAtStart = this.languageRevision;
    this.initializationPromise = this.options.storage
      .getItem(this.options.storageKey)
      .then((storedLanguage) => {
        if (
          this.languageRevision === revisionAtStart &&
          isAppLanguage(storedLanguage)
        ) {
          this.currentLanguage = storedLanguage;
        }
        return this.currentLanguage;
      })
      .catch((error: unknown) => {
        this.options.onLoadError?.(error);
        return this.currentLanguage;
      });

    return this.initializationPromise;
  }

  async getLocale(): Promise<AppLocale> {
    await this.initialize();
    return localeFor(this.currentLanguage);
  }

  async save(language: AppLanguage): Promise<void> {
    this.languageRevision += 1;
    this.currentLanguage = language;

    try {
      await this.options.storage.setItem(this.options.storageKey, language);
    } catch (error) {
      this.options.onSaveError?.(error);
    }
  }
}
