import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";

import { ThemedBackground } from "@/components/themed-background";
import { ThemedText } from "@/components/themed-text";
import { useTranslation } from "react-i18next";

export default function NotFoundScreen() {
  const { t } = useTranslation();
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <ThemedBackground style={styles.container}>
        <ThemedText type="title">{t("notFound.title")}</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">{t("notFound.home")}</ThemedText>
        </Link>
      </ThemedBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
