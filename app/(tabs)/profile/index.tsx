import AchievementsProfile from "@/components/profile/achievements-profile";
import HeaderProfile from "@/components/profile/header-profile";
import SecretsProfile from "@/components/profile/secrets-profile";
import StatsProfile from "@/components/profile/stats-profile";
import ToursProfile from "@/components/profile/tours-profile";
import { ThemedBackground } from "@/components/themed-background";
import { StyleSheet, View } from "react-native";

export default function ProfileScreen() {
  return (
    <ThemedBackground style={styles.container} scrollable>
      <HeaderProfile />
      <StatsProfile />
      <SecretsProfile />
      <ToursProfile />
      <AchievementsProfile />
      <View style={styles.bottomSpacer}></View>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
  },
  bottomSpacer: { height: 120 },
});
