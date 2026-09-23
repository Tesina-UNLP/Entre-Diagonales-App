import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { AppLanguage, CopyPair, UI_COPY } from "./resources";

type CopyTree = { readonly [key: string]: CopyTree | CopyPair };

const resources: Record<AppLanguage, Record<string, string>> = {
  es: {},
  en: {},
  pt: {},
};

function collectResources(tree: CopyTree, path: string[] = []) {
  Object.entries(tree).forEach(([key, value]) => {
    const nextPath = [...path, key];
    if (Array.isArray(value)) {
      const translationKey = nextPath.join(".");
      resources.es[translationKey] = value[0];
      resources.en[translationKey] = value[1];
      resources.pt[translationKey] = value[2];
      return;
    }
    collectResources(value as CopyTree, nextPath);
  });
}

collectResources(UI_COPY);

void i18n.use(initReactI18next).init({
  resources: {
    es: { translation: resources.es },
    en: { translation: resources.en },
    pt: { translation: resources.pt },
  },
  lng: "es",
  fallbackLng: "es",
  supportedLngs: ["es", "en", "pt"],
  interpolation: { escapeValue: false },
  returnNull: false,
});

const sourceToKey = new Map<string, string>();
Object.entries(resources.es).forEach(([key, value]) =>
  sourceToKey.set(value, key),
);

export function translateUiText(value: string): string {
  const key = sourceToKey.get(value.trim());
  if (!key) {
    if (i18n.resolvedLanguage === "en") {
      const dynamicPatterns: [RegExp, (match: RegExpMatchArray) => string][] = [
        [/^Opciones para (.+)$/, (match) => `Options for ${match[1]}`],
        [
          /^¿Por qué querés reportar a (.+)\?$/,
          (match) => `Why do you want to report ${match[1]}?`,
        ],
        [/^(\d+) Puntos$/, (match) => `${match[1]} Stops`],
        [/^Nivel (\d+)$/, (match) => `Level ${match[1]}`],
        [/^Bloqueado el (.+)$/, (match) => `Blocked on ${match[1]}`],
      ];
      for (const [pattern, format] of dynamicPatterns) {
        const match = value.trim().match(pattern);
        if (match) return format(match);
      }
    }
    return value;
  }

  const translated = i18n.t(key);
  if (value === value.trim()) return translated;

  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
}

export function localeFor(language: AppLanguage): "es-AR" | "en-US" | "pt-BR" {
  if (language === "en") return "en-US";
  if (language === "pt") return "pt-BR";
  return "es-AR";
}

export { i18n, resources };
