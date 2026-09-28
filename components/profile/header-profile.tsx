import { HeaderProfileSkeleton } from "@/components/skeletons/header-profile-skeleton";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import CoinIcon from "../icons/coin";
import GemIcon from "../icons/gem";

const HeaderHome = () => {
  const { user } = useAuth();

  if (!user) {
    return <HeaderProfileSkeleton />;
  }

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Image
          source={{ uri: user?.character?.image_url }}
          style={styles.avatar}
        />
        <View style={styles.headerLeftTextContainer}>
          <ThemedText type="subtitle" style={styles.userName}>
            {user?.display_name || user?.username}
          </ThemedText>
          <View style={styles.resources}>
            <View style={styles.resourceItem}>
              <GemIcon height={22} width={22} />
              <ThemedText type="default">{user?.gems}</ThemedText>
            </View>
            <View style={styles.resourceDivider} />
            <View style={styles.resourceItem}>
              <CoinIcon height={22} width={22} />
              <ThemedText type="default">{user?.coins}</ThemedText>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity
          onPress={() => router.navigate("/(tabs)/profile/settings")}
          style={styles.settingsButton}
          accessibilityRole="button"
          accessibilityLabel="Configuración"
        >
          <Ionicons
            name="settings-outline"
            color={TOKENS.badgeActive}
            size={24}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resources: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerLeftTextContainer: {
    gap: 5,
    alignItems: "flex-start",
  },
  headerRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  userName: {
    fontSize: 20,
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  resourceDivider: {
    width: 1,
    height: 16,
    backgroundColor: TOKENS.tabBarInactive + "70",
  },
  settingsButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: TOKENS.navActive,
  },
});

export default HeaderHome;
