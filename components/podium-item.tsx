import { TOKENS } from "@/constants/colors";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Image, StyleSheet, Text, View } from "react-native";

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
        size={28}
        color={TOKENS.firstPlaceLight}
        solid
      />
    ),
    avatarSize: 100,
    badgeFontSize: 24,
    offset: 0,
    textColor: TOKENS.firstPlaceLight,
  },
  2: {
    borderColor: TOKENS.secondPlaceLight,
    badgeBackground: TOKENS.secondPlace,
    icon: (
      <FontAwesome5
        name="medal"
        size={22}
        color={TOKENS.secondPlaceLight}
        solid
      />
    ),
    avatarSize: 85,
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
        size={20}
        color={TOKENS.thirdPlaceLight}
        solid
      />
    ),
    avatarSize: 70,
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
            borderWidth: 3,
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

          <Text
            style={{
              marginLeft: 6,
              fontWeight: "bold",
              color: config.textColor,
            }}
          >
            {Number(user?.experience ?? 0).toLocaleString()} pts
          </Text>
        </View>

        <Text style={styles.username}>{user.username}</Text>

        <View
          style={[styles.badge, { backgroundColor: config.badgeBackground }]}
        >
          <Text
            style={[
              styles.badgeText,
              {
                fontSize: config.badgeFontSize,
                color: config.textColor,
                fontWeight: "bold",
              },
            ]}
          >
            {position}
          </Text>
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
  },
  username: {
    fontWeight: "600",
    marginTop: 4,
    color: TOKENS.text,
  },
  badge: {
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  badgeText: {
    color: "white",
    fontWeight: "bold",
  },
});
