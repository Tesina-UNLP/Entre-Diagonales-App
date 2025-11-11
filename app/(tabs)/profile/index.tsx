import { ThemedBackground } from "@/components/themed-background";
import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

export default function ProfileScreen() {
  return (
    <ThemedBackground style={styles.container}>
      <ThemedText>Profile</ThemedText>
      <ThemedButton
        variant="primary"
        size="small"
        onPress={() => router.navigate("/(tabs)/profile/secrets")}
      >
        Secretos
      </ThemedButton>
      <ThemedButton
        variant="primary"
        size="small"
        onPress={() => router.navigate("/(tabs)/profile/settings")}
      >
        Configuración
      </ThemedButton>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
