import { ThemedBackground } from "@/components/themed-background";
import { ThemedText } from "@/components/themed-text";
import { StyleSheet } from "react-native";

export default function ScannerScreen() {
  return (
    <ThemedBackground style={styles.container}>
      <ThemedText>Scanner</ThemedText>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
