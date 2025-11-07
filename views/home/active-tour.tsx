import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { capitalizeFirstLetter } from "@/libs/utils";
import { TourApiResponse } from "@/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

const ActiveTour = ({
  currentRoute,
}: {
  currentRoute: TourApiResponse | null;
}) => {
  const { user } = useAuth();

  return (
    currentRoute && (
      <View style={styles.currentRouteContainer}>
        <ThemedText type="subtitle" style={styles.subtitleMarginTop}>
          Ruta actual
        </ThemedText>
        <Link
          href={{
            pathname: "/(stack)/tours/[id]",
            params: { id: currentRoute.id.toString() },
          }}
          asChild
        >
          <TouchableOpacity style={styles.currentRouteCard}>
            <View style={styles.currentRouteHeaderRow}>
              <View style={styles.currentRouteLeftRow}>
                <MaterialIcons
                  name="route"
                  size={24}
                  color={TOKENS.tabBarInactive}
                />
                <ThemedText type="defaultSemiBold">
                  {currentRoute.name}
                </ThemedText>
              </View>
              {/* badge */}
              <View style={styles.badge}>
                <ThemedText type="default">
                  {capitalizeFirstLetter(currentRoute.tag || "General")}
                </ThemedText>
              </View>
            </View>
            <ThemedText type="default">{currentRoute.description}</ThemedText>
            {/* Progress bar simple  */}
            <View style={styles.simpleProgressBar}>
              <View
                style={[
                  styles.simpleProgressBarFill,
                  { width: `${Number(currentRoute.progress) || 0}%` },
                ]}
              />
            </View>

            {currentRoute.number_of_people_completed > 0 ? (
              <View style={styles.completedRow}>
                <View style={styles.completedAvatarsRow}>
                  {[1, 2, 3].map((item, i) => (
                    <Image
                      key={item}
                      source={{ uri: user?.character?.image_url }}
                      style={[
                        styles.overlapAvatarBase,
                        { marginLeft: i === 0 ? 0 : -6 },
                      ]}
                    />
                  ))}
                </View>
                <ThemedText type="muted">
                  {currentRoute.number_of_people_completed} personas lo
                  completaron!
                </ThemedText>
              </View>
            ) : (
              <ThemedText type="muted">
                Puedes ser el primero en completarla!
              </ThemedText>
            )}
          </TouchableOpacity>
        </Link>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  subtitleMarginTop: { marginTop: 4 },
  currentRouteContainer: { gap: 10, marginBottom: 20 },
  currentRouteCard: {
    flexDirection: "column",
    gap: 10,
    backgroundColor: TOKENS.cardBackground,
    padding: 16,
    borderRadius: 18,
  },
  currentRouteHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  currentRouteLeftRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: TOKENS.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 100,
  },
  simpleProgressBar: {
    height: 8,
    width: "100%",
    borderRadius: 10,
    marginTop: 8,
    position: "relative",
    backgroundColor: "#FCDEAC",
  },
  simpleProgressBarFill: {
    height: 8,
    borderRadius: 4,
    backgroundColor: TOKENS.navActive,
  },
  completedRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  completedAvatarsRow: { flexDirection: "row", alignItems: "center" },
  overlapAvatarBase: {
    width: 28,
    height: 28,
    borderRadius: 100,
    backgroundColor: TOKENS.tabBarInactive,
    borderWidth: 2,
    borderColor: TOKENS.tabBarInactive,
  },
});

export default ActiveTour;
