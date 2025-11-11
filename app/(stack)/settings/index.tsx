import Header from "@/components/header";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const Settings = () => {
  const { logout } = useAuth();

  const handleSignOut = () => {
    logout();
    router.replace("/(public)/welcome");
  };

  return (
    <ThemedBackground style={styles.container} safeArea={false}>
      <Header
        title={"Configuración"}
        description={"Configura tu perfil y preferencias"}
        onBack={() => router.navigate("/(tabs)/profile")}
      />
      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => router.navigate("/(stack)/settings/profile")}
          style={styles.sectionContainer}
        >
          <View style={styles.sectionLeft}>
            <Ionicons name="person" size={24} color={TOKENS.text} />
            <ThemedText type="defaultSemiBold">Perfil</ThemedText>
          </View>
          <View style={styles.sectionRight}>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color={TOKENS.text}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.navigate("/(stack)/settings/notifications")}
          style={styles.sectionContainer}
        >
          <View style={styles.sectionLeft}>
            <Ionicons name="notifications" size={24} color={TOKENS.text} />
            <ThemedText type="defaultSemiBold">Notificaciones</ThemedText>
          </View>
          <View style={styles.sectionRight}>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color={TOKENS.text}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.navigate("/(stack)/settings/music")}
          style={styles.sectionContainer}
        >
          <View style={styles.sectionLeft}>
            <Ionicons name="musical-notes" size={24} color={TOKENS.text} />
            <ThemedText type="defaultSemiBold">Musica & efectos</ThemedText>
          </View>
          <View style={styles.sectionRight}>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color={TOKENS.text}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.navigate("/(stack)/settings/security")}
          style={styles.sectionContainer}
        >
          <View style={styles.sectionLeft}>
            <Ionicons name="shield" size={24} color={TOKENS.text} />
            <ThemedText type="defaultSemiBold">Seguridad</ThemedText>
          </View>
          <View style={styles.sectionRight}>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color={TOKENS.text}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.navigate("/(stack)/settings/help")}
          style={styles.sectionContainer}
        >
          <View style={styles.sectionLeft}>
            <Ionicons name="help-circle" size={24} color={TOKENS.text} />
            <ThemedText type="defaultSemiBold">Centro de ayuda</ThemedText>
          </View>
          <View style={styles.sectionRight}>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color={TOKENS.text}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.navigate("/(stack)/settings/about")}
          style={styles.sectionContainer}
        >
          <View style={styles.sectionLeft}>
            <Ionicons name="information-circle" size={24} color={TOKENS.text} />
            <ThemedText type="defaultSemiBold">Sobre nosotros</ThemedText>
          </View>
          <View style={styles.sectionRight}>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color={TOKENS.text}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSignOut}
          style={styles.sectionContainer}
        >
          <View style={styles.sectionLeft}>
            <Ionicons name="log-out" size={24} color={TOKENS.error} />
            <ThemedText type="defaultSemiBold" style={styles.logoutText}>
              Cerrar sesión
            </ThemedText>
          </View>
        </TouchableOpacity>
      </View>
    </ThemedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    marginTop: 0,
    paddingInline: 0,
    paddingHorizontal: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 30,
  },
  sectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  sectionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
  },
  sectionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoutText: {
    color: TOKENS.error,
  },
});

export default Settings;
