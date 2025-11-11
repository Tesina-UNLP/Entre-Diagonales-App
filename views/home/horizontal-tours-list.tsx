import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { capitalizeFirstLetter } from "@/libs/utils";
import { TourApiResponse } from "@/types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const HorizontalTourList = ({ routes }: { routes: Array<TourApiResponse> }) => {
  return (
    <View style={styles.recommendedContainer}>
      <View style={styles.recommendedHeaderRow}>
        <ThemedText type="subtitle">Rutas recomendadas</ThemedText>
        <Link href={{ pathname: "/(tabs)/tours" }}>
          <ThemedText type="default" style={styles.viewAllText}>
            Ver todas
          </ThemedText>
        </Link>
      </View>

      <FlatList
        data={routes}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Link
            asChild
            href={{
              pathname: "/(tabs)/tours/[id]",
              params: { id: item.id.toString() },
            }}
          >
            <TouchableOpacity style={styles.routeItemContainer}>
              <View style={styles.routeCard}>
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1600591832245-9a9f49ec6f5a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGElMjBwbGF0YXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=400",
                  }}
                  style={styles.routeCardImage}
                />
                {/* capa oscura sutil para mejorar contraste del texto */}
                <View style={styles.routeCardOverlay} />
                <View style={styles.routeCardInfo}>
                  <View style={styles.routeCardTagRow}>
                    <MaterialIcons name="house" size={20} color={TOKENS.text} />
                    <ThemedText type="default" style={styles.routeCardText}>
                      {capitalizeFirstLetter(item?.tag || "General")}
                    </ThemedText>
                  </View>
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.routeCardTitle}
                  >
                    {item?.name}
                  </ThemedText>
                  <View style={styles.routeCardFooterRow}>
                    <View style={styles.routeCardDistanceRow}>
                      <MaterialIcons
                        name="place"
                        size={16}
                        color={TOKENS.text}
                      />
                      <ThemedText type="muted" style={styles.routeCardText}>
                        1.2 km
                      </ThemedText>
                    </View>
                    <ThemedText type="muted" style={styles.routeCardText}>
                      1 hora
                    </ThemedText>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  recommendedContainer: { gap: 10, marginTop: 20 },
  recommendedHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewAllText: { color: TOKENS.navActive },
  routeItemContainer: { marginRight: 12 },
  routeCard: {
    width: 180,
    height: 223,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  routeCardImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    opacity: 0.6,
  },
  routeCardOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: TOKENS.cardBackground,
  },
  routeCardInfo: { position: "absolute", bottom: 8, left: 15, right: 15 },
  routeCardTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 4,
  },
  routeCardText: { color: TOKENS.text },
  routeCardTitle: { color: TOKENS.text },
  routeCardFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  routeCardDistanceRow: { flexDirection: "row", alignItems: "center", gap: 4 },
});

export default HorizontalTourList;
