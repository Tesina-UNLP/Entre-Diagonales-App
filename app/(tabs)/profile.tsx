import { ThemedBackground } from "@/components/themed-background";
import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/hooks/use-auth";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

export default function ProfileScreen() {
  const { logout } = useAuth();

  const handleSignOut = () => {
    logout();
    router.replace("/(public)/welcome");
  };

  return (
    <ThemedBackground style={styles.container}>
      <ThemedText>Profile</ThemedText>
      <ThemedButton variant="danger" size="small" onPress={handleSignOut}>
        Sign Out
      </ThemedButton>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
