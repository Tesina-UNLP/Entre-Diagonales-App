import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { StyleSheet, View } from "react-native";

import { TOKENS } from "@/constants/colors";
import { ThemedButton } from "./themed-button";
import { ThemedText } from "./themed-text";

type AppleSignInButtonProps = {
  label: string;
  onPress: () => void;
};

export function AppleSignInButton({ label, onPress }: AppleSignInButtonProps) {
  return (
    <ThemedButton
      variant="primary"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View pointerEvents="none" style={styles.content}>
        <FontAwesome name="apple" size={21} color={TOKENS.text} />
        <ThemedText type="defaultSemiBold" style={styles.label}>
          {label}
        </ThemedText>
      </View>
    </ThemedButton>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  label: {
    color: TOKENS.text,
    fontSize: 16,
  },
});
