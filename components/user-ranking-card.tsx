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
          <ThemedText type="defaultSemiBold" style={styles.posText}>
            {user.position}
          </ThemedText>
        </View>

        {/* AVATAR */}
        <Image source={{ uri: user.character }} style={styles.avatar} />
      </View>

      <View style={styles.center}>
        <ThemedText type="subtitle">
          {user?.display_name?.slice(0, 12) ?? user.username?.slice(0, 12)}
        </ThemedText>
        <View style={styles.row}>
          <Octicons name="star-fill" size={14} color={TOKENS.accent} />
          <ThemedText type="muted" style={styles.points}>
            {user.experience} puntos
          </ThemedText>
        </View>
      </View>

      <View style={styles.badge}>
        <FontAwesome5 name="medal" size={12} color={TOKENS.progress} solid />
        <ThemedText>{userLevel}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: TOKENS.cardBackground,
    paddingVertical: 13,
    paddingHorizontal: 17,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  center: { flex: 1, marginLeft: 10, gap: 4 },
  row: { flexDirection: "row", alignItems: "center" },
  points: { marginLeft: 4 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: TOKENS.primary,
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
    borderWidth: 2,
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
    textAlign: "center",
  },
});
