import { ThemedBackground } from "@/components/themed-background";
import { ThemedText } from "@/components/themed-text";
import { Platform, StyleSheet } from "react-native";

export default function TabTwoScreen() {
  return (
    <ThemedBackground style={styles.container}>
      <ThemedText>Routes</ThemedText>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 40 : 80,
  },
});
