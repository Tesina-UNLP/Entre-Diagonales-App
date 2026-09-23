import { translateUiText } from "@/i18n";
import { Alert, AlertButton, AlertOptions } from "react-native";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";

export function useLocalizedAlert() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage;

  const localizeMessage = useCallback(
    (value: string) => {
      const translated = translateUiText(value);
      const looksSpanish =
        /[¿¡áéíóúñ]|\b(el|la|los|las|una|para|con|contraseña|cuenta|usuario|pudimos)\b/i.test(
          value,
        );
      if (language === "en" && translated === value && looksSpanish) {
        console.warn(
          "Untranslated alert detail hidden from English UI:",
          value,
        );
        return t("common.genericError");
      }
      return translated;
    },
    [language, t],
  );

  return useCallback(
    (
      title: string,
      message?: string,
      buttons?: AlertButton[],
      options?: AlertOptions,
    ) =>
      Alert.alert(
        translateUiText(title),
        message ? localizeMessage(message) : undefined,
        buttons?.map((button) => ({
          ...button,
          text: button.text ? translateUiText(button.text) : button.text,
        })),
        options,
      ),
    [localizeMessage],
  );
}
