import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { XP_PER_SPOT } from "@/constants/gamification";
import { Image, StyleSheet, View } from "react-native";

const rewardImage = require("@/assets/images/tour-reward.png");

const RewardCard = ({ spots, secrets }: { spots: number; secrets: number }) => {
  return (
    <View style={styles.rewardCard}>
      <Image source={rewardImage} style={styles.rewardImage} />
      <ThemedText type="default" style={styles.rewardContentText}>
        ¡Completa el tour y gana{" "}
        <ThemedText type="default" style={styles.rewardContentTextAccent}>
          +{spots * XP_PER_SPOT} XP
        </ThemedText>
        , y descubre{" "}
        <ThemedText type="default" style={styles.rewardContentTextAccent}>
          {secrets} ubicaciones secretas
        </ThemedText>
        !
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  rewardCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#39685F",
    borderRadius: 18,
    gap: 10,
  },
  rewardImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    transform: [{ rotate: "340deg" }],
  },
  rewardContent: {
    flexDirection: "column",
    gap: 10,
    flex: 1,
  },
  rewardContentText: {
    color: TOKENS.text,
    width: "75%",
  },
  rewardContentTextAccent: {
    color: TOKENS.accent,
  },
});

export default RewardCard;
