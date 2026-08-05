import { TOKENS } from "@/constants/colors";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Image, StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";

interface Props {
  user: any;
  position: 1 | 2 | 3;
}

const podiumConfig = {
  1: {
    borderColor: TOKENS.firstPlaceLight,
    badgeBackground: TOKENS.firstPlace,
    icon: (
      <FontAwesome5
        name="trophy"
        size={16}
        color={TOKENS.firstPlaceLight}
        solid
      />
    ),
    sizeBadge: {
      justifyContent: "center",
      alignItems: "center",
      height: 48,
      width: 48,
    },
    avatarSize: 80,
    badgeFontSize: 24,
    badgeFontWeight: "black",
    offset: 0,
    textColor: TOKENS.firstPlaceLight,
  },
  2: {
    borderColor: TOKENS.secondPlaceLight,
    badgeBackground: TOKENS.secondPlace,
    icon: (
      <FontAwesome5
        name="medal"
        size={16}
        color={TOKENS.secondPlaceLight}
        solid
      />
    ),
    sizeBadge: {
      justifyContent: "center",
      alignItems: "center",
      height: 28,
      width: 32,
    },
    avatarSize: 64,
    badgeFontSize: 18,
    offset: 20,
    textColor: TOKENS.secondPlaceLight,
  },
  3: {
    borderColor: TOKENS.thirdPlaceLight,
    badgeBackground: TOKENS.thirdPlace,
    icon: (
      <FontAwesome5
        name="medal"
        size={16}
        color={TOKENS.thirdPlaceLight}
        solid
      />
    ),
    sizeBadge: {
      justifyContent: "center",
      alignItems: "center",
      height: 24,
      width: 28,
    },
    avatarSize: 60,
    badgeFontSize: 14,
    offset: 45,
    textColor: TOKENS.thirdPlaceLight,
  },
};

const PodiumItem = ({ user, position }: Props) => {
  const config = podiumConfig[position];

  return (
    <View style={[styles.container, { marginTop: config.offset }]}>
      {/* Avatar */}
      <View
        style={[
          styles.avatarWrapper,
          {
            width: config.avatarSize,
            height: config.avatarSize,
            borderRadius: config.avatarSize / 2,
            borderColor: config.borderColor,
            borderWidth: 2,
          },
        ]}
      >
        <Image
          source={{ uri: user.character }}
          style={styles.avatar}
          resizeMode="cover"
        />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.row}>
          {config.icon}

          <ThemedText
            type="defaultSemiBold"
            style={{
              color: config.textColor,
            }}
          >
            {Number(user?.experience ?? 0).toLocaleString()} pts
          </ThemedText>
        </View>

        <ThemedText type="defaultSemiBold" style={styles.username}>
          {user?.display_name?.slice(0, 12) ?? user.username?.slice(0, 12)}
        </ThemedText>

        <View
          style={[
            styles.badge,
            {
              justifyContent: "center",
              alignItems: "center",
              height: config.sizeBadge.height,
              width: config.sizeBadge.width,
              backgroundColor: config.badgeBackground,
            },
          ]}
        >
          <ThemedText
            type="subtitle"
            style={[
              {
                fontSize: config.badgeFontSize,
                color: config.textColor,
              },
            ]}
          >
            {position}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

export default PodiumItem;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: 110,
  },
  avatarWrapper: {
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  info: {
    alignItems: "center",
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  username: {
    marginTop: 4,
    textAlign: "center",
  },
  badge: {
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
});
