import { FadeInView } from "@/components/animations/fade-in-view";
import { TourCardSkeleton } from "@/components/skeletons/tour-card-skeleton";
import { ToursFiltersSkeleton } from "@/components/skeletons/tours-filters-skeleton";
import { ToursHeaderSkeleton } from "@/components/skeletons/tours-header-skeleton";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedText } from "@/components/themed-text";
import TourCard from "@/components/tour-card";
import { TOKENS } from "@/constants/colors";
import { LEVELS, TAGS } from "@/constants/lists";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/libs/api";
import { TourApiResponse } from "@/types";
import { cloneElement, useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
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
  const [selectedTag, setSelectedTag] = useState<string | null>("todos");
  const [selectedLevel, setSelectedLevel] = useState<string | null>("1");
  const [completionFilter, setCompletionFilter] = useState<
    "incomplete" | "completed"
  >("incomplete");
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const nextPageRef = useRef(2);
  const { user } = useAuth();
  const currentAccessRef = useRef<string | undefined>(user?.access);
  const requestIdRef = useRef(0);
  const loadingMoreRef = useRef(false);
  const hasNextPageRef = useRef(false);

  currentAccessRef.current = user?.access;

  const selectedMaxSpots = LEVELS.find(
    (level) => level.id === selectedLevel,
  )?.maxSpots;

  const loadRoutes = useCallback(
    async (page: number, replace: boolean, isRefresh = false) => {
      const accessToken = user?.access;

      if (!accessToken) {
        setRoutes([]);
        setHasNextPage(false);
        hasNextPageRef.current = false;
        nextPageRef.current = 2;
        setIsLoading(false);
        return;
      }

      if (!replace && (!hasNextPageRef.current || loadingMoreRef.current)) {
        return;
      }

      const requestId = ++requestIdRef.current;
      if (isRefresh) {
        setRefreshing(true);
      } else if (replace) {
        setIsLoading(true);
      } else {
        loadingMoreRef.current = true;
        setLoadingMore(true);
      }

      try {
        const response = await api.getRoutesPage(accessToken, {
          page,
          tag: selectedTag === "todos" ? undefined : (selectedTag ?? undefined),
          completion: completionFilter,
          maxSpots: selectedMaxSpots,
        });
        if (
          currentAccessRef.current !== accessToken ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        setRoutes((current) => {
          const merged = replace
            ? response.results
            : [...current, ...response.results];
          return Array.from(
            new Map(merged.map((route) => [route.id, route])).values(),
          );
        });
        setHasNextPage(response.next !== null);
        hasNextPageRef.current = response.next !== null;
        nextPageRef.current = page + 1;
      } catch {
        if (
          currentAccessRef.current !== accessToken ||
          requestId !== requestIdRef.current
        ) {
          return;
        }

        Toast.show({
          type: "error",
          text1: "Error al obtener las rutas",
          text2: "Por favor, intente nuevamente más tarde.",
        });
      } finally {
        if (
          currentAccessRef.current === accessToken &&
          requestId === requestIdRef.current
        ) {
          setIsLoading(false);
          setRefreshing(false);
          setLoadingMore(false);
          loadingMoreRef.current = false;
        }
      }
    },
    [completionFilter, selectedMaxSpots, selectedTag, user?.access],
  );

  useEffect(() => {
    setRoutes([]);
    setHasNextPage(false);
    hasNextPageRef.current = false;
    nextPageRef.current = 2;
    void loadRoutes(1, true);

    return () => {
      requestIdRef.current += 1;
    };
  }, [loadRoutes]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasNextPage) {
      void loadRoutes(nextPageRef.current, false);
    }
  }, [hasNextPage, isLoading, loadRoutes]);

  const refreshRoutes = useCallback(() => {
    void loadRoutes(1, true, true);
  }, [loadRoutes]);

  const handleFilterByTag = (tag: string) => {
    setSelectedTag(tag);
  };

  const handleFilterByLevel = (level: string) => {
    setSelectedLevel(level);
  };

  const renderHeader = () => (
    <>
      {/* Header con animación fade-in */}
      <FadeInView delay={100}>
        <View style={styles.header}>
          <ThemedText type="title">Explora todos los tours</ThemedText>
          <ThemedText type="muted">
            Elige la ruta que deseas comenzar
          </ThemedText>
        </View>
      </FadeInView>

      {/* Scrolleable horizontal badge selector category con fade-in */}
      <FadeInView delay={200}>
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
                  color:
                    selectedTag === tag.id ? TOKENS.background : TOKENS.text,
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
      </FadeInView>

      {/* Scrolleable horizontal badge selector level con fade-in */}
      <FadeInView delay={300}>
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
      </FadeInView>

      {/* Tab Switcher - Selector de completados/no completados */}
      <FadeInView delay={150}>
        <View style={styles.tabContainer}>
          {/* Tab: No completados */}
          <Pressable
            style={[
              styles.tab,
              completionFilter === "incomplete" && styles.tabActive,
            ]}
            onPress={() => setCompletionFilter("incomplete")}
          >
            <ThemedText
              type={
                completionFilter === "incomplete" ? "defaultSemiBold" : "muted"
              }
              style={[
                completionFilter === "incomplete" && styles.tabTextActive,
              ]}
            >
              No completados
            </ThemedText>
          </Pressable>

          {/* Tab: Completados */}
          <Pressable
            style={[
              styles.tab,
              completionFilter === "completed" && styles.tabActive,
            ]}
            onPress={() => setCompletionFilter("completed")}
          >
            <ThemedText
              type={
                completionFilter === "completed" ? "defaultSemiBold" : "muted"
              }
              style={[completionFilter === "completed" && styles.tabTextActive]}
            >
              Completados
            </ThemedText>
          </Pressable>
        </View>
      </FadeInView>
    </>
  );

  // Función para renderizar el header con skeletons cuando está cargando
  const renderSkeletonHeader = () => (
    <>
      <ToursHeaderSkeleton />
      <ToursFiltersSkeleton />
    </>
  );

  // Si está cargando, mostrar los skeletons
  if (isLoading) {
    return (
      <ThemedBackground style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {renderSkeletonHeader()}
          {/* Mostrar varios TourCard skeletons */}
          {[1, 2, 3].map((item) => (
            <TourCardSkeleton key={item} />
          ))}
          <View style={styles.bottomSpacer}></View>
        </ScrollView>
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
            onRefresh={refreshRoutes}
            tintColor={TOKENS.primary}
            progressBackgroundColor={TOKENS.primary}
            colors={[TOKENS.navActive]}
          />
        }
        ListHeaderComponent={renderHeader}
        ListFooterComponent={() => (
          <>
            {loadingMore && <ActivityIndicator color={TOKENS.primary} />}
            <View style={styles.bottomSpacer} />
          </>
        )}
        ListEmptyComponent={<EmptyComponent />}
        renderItem={({ item, index }) => (
          // Cada card aparece con un delay incremental
          // Los primeros 3 cards tienen delays más notables, luego se estabiliza
          <FadeInView delay={400 + Math.min(index * 50, 200)}>
            <TourCard
              title={item.name}
              description={item.description || ""}
              image={
                item.spots[0]?.spot.image_urls[0] ||
                "https://images.unsplash.com/photo-1600591832245-9a9f49ec6f5a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGElMjBwbGF0YXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=400"
              }
              id={item.id.toString()}
              tag={item.tag}
              spotsCount={item.spots.length}
              progress={item.progress}
              started={item.started}
            />
          </FadeInView>
        )}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        contentContainerStyle={styles.listContent}
      />
    </ThemedBackground>
  );
}

// Componente que se muestra cuando NO hay rutas después de cargar
const EmptyComponent = () => (
  <FadeInView delay={400}>
    <View style={styles.emptyContainer}>
      <Image source={emptyImage} style={styles.emptyImage} />
      <ThemedText type="defaultSemiBold">No hay rutas disponibles</ThemedText>
    </View>
  </FadeInView>
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
  // Estilos para el Tab Switcher
  tabContainer: {
    flexDirection: "row",
    backgroundColor: TOKENS.cardBackground,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: TOKENS.badgeActive,
  },
  // tabText: {
  //   fontSize: 14,
  //   fontWeight: "600",
  //   color: TOKENS.muted,
  // },
  tabTextActive: {
    color: TOKENS.background,
  },
});
