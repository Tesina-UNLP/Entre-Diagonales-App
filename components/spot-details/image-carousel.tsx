/**
 * COMPONENTE: ImageCarousel
 *
 * Este componente muestra un carrusel (carousel) de imágenes que el usuario
 * puede deslizar horizontalmente. También muestra puntos indicadores en la
 * parte inferior para saber en qué imagen está.
 */

import { TOKENS } from "@/constants/colors";
import { useState, useRef } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, View } from "react-native";
import { ImageCarouselProps } from "./types";

// Obtenemos el ancho de la pantalla para que cada imagen ocupe todo el ancho
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const ImageCarousel = ({ imageUrls }: ImageCarouselProps) => {
  // Estado para trackear qué imagen está visible actualmente
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  // Referencia al ScrollView para poder controlarlo programáticamente si es necesario
  const scrollViewRef = useRef<ScrollView>(null);

  /**
   * Esta función se ejecuta cada vez que el usuario desliza el carousel.
   * Calcula qué imagen está visible basándose en la posición del scroll.
   */
  const handleScroll = (event: any) => {
    // Obtenemos cuánto se ha desplazado horizontalmente
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    // Calculamos el índice de la imagen actual
    // Dividimos el desplazamiento por el ancho de la pantalla y redondeamos
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setActiveImageIndex(index);
  };

  return (
    <View style={styles.container}>
      {/* ScrollView horizontal que contiene todas las imágenes */}
      <ScrollView
        ref={scrollViewRef}
        horizontal // Scroll horizontal en lugar de vertical
        pagingEnabled // Hace que el scroll se "enganche" a cada imagen
        showsHorizontalScrollIndicator={false} // Oculta la barra de scroll
        onScroll={handleScroll} // Función que se ejecuta al hacer scroll
        scrollEventThrottle={16} // Actualiza cada 16ms (~60fps)
      >
        {/* Mapeamos cada URL de imagen para crear un componente Image */}
        {imageUrls.map((imageUrl, index) => (
          <Image
            key={index}
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover" // La imagen cubre todo el espacio sin deformarse
          />
        ))}
      </ScrollView>

      {/* Indicadores de página (puntos) */}
      <View style={styles.paginationContainer}>
        {/* Creamos un punto por cada imagen */}
        {imageUrls.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              // El punto activo tiene un estilo diferente
              index === activeImageIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.35, // 35% de la altura de la pantalla
    position: "relative", // Para que los puntos puedan posicionarse absolutamente
  },
  image: {
    width: SCREEN_WIDTH,
    height: "100%",
  },
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
    borderRadius: 4, // Hace que sea circular
    backgroundColor: TOKENS.text,
  },
  paginationDotActive: {
    backgroundColor: TOKENS.accent, // Color diferente para el punto activo
  },
});
