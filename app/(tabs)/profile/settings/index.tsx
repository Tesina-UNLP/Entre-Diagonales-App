import { FadeInView } from "@/components/animations/fade-in-view";
import Header from "@/components/header";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

const sections = [
  {
    title: "Perfil",
    icon: "person",
    onPress: () => router.navigate("/(tabs)/profile/settings/profile"),
  },
  {
    title: "Notificaciones",
    icon: "notifications",
    onPress: () => router.navigate("/(tabs)/profile/settings/notifications"),
  },
  {
    title: "Musica & efectos",
    icon: "musical-notes",
    onPress: () => router.navigate("/(tabs)/profile/settings/sounds"),
  },
  {
    title: "Apariencia",
    icon: "text",
    onPress: () => router.navigate("/(tabs)/profile/settings/appearance"),
  },
  {
    title: "Centro de ayuda",
    icon: "help-circle",
    onPress: () => router.navigate("/(tabs)/profile/settings/help"),
  },
  {
    title: "Sobre nosotros",
    icon: "information-circle",
    onPress: () => router.navigate("/(tabs)/profile/settings/about"),
  },
];

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
        onBack={() => router.back()}
      />
      <View style={styles.content}>
        {sections.map((section, index) => (
          <FadeInView key={section.title} delay={100 * (index + 1)}>
            <TouchableOpacity
              onPress={section.onPress}
              style={styles.sectionContainer}
            >
              <View style={styles.sectionLeft}>
                <Ionicons
                  name={section.icon as any}
                  size={24}
                  color={TOKENS.text}
                />
                <ThemedText type="defaultSemiBold">{section.title}</ThemedText>
              </View>
              <View style={styles.sectionRight}>
                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color={TOKENS.text}
                />
              </View>
            </TouchableOpacity>
          </FadeInView>
        ))}

        <FadeInView delay={600}>
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
        </FadeInView>
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
