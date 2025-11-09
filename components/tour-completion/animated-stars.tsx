import { TOKENS } from "@/constants/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

/**
 * Props para el componente AnimatedStars
 * @param starsToShow - Número de estrellas a mostrar con opacidad completa (1-3)
 */
interface AnimatedStarsProps {
  starsToShow: number; // Número de estrellas que se deben mostrar (1-3)
}

/**
 * Componente que muestra 3 estrellas animadas
 * Las estrellas aparecen secuencialmente con una animación de entrada
 * Las estrellas que no se lograron aparecen con opacidad reducida
 */
export const AnimatedStars = ({ starsToShow }: AnimatedStarsProps) => {
  const star1Anim = useRef(new Animated.Value(0)).current;
  const star2Anim = useRef(new Animated.Value(0)).current;
  const star3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(500), // Espera 500ms antes de iniciar
      Animated.spring(star1Anim, {
        toValue: 1, // Valor final de la animación
        useNativeDriver: true, // Usa el driver nativo para mejor performance
        tension: 40, // Un poco menos de tensión para animación más suave
        friction: 6, // Un poco más de fricción para más control
      }),
    ]).start();

    // Estrella 2 (la del medio, más grande) aparece 500ms después de la primera
    Animated.sequence([
      Animated.delay(1000), // Total: 1 segundo desde el inicio
      Animated.spring(star2Anim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 40,
        friction: 6,
      }),
    ]).start();

    // Estrella 3 aparece 500ms después de la segunda
    Animated.sequence([
      Animated.delay(1500), // Total: 1.5 segundos desde el inicio
      Animated.spring(star3Anim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 40,
        friction: 6,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Array vacío significa que solo se ejecuta una vez al montar. Los valores de useRef son estables.

  return (
    <View style={styles.starsContainer}>
      {/* Primera estrella con animación */}
      <Animated.View
        style={{
          // Si starsToShow >= 1, la opacidad final es 1, si no, es 0.3 (atenuada)
          opacity: star1Anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, starsToShow >= 1 ? 1 : 0.3], // Opacidad final: 1 si se logró, 0.3 si no
          }),
          transform: [
            {
              scale: star1Anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1], // Escala desde 0 (invisible) hasta 1 (tamaño normal)
              }),
            },
          ],
        }}
      >
        <FontAwesome name="star" size={29} color={TOKENS.accent} />
      </Animated.View>

      {/* Segunda estrella (más grande) con animación */}
      <Animated.View
        style={{
          marginTop: 10,
          // Si starsToShow >= 2, la opacidad final es 1, si no, es 0.3
          opacity: star2Anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, starsToShow >= 2 ? 1 : 0.3],
          }),
          transform: [
            {
              scale: star2Anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
          ],
        }}
      >
        <FontAwesome name="star" size={40} color={TOKENS.accent} />
      </Animated.View>

      {/* Tercera estrella con animación */}
      <Animated.View
        style={{
          // Si starsToShow >= 3, la opacidad final es 1, si no, es 0.3
          opacity: star3Anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, starsToShow >= 3 ? 1 : 0.3],
          }),
          transform: [
            {
              scale: star3Anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
          ],
        }}
      >
        <FontAwesome name="star" size={29} color={TOKENS.accent} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  starsContainer: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: -15,
  },
});
