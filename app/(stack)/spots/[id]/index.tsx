import { Collapsible } from "@/components/Collapsible";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/libs/api";
import { capitalizeFirstLetter } from "@/libs/utils";
import { IndividualSpotApiResponse } from "@/types";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Obtenemos las dimensiones de la pantalla para el carousel
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const SpotDetails = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const idStr = useMemo(() => (Array.isArray(id) ? id?.[0] : id), [id]);
  const { user } = useAuth();
  const [spotInfo, setSpotInfo] = useState<IndividualSpotApiResponse | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const sheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();

  // Definimos los puntos de snap (posiciones) del bottom sheet
  // El mínimo es justo debajo del carousel (65% = 100% - 35% del carousel)
  // El máximo es el 100% para expandir completamente
  const snapPoints = useMemo(() => ["67%", "95%"], []);

  // Función para obtener los datos del spot desde la API
  const handleGetSpot = useCallback(async () => {
    setLoading(true);
    if (user) {
      const response = await api.getSpot(user.access, parseInt(idStr));
      if (response) {
        setSpotInfo(response);
      }
    }
    setLoading(false);
  }, [user, idStr]);

  // Ejecutamos la función cuando el componente se monta
  useEffect(() => {
    handleGetSpot();
  }, [handleGetSpot]);

  // Manejador del scroll del carousel para actualizar el índice de imagen activa
  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setActiveImageIndex(index);
  };

  // Renderizamos el backdrop (fondo oscuro) cuando el bottom sheet se expande
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={1} // Aparece cuando está en el segundo snap point (100%)
        disappearsOnIndex={0} // Desaparece cuando está en el primer snap point (65%)
        opacity={0.5} // Opacidad del fondo oscuro
        pressBehavior="collapse" // Al tocar el backdrop, colapsa el sheet
      />
    ),
    [],
  );

  // Función para compartir información del spot
  const handleShare = async () => {
    try {
      // Creamos el mensaje que se va a compartir
      const message = `¡Mira este lugar interesante!\n\n${spotInfo?.name}\n${spotInfo?.address}\n\n${spotInfo?.description || "Un lugar increíble para visitar."}`;

      // Llamamos a la API de Share con el contenido
      const result = await Share.share({
        message: message,
        title: spotInfo?.name || "Lugar de interés", // El título solo se usa en Android
      });

      // Verificamos si el usuario compartió exitosamente
      if (result.action === Share.sharedAction) {
        // El contenido fue compartido
        console.log("Contenido compartido exitosamente");
      } else if (result.action === Share.dismissedAction) {
        // El usuario canceló el diálogo de compartir
        console.log("El usuario canceló compartir");
      }
    } catch (error) {
      // Manejamos cualquier error que pueda ocurrir
      console.error("Error al compartir:", error);
    }
  };

  // Si está cargando, mostramos un indicador
  if (loading || !spotInfo) {
    return (
      <ThemedBackground style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={TOKENS.primary} />
        </View>
      </ThemedBackground>
    );
  }

  return (
    <ThemedBackground style={styles.container} safeArea={false}>
      {/* Carousel de imágenes */}
      <View style={styles.carouselContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {spotInfo.image_urls.map((imageUrl, index) => (
            <Image
              key={index}
              source={{ uri: imageUrl }}
              style={styles.carouselImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {/* Indicadores de página (puntos) */}
        <View style={styles.paginationContainer}>
          {spotInfo.image_urls.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === activeImageIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Botones flotantes en la parte superior derecha */}
      <View style={styles.floatingButtons}>
        {/* Botón de compartir */}
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-social" size={24} color={TOKENS.accent} />
        </TouchableOpacity>

        {/* Botón de cerrar */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Ionicons name="close" size={24} color={TOKENS.text} />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet con el contenido desplazable */}
      <BottomSheet
        ref={sheetRef}
        index={0} // Inicia en el primer snap point (65% - justo debajo del carousel)
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={false} // No permite cerrar arrastrando hacia abajo
        handleIndicatorStyle={{ backgroundColor: TOKENS.muted }}
        backgroundStyle={styles.sheetBackground}
        handleStyle={styles.handle}
        keyboardBehavior="extend"
        android_keyboardInputMode="adjustResize"
        enableOverDrag={false}
        overDragResistanceFactor={0}
        enableDynamicSizing={false}
      >
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingBottom: insets.bottom + 24,
            paddingHorizontal: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Encabezado con título, ubicación y tag */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <ThemedText type="subtitle">{spotInfo.name}</ThemedText>

              <View style={styles.locationContainer}>
                <Ionicons
                  name="location-sharp"
                  size={16}
                  color={TOKENS.accent}
                />
                <ThemedText type="muted">{spotInfo.address}</ThemedText>
              </View>
            </View>

            {/* Tag/Badge */}
            {spotInfo.tag && (
              <View style={styles.tagContainer}>
                <ThemedText style={styles.tagText}>
                  {capitalizeFirstLetter(spotInfo.tag)}
                </ThemedText>
              </View>
            )}
          </View>

          {/* Descripción */}
          {spotInfo.description && (
            <View style={styles.section}>
              <ThemedText type="default">{spotInfo.description}</ThemedText>
            </View>
          )}

          {/* Cuadro de "¿Sabías que?" (Fun Facts) */}
          {spotInfo.fun_facts && (
            <View style={styles.funFactsContainer}>
              <View style={styles.funFactsHeader}>
                <Ionicons name="bulb" size={20} color="#FF6B35" />
                <ThemedText style={styles.funFactsTitle}>
                  ¿Sabías que?
                </ThemedText>
              </View>
              <ThemedText style={styles.funFactsText}>
                {spotInfo.fun_facts}
              </ThemedText>
            </View>
          )}

          {/* Contexto Histórico */}
          {spotInfo.historical_information && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="time-outline" size={20} color={TOKENS.accent} />
                <ThemedText type="defaultSemiBold">
                  Contexto Histórico
                </ThemedText>
              </View>
              <ThemedText>{spotInfo.historical_information}</ThemedText>
            </View>
          )}

          {/* Información adicional */}
          <View style={styles.additionalInfo}>
            <View style={[styles.infoRow, { marginBottom: 8 }]}>
              <FontAwesome6 name="door-open" size={18} color={TOKENS.accent} />
              <ThemedText type="defaultSemiBold">
                Informacion para la visita
              </ThemedText>
            </View>

            {/* Horarios */}
            {spotInfo.schedule && (
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={20} color={TOKENS.muted} />
                <ThemedText style={styles.infoText}>
                  {spotInfo.schedule}
                </ThemedText>
              </View>
            )}

            {/* Precio de entrada */}
            {spotInfo.ticket_price !== null && (
              <View style={styles.infoRow}>
                <Ionicons name="ticket" size={20} color={TOKENS.muted} />
                <ThemedText type="muted">
                  Entrada: ${spotInfo.ticket_price}
                </ThemedText>
              </View>
            )}

            {/* Accesibilidad */}
            {spotInfo.wheelchair_accessible && (
              <View style={styles.infoRow}>
                <FontAwesome6
                  name="accessible-icon"
                  size={20}
                  color={TOKENS.muted}
                />
                <ThemedText style={styles.infoText}>
                  Accesible para sillas de ruedas
                </ThemedText>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <ThemedButton
              variant="accent"
              size="small"
              onPress={() =>
                Linking.openURL(
                  `https://www.google.com/maps/search/?api=1&query=${spotInfo.address}`,
                )
              }
            >
              Ir a Google Maps
            </ThemedButton>
            <ThemedButton variant="primary" size="small">
              Realizar trivia de este lugar
            </ThemedButton>
          </View>

          <View style={styles.section}>
            <Collapsible title="Fuentes y Referencias">
              <View>
                <ThemedText>Universidad Nacional De La Plata</ThemedText>
              </View>
              <View>
                <ThemedText>Municipio de La Plata</ThemedText>
              </View>
              <View>
                <ThemedText>Biblioteca Nacional de La Plata</ThemedText>
              </View>
            </Collapsible>
          </View>

          {/* Espaciado inferior para que el contenido no quede pegado al borde */}
          <View style={styles.bottomSpacing} />
        </BottomSheetScrollView>
      </BottomSheet>
    </ThemedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    marginTop: 0,
    paddingInline: 0,
    paddingHorizontal: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Estilos del carousel de imágenes
  carouselContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.35, // 35% de la altura de la pantalla
    position: "relative",
  },
  carouselImage: {
    width: SCREEN_WIDTH,
    height: "100%",
  },
  // Indicadores de página (puntos)
  paginationContainer: {
    position: "absolute",
    bottom: 25,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: TOKENS.text,
  },
  paginationDotActive: {
    backgroundColor: TOKENS.accent,
  },
  // Botones flotantes
  floatingButtons: {
    position: "absolute",
    top: 50,
    right: 16,
    gap: 12,
    flexDirection: "row",
    // zIndex: 10,
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: TOKENS.background,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: TOKENS.background,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  // Bottom Sheet
  sheetBackground: {
    backgroundColor: "#053734",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  handle: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  // Header (título, ubicación, tag)
  header: {
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContent: {
    gap: 8,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    maxWidth: "80%",
  },
  locationText: {
    fontSize: 14,
    color: TOKENS.muted,
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: TOKENS.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 100,
  },
  tagText: { color: TOKENS.background },
  // Descripción
  section: {
    marginTop: 20,
    gap: 8,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4a4a4a",
  },
  // Fun Facts
  funFactsContainer: {
    marginTop: 20,
    backgroundColor: "#974215",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#F7A340",
    gap: 8,
  },
  funFactsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  funFactsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F7A340",
  },
  funFactsText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#F7A340",
  },
  // Contexto Histórico
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4a4a4a",
  },
  // Información adicional
  additionalInfo: {
    marginTop: 20,
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: TOKENS.muted,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default SpotDetails;
