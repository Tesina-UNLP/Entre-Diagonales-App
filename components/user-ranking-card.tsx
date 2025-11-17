// components/UserRankingCard.tsx
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { RankingItem } from "@/hooks/use-ranking";
import { FontAwesome5 } from "@expo/vector-icons";
import Octicons from "@expo/vector-icons/Octicons";
import { Image, StyleSheet, View } from "react-native";

export function UserRankingCard({
  user,
  userLevel,
}: {
  user: RankingItem;
  userLevel?: string;
}) {
  // console.log(user);
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        {/* CÍRCULO SUPERPUESTO */}
        <View style={styles.positionCircle}>
          <ThemedText style={styles.posText}>{user.position}</ThemedText>
        </View>

        {/* AVATAR */}
        <Image source={{ uri: user.character }} style={styles.avatar} />
      </View>

      <View style={styles.center}>
        <ThemedText style={styles.username}>{user.username}</ThemedText>
        <View style={styles.row}>
          <Octicons name="star-fill" size={16} color={TOKENS.accent} />
          <ThemedText style={styles.points}>{user.experience} pts</ThemedText>
        </View>
      </View>

      <View style={styles.badge}>
        <FontAwesome5 name="medal" size={20} color={TOKENS.progress} solid />
        <ThemedText style={styles.badgeText}>{userLevel}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: TOKENS.cardBackground,
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  center: { flex: 1, marginLeft: 10 },
  row: { flexDirection: "row", alignItems: "center" },
  username: { fontWeight: "bold", fontSize: 16 },
  points: { marginLeft: 4, color: TOKENS.iconCoin },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: TOKENS.primary,
  },
  badgeText: {
    color: TOKENS.text,
    fontSize: 16,
    textAlign: "center",
    flexShrink: 1,
    maxWidth: 100,
  },
  left: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: TOKENS.muted,
  },

  positionCircle: {
    position: "absolute",
    top: -6,
    left: -6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: TOKENS.progress,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    borderWidth: 2,
    borderColor: TOKENS.text,
  },

  posText: {
    color: TOKENS.text,
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 16,
  },
});
