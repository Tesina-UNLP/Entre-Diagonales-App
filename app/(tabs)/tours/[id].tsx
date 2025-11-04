import { ThemedBackground } from "@/components/themed-background";
import { ThemedText } from "@/components/themed-text";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { StyleSheet } from "react-native";

const RouteDetails = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const idStr = useMemo(() => (Array.isArray(id) ? id?.[0] : id), [id]);

  return (
    <ThemedBackground style={styles.container}>
      <ThemedText>Route Details Screen</ThemedText>
      <ThemedText>ID: {idStr}</ThemedText>
    </ThemedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default RouteDetails;
