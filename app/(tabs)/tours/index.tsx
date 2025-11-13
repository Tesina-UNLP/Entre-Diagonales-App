import { ThemedBackground } from "@/components/themed-background";
import { ThemedText } from "@/components/themed-text";
import TourCard from "@/components/tour-card";
import { TOKENS } from "@/constants/colors";
import { LEVELS, TAGS } from "@/constants/lists";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/libs/api";
import { TourApiResponse } from "@/types";
import { cloneElement, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const emptyImage = require("@/assets/images/empty.png");

export default function TabTwoScreen() {
  const [routes, setRoutes] = useState<TourApiResponse[]>([]);
  const [allRoutes, setAllRoutes] = useState<TourApiResponse[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>("todos");
  const [selectedLevel, setSelectedLevel] = useState<string | null>("1");
  const [refreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const { user } = useAuth();

  const handleGetRoutes = useCallback(async () => {
    try {
      // Activar el estado de carga al inicio
      setIsLoading(true);
      const response = await api.getRoutes(user?.access || "");
      setAllRoutes(response);
      setRoutes(response);
    } catch {
      Toast.show({
        type: "error",
        text1: "Error al obtener las rutas",
        text2: "Por favor, intente nuevamente más tarde.",
      });
    } finally {
      // Desactivar el estado de carga al finalizar (exitoso o con error)
      setIsLoading(false);
    }
  }, [user?.access]);

  useEffect(() => {
    handleGetRoutes();
  }, [handleGetRoutes]);

  const applyFilters = useCallback(
    (tag: string | null, level: string | null) => {
      let result = allRoutes;

      if (tag && tag !== "todos") {
        result = result.filter((route) => route.tag === tag);
      }

      if (level && level !== "1") {
        const maxSpots = LEVELS.find((l) => l.id === level)?.maxSpots;
        if (typeof maxSpots === "number") {
          result = result.filter(
            (route) => (route.spots.length || 0) <= maxSpots,
          );
        }
      }

      setRoutes(result);
    },
    [allRoutes],
  );

  useEffect(() => {
    applyFilters(selectedTag, selectedLevel);
  }, [applyFilters, selectedTag, selectedLevel]);

  const handleFilterByTag = (tag: string) => {
    setSelectedTag(tag);
    applyFilters(tag, selectedLevel);
  };

  const handleFilterByLevel = (level: string) => {
    setSelectedLevel(level);
    applyFilters(selectedTag, level);
  };

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title">Explora todos los tours</ThemedText>
        <ThemedText type="muted">Elige la ruta que deseas comenzar</ThemedText>
      </View>

      {/* Scrolleable horizontal badge selector category */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.badgeContainer}
        >
          {TAGS.map((tag) => (
            <TouchableOpacity
              key={tag.id}
              style={[
                styles.badge,
                selectedTag === tag.id && styles.badgeActive,
              ]}
              onPress={() => handleFilterByTag(tag.id)}
            >
              {cloneElement(tag.icon, {
                color: selectedTag === tag.id ? TOKENS.background : TOKENS.text,
              })}

              <ThemedText
                type="defaultSemiBold"
                style={[
                  styles.badgeText,
                  selectedTag === tag.id && styles.badgeTextActive,
                ]}
              >
                {tag.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Scrolleable horizontal badge selector level */}
      <View style={[styles.filterSection, { marginBottom: 20 }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.badgeContainer}
        >
          {LEVELS.map((level) => (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.badge,
                selectedLevel === level.id && styles.badgeActive,
              ]}
              onPress={() => handleFilterByLevel(level.id)}
            >
              <ThemedText
                type="defaultSemiBold"
                style={[
                  styles.badgeText,
                  selectedLevel === level.id && styles.badgeTextActive,
                ]}
              >
                {level.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );

  // Si está cargando, mostrar el loader
  if (isLoading) {
    return (
      <ThemedBackground style={styles.container}>
        {renderHeader()}
        <LoadingComponent />
      </ThemedBackground>
    );
  }

  return (
    <ThemedBackground style={styles.container}>
      <FlatList
        data={routes}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => handleGetRoutes()}
            tintColor={TOKENS.primary}
            progressBackgroundColor={TOKENS.primary}
            colors={[TOKENS.navActive]}
          />
        }
        ListHeaderComponent={renderHeader}
        ListFooterComponent={() => <View style={styles.bottomSpacer}></View>}
        ListEmptyComponent={<EmptyComponent />}
        renderItem={({ item }) => (
          <TourCard
            title={item.name}
            description={item.description || ""}
            image={
              item.spots[0].spot.image_urls[0] ||
              "https://images.unsplash.com/photo-1600591832245-9a9f49ec6f5a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGElMjBwbGF0YXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=400"
            }
            id={item.id.toString()}
            tag={item.tag}
            spotsCount={item.spots.length}
            progress={item.progress}
            started={item.started}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </ThemedBackground>
  );
}

// Componente que se muestra cuando NO hay rutas después de cargar
const EmptyComponent = () => (
  <View style={styles.emptyContainer}>
    <Image source={emptyImage} style={styles.emptyImage} />
    <ThemedText type="defaultSemiBold">No hay rutas disponibles</ThemedText>
  </View>
);

// Componente que se muestra mientras se cargan los datos
const LoadingComponent = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={TOKENS.primary} />
  </View>
);

const styles = StyleSheet.create({
  emptyImage: {
    width: 200,
    height: 200,
  },
  emptyContainer: {
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    marginTop: 12,
    color: TOKENS.text,
  },
  bottomSpacer: { height: 120 },
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  filterSection: {
    marginBottom: 10,
  },
  filterTitle: {
    fontSize: 14,
    marginBottom: 12,
    color: TOKENS.text,
  },
  badgeContainer: {
    paddingRight: 20,
    gap: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: TOKENS.primary,
  },
  badgeActive: {
    backgroundColor: TOKENS.badgeActive,
    borderColor: TOKENS.badgeActive,
  },
  badgeText: {
    color: TOKENS.text,
    fontSize: 14,
  },
  badgeTextActive: {
    color: TOKENS.background,
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 20,
  },
});
