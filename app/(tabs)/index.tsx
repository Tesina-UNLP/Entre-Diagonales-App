import { ThemedBackground } from "@/components/themed-background";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/hooks/use-auth";
import { Platform, StyleSheet } from "react-native";

export default function HomeScreen() {
  const { user } = useAuth();
  return (
    <ThemedBackground style={styles.container}>
      <ThemedText>Home</ThemedText>
      {user ? (
        <ThemedText>Welcome, {user.name || user.email}!</ThemedText>
      ) : (
        <ThemedText>Please log in.</ThemedText>
      )}
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 40 : 80,
  },
});
