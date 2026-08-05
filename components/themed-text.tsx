import { Text, type TextProps, useWindowDimensions } from "react-native";

import { TOKENS } from "@/constants/colors";
import { useFontScale } from "@/hooks/use-font-scale";
import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "muted"
    | "bigMuted";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const { theme } = useThemeColor();
  const { userFontScale } = useFontScale();
  const { width, fontScale } = useWindowDimensions();

  // Escala base por ancho de pantalla
  const baseScale =
    width <= 360 ? 0.7 : width <= 392 ? 0.8 : width <= 420 ? 0.9 : 1;

  // Normalizamos neutralizando el fontScale del sistema y aplicando el del usuario
  const normalizeFontSize = (baseSize: number) => {
    return Math.round((baseSize * baseScale * userFontScale) / fontScale);
  };

  const normalizeLineHeight = (baseLineHeight: number) => {
    return Math.round((baseLineHeight * baseScale * userFontScale) / fontScale);
  };

  // Estilos dinámicos basados en el tipo y el tamaño de pantalla
  const getTypeStyle = () => {
    switch (type) {
      case "title":
        return {
          fontSize: normalizeFontSize(24),
          lineHeight: normalizeLineHeight(30),
          fontFamily: "ClashDisplayBold",
        };
      case "subtitle":
        return {
          fontSize: normalizeFontSize(18),
          fontFamily: "ClashDisplayBold",
        };
      case "defaultSemiBold":
        return {
          fontSize: normalizeFontSize(14),
          lineHeight: normalizeLineHeight(20),
          fontFamily: "ClashDisplaySemiBold",
        };
      case "link":
        return {
          fontSize: normalizeFontSize(14),
          lineHeight: normalizeLineHeight(20),
          color: TOKENS.tabBarInactive,
          fontFamily: "ClashDisplay",
          textDecorationLine: "underline" as const,
        };
      case "muted":
        return {
          fontSize: normalizeFontSize(13),
          lineHeight: normalizeLineHeight(18),
          color: TOKENS.muted,
          fontFamily: "ClashDisplay",
        };
      case "bigMuted":
        return {
          fontSize: normalizeFontSize(16),
          lineHeight: normalizeLineHeight(24),
          color: TOKENS.muted,
          fontFamily: "ClashDisplay",
        };
      default:
        return {
          fontSize: normalizeFontSize(14),
          lineHeight: normalizeLineHeight(20),
          fontFamily: "ClashDisplay",
        };
    }
  };

  return (
    <Text style={[{ color: theme.text }, getTypeStyle(), style]} {...rest} />
  );
}
