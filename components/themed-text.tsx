import { StyleSheet, Text, type TextProps } from "react-native";

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

  return (
    <Text
      style={[
        { color: theme.text },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "muted" ? styles.muted : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "ClashDisplay",
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "ClashDisplaySemiBold",
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
    fontFamily: "ClashDisplayBold",
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "ClashDisplayBold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: TOKENS.tabBarInactive,
    fontFamily: "ClashDisplay",
    textDecorationLine: "underline",
  },
  muted: {
    fontSize: 16,
    lineHeight: 24,
    color: TOKENS.muted,
    fontFamily: "ClashDisplay",
  },
});
