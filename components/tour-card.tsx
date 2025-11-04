import { TOKENS } from "@/constants/colors";
import { TAGS } from "@/constants/lists";
import { capitalizeFirstLetter } from "@/libs/utils";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import React, { cloneElement } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedButton } from "./themed-button";
import { ThemedText } from "./themed-text";

const TourCard = ({
  title,
  description,
  image,
  id,
  tag,
  spotsCount,
  progress,
  started,
}: {
  title: string;
  description: string;
  image: string;
  id: string;
  tag?: string | null;
  spotsCount?: number;
  progress?: string;
  started?: string;
}) => {
  const progressNumber = Math.min(
    100,
    Math.max(0, Number(String(progress || "0").replace("%", ""))),
  );

  const categoryIcon = TAGS.find((t) => t.id === (tag || "todos"))?.icon;

  return (
    <Link asChild href={{ pathname: "/(tabs)/tours/[id]", params: { id } }}>
      <TouchableOpacity style={{ width: "100%", marginBottom: 20 }}>
        <View style={styles.tourCard}>
          <View style={styles.tourImageWrapper}>
            <Image
              source={{ uri: image }}
              style={styles.tourImage}
              resizeMode="cover"
            />
            {/* chip de categoría sobre la imagen */}
            <View style={styles.categoryChip}>
              {categoryIcon &&
                cloneElement(categoryIcon, {
                  color: TOKENS.primary,
                })}
              <ThemedText
                type="defaultSemiBold"
                style={styles.categoryChipText}
              >
                {capitalizeFirstLetter(tag || "General")}
              </ThemedText>
            </View>
          </View>

          {/* contenido inferior */}
          <View style={styles.tourContent}>
            <View style={styles.titleRow}>
              <ThemedText type="subtitle" style={styles.cardTitle}>
                {title}
              </ThemedText>
              <View style={styles.stopsChip}>
                <Ionicons
                  name="footsteps"
                  size={14}
                  color={TOKENS.background}
                  style={{ transform: [{ rotate: "90deg" }] }}
                />
                <ThemedText type="muted" style={styles.stopsChipText}>
                  {`${spotsCount || 0} paradas`}
                </ThemedText>
              </View>
            </View>

            {!!description && (
              <ThemedText type="muted">{description}</ThemedText>
            )}

            {/* barra de progreso */}
            <View style={styles.progressRow}>
              <View style={styles.progressTrack}>
                <View
                  style={[styles.progressFill, { width: `${progressNumber}%` }]}
                />
              </View>
              <ThemedText type="defaultSemiBold" style={styles.progressPercent}>
                {progressNumber}%
              </ThemedText>
            </View>

            {/* botón continuar visual (toda la card es clickeable) */}
            {started ? (
              <ThemedButton variant="primary" size="small">
                <View style={styles.continueButtonContent}>
                  <ThemedText type="defaultSemiBold">Continuar</ThemedText>
                  <FontAwesome6
                    name="arrow-right"
                    size={14}
                    color={TOKENS.text}
                  />
                </View>
              </ThemedButton>
            ) : (
              <ThemedButton variant="accent" size="small">
                <View style={styles.continueButtonContent}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.startButtonText}
                  >
                    Empezar
                  </ThemedText>
                  <MaterialIcons
                    name="play-circle"
                    size={18}
                    color={TOKENS.background}
                  />
                </View>
              </ThemedButton>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  tourCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  tourImageWrapper: {
    width: "100%",
    height: 140,
    position: "relative",
  },
  tourImage: {
    width: "100%",
    height: "100%",
  },
  categoryChip: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: TOKENS.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 100,
  },
  categoryChipText: { color: TOKENS.primary },
  tourContent: {
    gap: 10,
    backgroundColor: TOKENS.cardBackground,
    padding: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: { color: TOKENS.text },
  stopsChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: TOKENS.badgeActive,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  stopsChipText: { color: TOKENS.background },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 10,
    backgroundColor: TOKENS.badgeActive,
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: 10,
    backgroundColor: TOKENS.primary,
    borderRadius: 999,
  },
  progressPercent: { color: TOKENS.badgeActive },
  continueButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  startButtonText: { color: TOKENS.background },
});

export default TourCard;
