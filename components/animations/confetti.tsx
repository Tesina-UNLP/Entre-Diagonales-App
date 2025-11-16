import { TOKENS } from "@/constants/colors";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

/**
 * Representa una pieza individual de confetti
 */
interface ConfettiPiece {
  id: number;
  x: number; // Posición horizontal inicial
  color: string;
  delay: number; // Delay antes de caer
  duration: number; // Duración de la caída
  rotation: Animated.Value; // Valor animado para rotación
  translateY: Animated.Value; // Valor animado para caída
  translateX: Animated.Value; // Valor animado para movimiento horizontal
}

/**
 * Componente de confetti que muestra partículas cayendo
 *
 * Perfecto para celebraciones:
 * - Completar un tour
 * - Lograr un achievement
 * - Subir de nivel
 * - Conseguir un secreto
 *
 * IMPORTANTE: Este componente es eficiente porque:
 * - Usa useNativeDriver para todas las animaciones
 * - Se auto-desmonta después de terminar
 * - Las partículas son simples Views sin imágenes pesadas
 *
 * @param show - Controla si el confetti debe mostrarse
 * @param onComplete - Callback cuando termina la animación
 * @param particleCount - Número de partículas (por defecto 50)
 * @param colors - Array de colores para las partículas
 */
interface ConfettiProps {
  show: boolean;
  onComplete?: () => void;
  particleCount?: number;
  colors?: string[];
}

export const Confetti = ({
  show,
  onComplete,
  particleCount = 50,
  colors = [
    TOKENS.primary,
    TOKENS.accent,
    TOKENS.badgeActive,
    "#F7A340",
    "#8CBCB0",
    "#BE5310",
  ],
}: ConfettiProps) => {
  // Generamos las piezas de confetti solo una vez
  const pieces = useRef<ConfettiPiece[]>(
    Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      // Distribuimos las partículas por toda la pantalla
      x: Math.random() * SCREEN_WIDTH,
      color: colors[Math.floor(Math.random() * colors.length)],
      // Delays aleatorios para que no caigan todas al mismo tiempo
      delay: Math.random() * 300,
      // Duraciones aleatorias entre 2 y 4 segundos
      duration: 2000 + Math.random() * 2000,
      rotation: new Animated.Value(0),
      translateY: new Animated.Value(-50), // Comienzan arriba de la pantalla
      translateX: new Animated.Value(0),
    })),
  ).current;

  useEffect(() => {
    if (!show) return;

    // Animamos cada pieza de confetti
    const animations = pieces.map((piece) => {
      // Animación de caída
      const fall = Animated.timing(piece.translateY, {
        toValue: SCREEN_HEIGHT + 50, // Caen hasta abajo de la pantalla
        duration: piece.duration,
        delay: piece.delay,
        useNativeDriver: true,
      });

      // Animación de rotación continua
      const rotate = Animated.loop(
        Animated.timing(piece.rotation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      );

      // Animación de movimiento horizontal (simula viento)
      const swing = Animated.loop(
        Animated.sequence([
          Animated.timing(piece.translateX, {
            toValue: 30,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(piece.translateX, {
            toValue: -30,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      );

      return { fall, rotate, swing };
    });

    // Iniciamos todas las animaciones
    animations.forEach(({ fall, rotate, swing }) => {
      fall.start();
      rotate.start();
      swing.start();
    });

    // Cuando termine la animación más larga, llamamos onComplete
    const maxDuration = Math.max(...pieces.map((p) => p.duration + p.delay));
    const timeout = setTimeout(() => {
      onComplete?.();
    }, maxDuration);

    return () => {
      clearTimeout(timeout);
      // Detenemos todas las animaciones al desmontar
      animations.forEach(({ fall, rotate, swing }) => {
        fall.stop();
        rotate.stop();
        swing.stop();
      });
    };
  }, [show, pieces, onComplete]);

  if (!show) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {pieces.map((piece) => {
        // Interpolamos la rotación
        const rotateZ = piece.rotation.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "360deg"],
        });

        return (
          <Animated.View
            key={piece.id}
            style={[
              styles.confettiPiece,
              {
                backgroundColor: piece.color,
                left: piece.x,
                transform: [
                  { translateY: piece.translateY },
                  { translateX: piece.translateX },
                  { rotateZ },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999, // Aseguramos que esté por encima de todo
  },
  confettiPiece: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});
