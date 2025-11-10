import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import React from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";

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
  const strokeDashoffset = circumference - progress * circumference; // Calcular cuánto del círculo debe estar lleno

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
        <Circle
          stroke={TOKENS.primary}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
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
