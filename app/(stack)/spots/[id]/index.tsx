import { Collapsible } from "@/components/Collapsible";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/libs/api";
import { IndividualSpotApiResponse } from "@/types";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Share, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// Importamos todos los componentes modulares que creamos
import {
  ActionButtons,
  FloatingButtons,
  FunFactsCard,
  HistoricalSection,
  ImageCarousel,
  QuizChallengeCard,
  SpotHeader,
  VisitInfoSection,
} from "@/components/spot-details";

const SpotDetails = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const idStr = useMemo(() => (Array.isArray(id) ? id?.[0] : id), [id]);
  const { user } = useAuth();
  const [spotInfo, setSpotInfo] = useState<IndividualSpotApiResponse | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const insets = useSafeAreaInsets();

  const snapPoints = useMemo(() => ["67%", "95%"], []);

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

  useEffect(() => {
    handleGetSpot();
  }, [handleGetSpot]);

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

  /**
   * Función para compartir información del spot.
   * Usa la API nativa de Share de React Native.
   */
  const handleShare = async () => {
    try {
      // Creamos el mensaje que se va a compartir
      const message = `¡Mira este lugar interesante!\n\n${spotInfo?.name}\n${spotInfo?.address}\n\n${spotInfo?.description || "Un lugar increíble para visitar."}`;

      // Llamamos a la API de Share con el contenido
      await Share.share({
        message: message,
        title: spotInfo?.name || "Lugar de interés",
      });
    } catch {
      // Manejamos cualquier error silenciosamente
    }
  };

  /**
   * Función para cerrar la pantalla y volver atrás.
   */
  const handleClose = () => {
    router.back();
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
      {/* Carousel de imágenes - Ahora es un componente separado */}
      <ImageCarousel imageUrls={spotInfo.image_urls} />

      {/* Botones flotantes - Ahora es un componente separado */}
      <FloatingButtons onShare={handleShare} onClose={handleClose} />

      {/* Bottom Sheet con el contenido desplazable */}
      <BottomSheet
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={false}
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
          {/* Encabezado con título, ubicación y tag - Componente modular */}
          <SpotHeader
            name={spotInfo.name}
            address={spotInfo.address}
            tag={spotInfo.tag ?? undefined}
          />

          {/* Descripción */}
          {spotInfo.description && (
            <View style={styles.section}>
              <ThemedText type="default">{spotInfo.description}</ThemedText>
            </View>
          )}

          {/* Tarjeta de Trivia Disponible - Solo si NO está resuelta y SI existe */}
          {!spotInfo.quiz_solved && spotInfo.quiz && (
            <QuizChallengeCard quizId={spotInfo.quiz.id} />
          )}

          {/* Fun Facts - Componente modular */}
          {spotInfo.fun_facts && <FunFactsCard funFacts={spotInfo.fun_facts} />}

          {/* Contexto Histórico - Componente modular */}
          {spotInfo.historical_information && (
            <HistoricalSection
              historicalInfo={spotInfo.historical_information}
            />
          )}

          {/* Información de visita - Componente modular */}
          <VisitInfoSection
            schedule={spotInfo.schedule}
            ticketPrice={spotInfo.ticket_price}
            wheelchairAccessible={spotInfo.wheelchair_accessible}
          />

          {/* Botones de acción - Componente modular */}
          <ActionButtons
            address={spotInfo.address}
            quizSolved={spotInfo.quiz_solved}
            hasQuiz={!!spotInfo.quiz}
            quizId={spotInfo.quiz?.id}
          />

          {/* Referencias */}
          <View style={styles.section}>
            <Collapsible title="Fuentes y Referencias">
              <View style={styles.referenceItem}>
                <View style={styles.referenceBullet} />
                <ThemedText style={styles.referenceText}>
                  Universidad Nacional De La Plata
                </ThemedText>
              </View>
              <View style={styles.referenceItem}>
                <View style={styles.referenceBullet} />
                <ThemedText style={styles.referenceText}>
                  Municipio de La Plata
                </ThemedText>
              </View>
              <View style={styles.referenceItem}>
                <View style={styles.referenceBullet} />
                <ThemedText style={styles.referenceText}>
                  Biblioteca Nacional de La Plata
                </ThemedText>
              </View>
            </Collapsible>
          </View>

          {/* Espaciado inferior */}
          <View style={styles.bottomSpacing} />
        </BottomSheetScrollView>
      </BottomSheet>
    </ThemedBackground>
  );
};

// Estilos simplificados - La mayoría se movieron a los componentes modulares
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
  // Sección genérica (usada para descripción y referencias)
  section: {
    marginTop: 20,
    gap: 8,
  },
  // Referencias
  referenceItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    paddingVertical: 4,
  },
  referenceBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: TOKENS.primary,
  },
  referenceText: {
    flex: 1,
    lineHeight: 20,
    opacity: 0.9,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default SpotDetails;
