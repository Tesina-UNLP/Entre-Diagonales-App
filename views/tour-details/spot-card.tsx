import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { SecretItemApiResponse, StopApiResponse } from "@/types";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export const SpotCard = ({
  spot,
  actual,
  completed,
  currentSpot,
  tourId,
}: {
  spot: StopApiResponse;
  actual: boolean;
  completed: boolean;
  currentSpot: StopApiResponse | null;
  tourId: number;
}) => {
  const urlToRedirect = {
    pathname: "/(stack)/spots/[id]" as const,
    params: { id: spot.spot.id, tourId: tourId },
  };
  return (
    <>
      <TouchableOpacity
        {...(completed ? { onPress: () => router.push(urlToRedirect) } : {})}
        style={[
          styles.spotCard,
          !completed && !actual && styles.spotIconInactive,
        ]}
      >
        <View style={styles.spotIconContainer}>
          {completed ? (
            <MaterialIcons name="check" size={20} color={TOKENS.primary} />
          ) : actual ? (
            <FontAwesome6
              name="location-arrow"
              size={18}
              color={TOKENS.primary}
            />
          ) : (
            <FontAwesome6
              name="dot-circle"
              size={18}
              color={TOKENS.badgeActive}
            />
          )}
        </View>
        <View style={styles.spotContent}>
          <ThemedText type="defaultSemiBold">{spot.spot.name}</ThemedText>
          <ThemedText type="muted">
            {completed ? "Completado" : actual ? "Proximo parada" : "Pendiente"}
          </ThemedText>
        </View>
        <View style={styles.spotAction}>
          {!completed ? (
            <FontAwesome6 name="lock" size={14} color={TOKENS.badgeActive} />
          ) : (
            <FontAwesome6
              name="arrow-right"
              size={14}
              color={TOKENS.badgeActive}
            />
          )}
        </View>
      </TouchableOpacity>
      {spot.spot.secret_items.map((secret) => (
        <SecretItemCard
          key={secret.id}
          secret={secret}
          actual={actual || spot.order < (currentSpot?.order || 0)}
          spot={spot}
          tourId={tourId}
          completed={completed}
        />
      ))}
    </>
  );
};

export const SecretItemCard = ({
  secret,
  actual,
  spot,
  completed,
  tourId,
}: {
  secret: SecretItemApiResponse;
  actual: boolean;
  spot: StopApiResponse;
  tourId: number;
  completed: boolean;
}) => {
  const urlToRedirect = secret.obtained
    ? `/(tabs)/profile/secrets/${secret.id}?id=${secret.id}&name=${secret.name}&description=${secret.description}&image_url=${secret.image_url}`
    : actual || completed
      ? `/(tabs)/scanner?mode=secret&from=/(tabs)/tours/${tourId}&secret_id=${secret.id}&spot_id=${spot.spot.id}&tour_id=${tourId}`
      : undefined;
  return (
    <TouchableOpacity
      onPress={() =>
        urlToRedirect ? router.navigate(urlToRedirect as any) : undefined
      }
      style={[
        styles.secretCard,
        !secret.obtained && !actual && !completed && styles.secretIconInactive,
      ]}
    >
      <View style={styles.secretIconContainer}>
        <MaterialIcons
          name="diamond"
          size={20}
          color={TOKENS.secretBackground}
        />
      </View>
      <View style={styles.secretContent}>
        <ThemedText type="defaultSemiBold" style={{ color: "#FAF9F8" }}>
          {secret.obtained ? secret.name : "Objeto secreto"}
        </ThemedText>
        <ThemedText type="muted" style={{ color: "#FAF9F8" }}>
          {secret.obtained
            ? "Obtuviste este objeto secreto"
            : actual
              ? secret.hint
              : "Un objeto secreto te espera en esta parada"}
        </ThemedText>
      </View>
      <View style={styles.secretAction}>
        {secret.obtained ? (
          <MaterialIcons name="check" size={14} color={"#FAF9F8"} />
        ) : (
          <Feather name="search" size={14} color={"#FAF9F8"} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  spotCard: {
    flexDirection: "row",
    gap: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: TOKENS.cardBackground,
    borderRadius: 18,
  },
  spotIconContainer: {
    padding: 10,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: TOKENS.badgeActive,
    alignSelf: "center",
  },
  spotIconInactive: {
    opacity: 0.5,
  },
  spotContent: {
    flex: 1,
    flexDirection: "column",
    gap: 2,
  },
  spotAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  secretCard: {
    flexDirection: "row",
    gap: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: TOKENS.secretBackground,
    borderRadius: 18,
  },
  secretIconContainer: {
    padding: 10,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#FAF9F8",
    alignSelf: "center",
  },
  secretIconInactive: {
    opacity: 0.5,
  },
  secretContent: {
    flex: 1,
    flexDirection: "column",
    gap: 2,
  },
  secretAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
