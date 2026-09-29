import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { DailyMessage } from "@/hooks/use-message-of-the-day";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet, View } from "react-native";

const MessageOfTheDay = ({ message }: { message: DailyMessage }) => {
  return (
    <View
      style={styles.messageOfTheDay}
      accessibilityLabel={`${message.title}. ${message.description}`}
    >
      <MaterialIcons
        name={message.icon}
        size={28}
        color={TOKENS.navActive}
        style={styles.messageIcon}
      />
      <View style={styles.messageOfTheDayTextContainer}>
        <ThemedText type="subtitle" style={styles.messageTitle}>
          {message.title}
        </ThemedText>
        <ThemedText type="muted" style={styles.messageDescription}>
          {message.description}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageOfTheDay: {
    flexDirection: "row",
    gap: 14,
    paddingVertical: 16,
    alignItems: "flex-start",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: TOKENS.tabBarInactive + "65",
    marginBottom: 20,
  },
  messageIcon: {
    marginTop: 1,
  },
  messageOfTheDayTextContainer: {
    flex: 1,
    gap: 3,
  },
  messageTitle: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageDescription: {
    lineHeight: 18,
  },
});

export default MessageOfTheDay;
