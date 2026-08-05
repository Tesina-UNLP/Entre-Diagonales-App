import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { useMessageOfTheDay } from "@/hooks/use-message-of-the-day";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet, View } from "react-native";

const MessageOfTheDay = () => {
  const { messageOfTheDay } = useMessageOfTheDay();

  return (
    <View style={styles.messageOfTheDay}>
      <View style={styles.messageOfTheDayIconContainer}>
        <MaterialIcons name="celebration" size={24} color={TOKENS.background} />
      </View>
      <View style={styles.messageOfTheDayTextContainer}>
        <ThemedText type="defaultSemiBold">{messageOfTheDay.title}</ThemedText>
        <ThemedText type="muted">{messageOfTheDay.description}</ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageOfTheDay: {
    flexDirection: "row",
    gap: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    backgroundColor: TOKENS.cardBackground,
    borderRadius: 18,
    marginBottom: 20,
  },
  messageOfTheDayIconContainer: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: TOKENS.tabBarInactive,
    alignSelf: "center",
  },
  messageOfTheDayTextContainer: {
    flex: 1,
  },
});

export default MessageOfTheDay;
