import { ThemedBackground } from "@/components/themed-background";
import { ThemedText } from "@/components/themed-text";
import { StyleSheet } from "react-native";

export default function RankingScreen() {
  return (
    <ThemedBackground style={styles.container}>
      <ThemedText>Ranking</ThemedText>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
