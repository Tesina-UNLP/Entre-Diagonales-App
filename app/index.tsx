import Logo from "@/components/icons/logo";
import { ThemedBackground } from "@/components/themed-background";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

const Index = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <ThemedBackground style={styles.loadingContainer}>
        <Logo />
        <ActivityIndicator size="large" color="#e68a00" />
      </ThemedBackground>
    );
  }

  if (user) {
    if (!user.hasCompletedOnboarding) {
      return <Redirect href="/(onboarding)/presentation" />;
    }
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(public)/welcome" />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Index;
