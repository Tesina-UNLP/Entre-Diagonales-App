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
          <ThemedText type="defaultSemiBold">
            {user?.display_name || user?.username}
          </ThemedText>
          <View style={styles.headerLocation}>
            <View style={styles.headerIconContainer}>
              <GemIcon height={35} width={35} />
              <ThemedText type="default">{user?.gems}</ThemedText>
            </View>
            <View style={styles.headerIconContainer}>
              <CoinIcon />
              <ThemedText type="default">{user?.coins}</ThemedText>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity
          onPress={() => router.navigate("/(tabs)/profile/settings")}
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
    marginBottom: 20,
  },
  headerLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerLeftTextContainer: {
    gap: 4,
    alignItems: "flex-start",
  },
  headerRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  headerIcon: {
    width: 35,
    height: 35,
  },
  headerIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: TOKENS.badgeActive,
  },
});

export default HeaderHome;
