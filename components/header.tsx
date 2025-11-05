import { TOKENS } from "@/constants/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";

const Header = ({
  title,
  description,
  onBack,
}: {
  title: string;
  description: string;
  onBack: () => void;
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerActionRight}>
          <TouchableOpacity onPress={onBack}>
            <MaterialIcons
              name="arrow-back"
              size={24}
              color={TOKENS.badgeActive}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <ThemedText type="subtitle">{title}</ThemedText>
          <ThemedText type="muted">{description}</ThemedText>
        </View>
        <View style={styles.headerActionLeft}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: TOKENS.cardBackground,
    position: "relative",
    zIndex: 1000,
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-end",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 130,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerActionRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
    minWidth: 40,
  },
  headerActionLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    minWidth: 40,
  },
  headerCenter: {
    flex: 1,
    flexDirection: "column",
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Header;
