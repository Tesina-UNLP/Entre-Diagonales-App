import { Text, type TextProps, useWindowDimensions } from "react-native";

import { TOKENS } from "@/constants/colors";
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
    | "muted";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const { theme } = useThemeColor();
  const { width } = useWindowDimensions();

  // Calculamos un factor de escala basado en el ancho de la pantalla
  // Para pantallas pequeñas (como 1080x2400 que tiene ~360 puntos de ancho), reducimos el tamaño
  // Para pantallas medianas, reducimos ligeramente
  // Para pantallas grandes, mantenemos el tamaño original
  const scaleFactor =
    width < 380 ? 0.8 : width < 420 ? 0.85 : width < 500 ? 0.9 : 1;

  // Función para calcular tamaños de fuente responsivos
  const getResponsiveFontSize = (baseSize: number) => {
    return Math.round(baseSize * scaleFactor);
  };

  // Función para calcular lineHeight responsivo
  const getResponsiveLineHeight = (baseLineHeight: number) => {
    return Math.round(baseLineHeight * scaleFactor);
  };

  // Estilos dinámicos basados en el tipo y el tamaño de pantalla
  const getTypeStyle = () => {
    switch (type) {
      case "title":
        return {
          fontSize: getResponsiveFontSize(32),
          lineHeight: getResponsiveLineHeight(40),
          fontFamily: "ClashDisplayBold",
        };
      case "subtitle":
        return {
          fontSize: getResponsiveFontSize(20),
          fontFamily: "ClashDisplayBold",
        };
      case "defaultSemiBold":
        return {
          fontSize: getResponsiveFontSize(16),
          lineHeight: getResponsiveLineHeight(24),
          fontFamily: "ClashDisplaySemiBold",
        };
      case "link":
        return {
          fontSize: getResponsiveFontSize(16),
          lineHeight: getResponsiveLineHeight(30),
          color: TOKENS.tabBarInactive,
          fontFamily: "ClashDisplay",
          textDecorationLine: "underline" as const,
        };
      case "muted":
        return {
          fontSize: getResponsiveFontSize(16),
          lineHeight: getResponsiveLineHeight(24),
          color: TOKENS.muted,
          fontFamily: "ClashDisplay",
        };
      default:
        return {
          fontSize: getResponsiveFontSize(16),
          lineHeight: getResponsiveLineHeight(24),
          fontFamily: "ClashDisplay",
        };
    }
  };

  return (
    <Text style={[{ color: theme.text }, getTypeStyle(), style]} {...rest} />
  );
}
