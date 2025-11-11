import { TOKENS } from "@/constants/colors";
import { useHaptics } from "@/hooks/use-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { ThemedText } from "./themed-text";

export type ThemedButtonProps = TouchableOpacityProps & {
  variant?:
    | "primary"
    | "secondary"
    | "gold"
    | "outline"
    | "ghost"
    | "danger"
    | "accent";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  children: React.ReactNode;
};

export function ThemedButton({
  variant = "primary",
  size = "medium",
  loading = false,
  disabled,
  style,
  children,
  onPress,
  ...rest
}: ThemedButtonProps) {
  const isDisabled = disabled || loading;
  const { haptic } = useHaptics();

  const handlePress = async (e: GestureResponderEvent) => {
    haptic("light");
    onPress?.(e); // luego ejecuta el onPress original
  };

  const buttonContent = (
    <>
      {loading && (
        <ActivityIndicator
          size="small"
          color={
            variant === "outline" ||
            variant === "ghost" ||
            variant === "secondary" ||
            variant === "accent"
              ? TOKENS.primary
              : TOKENS.text
          }
          style={styles.loader}
        />
      )}
      {typeof children === "string" ? (
        <ThemedText
          style={[
            styles.text,
            variant === "secondary" && styles.secondaryText,
            variant === "outline" && styles.outlineText,
            variant === "ghost" && styles.ghostText,
            variant === "danger" && styles.dangerText,
            variant === "accent" && styles.accentText,
            size === "small" && styles.smallText,
            size === "large" && styles.largeText,
            isDisabled && styles.disabledText,
          ]}
          type="defaultSemiBold"
        >
          {children}
        </ThemedText>
      ) : (
        children
      )}
    </>
  );

  // Gold gradient button
  if (variant === "gold") {
    return (
      <TouchableOpacity
        style={[
          styles.container,
          styles.shadowElevation, // Agregamos elevación al botón gold
          size === "small" && styles.smallContainer,
          size === "large" && styles.largeContainer,
          isDisabled && styles.disabled,
          style,
        ]}
        disabled={isDisabled}
        {...rest} // 👈 primero el spread…
        onPress={handlePress}
      >
        <LinearGradient
          colors={
            isDisabled
              ? ["#6B5A3A", "#8B7A5A", "#6B5A3A"]
              : ["#936F39", "#C6954C", "#936F39"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          locations={[0, 0.5, 1]}
          style={[
            styles.gradient,
            size === "small" && styles.smallGradient,
            size === "large" && styles.largeGradient,
          ]}
        >
          {buttonContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Regular buttons
  return (
    <TouchableOpacity
      style={[
        styles.container,
        styles.button,
        // Agregamos elevación a todos los botones excepto outline y ghost
        variant !== "outline" && variant !== "ghost" && styles.shadowElevation,
        variant === "primary" && styles.primaryButton,
        variant === "secondary" && styles.secondaryButton,
        variant === "outline" && styles.outlineButton,
        variant === "ghost" && styles.ghostButton,
        variant === "danger" && styles.dangerButton,
        variant === "accent" && styles.accentButton,
        size === "small" && styles.smallButton,
        size === "large" && styles.largeButton,
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      {...rest}
      onPress={handlePress}
    >
      {buttonContent}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    // Removemos overflow: "hidden" para que las sombras se vean correctamente
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  gradient: {
    height: 56,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    flexDirection: "row",
  },
  primaryButton: {
    backgroundColor: TOKENS.primary,
  },
  secondaryButton: {
    backgroundColor: TOKENS.text,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderColor: TOKENS.primary,
    borderWidth: 2,
  },
  ghostButton: {
    backgroundColor: "transparent",
  },
  dangerButton: {
    backgroundColor: TOKENS.error,
  },
  smallContainer: {
    height: 40,
  },
  smallButton: {
    height: 40,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  smallGradient: {
    height: 40,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  largeContainer: {
    height: 64,
  },
  largeButton: {
    height: 64,
    paddingVertical: 18,
    paddingHorizontal: 36,
  },
  largeGradient: {
    height: 64,
    paddingVertical: 18,
    paddingHorizontal: 36,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: TOKENS.text,
    fontSize: 16,
    textAlign: "center",
  },
  secondaryText: {
    color: TOKENS.primary,
  },
  outlineText: {
    color: TOKENS.text,
  },
  ghostText: {
    color: TOKENS.primary,
  },
  dangerText: {
    color: TOKENS.text,
  },
  smallText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 18,
  },
  disabledText: {
    opacity: 1,
  },
  loader: {
    marginRight: 8,
  },
  accentText: {
    color: TOKENS.background,
  },
  accentButton: {
    backgroundColor: TOKENS.accent,
  },
  // Estilo de elevación sutil para los botones
  shadowElevation: {
    // Sombras para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Elevación para Android
    elevation: 2,
  },
});
