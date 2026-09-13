import { FadeInView } from "@/components/animations/fade-in-view";
import Header from "@/components/header";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

const sections = [
  {
    titleKey: "settings.developers",
    icon: "people",
    href: process.env.EXPO_PUBLIC_WEB_FRONTEND,
  },
  {
    titleKey: "settings.privacyPolicy",
    icon: "shield-outline",
    href: process.env.EXPO_PUBLIC_WEB_FRONTEND + "/privacy",
  },
  {
    titleKey: "settings.terms",
    icon: "document-text-outline",
    href: process.env.EXPO_PUBLIC_WEB_FRONTEND + "/terms",
  },
  {
    titleKey: "settings.visitWebsite",
    icon: "globe-outline",
    href: process.env.EXPO_PUBLIC_WEB_FRONTEND,
  },
];

const logo = require("@/assets/images/splash-icon.png");

const About = () => {
  const { t } = useTranslation();
  const version = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <ThemedBackground style={styles.container} safeArea={false}>
      <Header
        title={t("settings.about")}
        description={t("settings.aboutSubtitle")}
        onBack={() => router.back()}
      />

      <FadeInView delay={100}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
          <ThemedText type="defaultSemiBold">Entre Diagonales</ThemedText>
          <ThemedText type="defaultSemiBold">
            {t("common.version")} {version}
          </ThemedText>
        </View>
      </FadeInView>

      <View style={styles.content}>
        {sections.map((section, index) => (
          <FadeInView key={section.titleKey} delay={200 + 100 * index}>
            <TouchableOpacity
              onPress={() => Linking.openURL(section.href as string)}
              style={styles.sectionContainer}
            >
              <View style={styles.sectionLeft}>
                <Ionicons
                  name={section.icon as any} // Cast to any to fix type error, but ideally fix the icon typing upstream
                  size={24}
                  color={TOKENS.text}
                />
                <ThemedText type="defaultSemiBold">
                  {t(section.titleKey)}
                </ThemedText>
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
  logo: {
    width: 140,
    height: 140,
    alignSelf: "center",
    marginVertical: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 10,
    justifyContent: "center",
  },
});

export default About;
