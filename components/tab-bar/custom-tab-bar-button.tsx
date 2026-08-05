import { TOKENS } from "@/constants/colors";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ScannerIcon from "../icons/scanner";
import { SCANNER_BUTTON_TOP_OFFSET } from "./tab-bar-metrics";

type Props = {
  children?: React.ReactNode;
  onPress?: (e: any) => void;
  accessibilityState?: any;
  accessibilityRole?: any;
  focused?: boolean;
};

export function CustomTabBarButton({ children, onPress }: Props) {
  const { theme } = useThemeColor();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.button}>
        <ScannerIcon color={theme.text} />
      </View>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    top: SCANNER_BUTTON_TOP_OFFSET,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: TOKENS.navActive, // naranja
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#F4881B80",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
