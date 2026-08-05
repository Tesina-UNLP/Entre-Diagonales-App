import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

// Creamos una versión animada del componente Circle
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Componente de barra de progreso circular
 * Muestra un círculo que se llena según el porcentaje de progreso
 *
 * @param obtained - Cantidad de items obtenidos
 * @param total - Cantidad total de items
 * @param size - Tamaño del círculo en píxeles (default: 60)
 */
interface CircleProgressProps {
  obtained: number;
  total: number;
  size?: number;
}

export const CircleProgress = ({
  obtained,
  total,
  size = 60,
}: CircleProgressProps) => {
  const strokeWidth = 6; // Grosor del círculo
  const radius = (size - strokeWidth) / 2; // Radio del círculo
  const circumference = radius * 2 * Math.PI; // Circunferencia del círculo
  const progress = total > 0 ? obtained / total : 0; // Calcular el porcentaje de progreso

  // Creamos un valor animado que comenzará en 0
  const animatedProgress = useRef(new Animated.Value(0)).current;

  // Efecto que se ejecuta cuando cambia el progreso o cuando el componente se monta
  useEffect(() => {
    // Reiniciamos la animación a 0
    animatedProgress.setValue(0);

    // Creamos la animación que va de 0 al progreso final
    Animated.timing(animatedProgress, {
      toValue: progress, // Valor final: el progreso calculado (0 a 1)
      duration: 1000, // Duración de la animación en milisegundos (1 segundo)
      useNativeDriver: false, // No podemos usar native driver para strokeDashoffset
    }).start(); // Iniciamos la animación
  }, [progress, animatedProgress]);

  // Interpolamos el valor animado para calcular el strokeDashoffset
  const animatedStrokeDashoffset = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0], // De circumference (vacío) a 0 (lleno)
  });

  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotate: "-90deg" }] }}
      >
        {/* Círculo de fondo (gris claro) */}
        <Circle
          stroke={TOKENS.text}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Círculo de progreso (color primario) */}
        <AnimatedCircle
          stroke={TOKENS.primary}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={animatedStrokeDashoffset}
          strokeLinecap="round"
        />
      </Svg>
      {/* Texto del porcentaje en el centro */}
      <View style={{ position: "absolute" }}>
        <ThemedText
          type="defaultSemiBold"
          style={{ fontSize: 16, color: TOKENS.text }}
        >
          {obtained}/{total}
        </ThemedText>
      </View>
    </View>
  );
};
