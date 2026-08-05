import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Image, StyleSheet, View } from "react-native";
import { BaseToastProps } from "react-native-toast-message";

// Obtenemos el ancho de la pantalla para hacer el toast responsive
const { width: SCREEN_WIDTH } = Dimensions.get("window");

type LevelUpToastProps = BaseToastProps & {
  props?: {
    levelImage?: string;
  };
};

/**
 * Componente de toast personalizado que se muestra cuando el usuario sube de nivel
 *
 * Este componente muestra:
 * - La imagen del nuevo nivel
 * - Un mensaje de felicitación animado
 * - Efectos visuales para hacer la celebración más atractiva
 */
export const LevelUpToast = (props: LevelUpToastProps) => {
  // Valores animados para crear efectos visuales
  const scaleAnim = useRef(new Animated.Value(0)).current; // Animación de escala (aparece desde pequeño)
  const rotateAnim = useRef(new Animated.Value(0)).current; // Animación de rotación para las estrellas
  const opacityAnim = useRef(new Animated.Value(0)).current; // Animación de opacidad

  // Extraemos los datos del nivel desde las props
  const levelName = props.text1 || "Nuevo Nivel";
  const levelImage = props?.props?.levelImage || "";

  // Efecto que se ejecuta cuando el componente se monta
  useEffect(() => {
    // Animación de entrada: el toast aparece con un efecto de escala y fade
    Animated.parallel([
      // Escala: comienza en 0 y llega a 1 (tamaño normal)
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50, // Controla qué tan "elástico" es el movimiento
        friction: 7, // Controla qué tan rápido se detiene
        useNativeDriver: true,
      }),
      // Opacidad: comienza en 0 (invisible) y llega a 1 (visible)
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación continua de rotación para las estrellas decorativas
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000, // Completa una rotación en 2 segundos
        useNativeDriver: true,
      }),
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Interpolación para la rotación: convierte el valor 0-1 en grados 0-360
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      {/* Gradiente de fondo para hacer el toast más atractivo */}
      <LinearGradient
        colors={["#F7A340", "#916026", "#6B4A1C"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Contenido del toast con animación de escala */}
        <Animated.View
          style={[
            styles.content,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Estrellas decorativas animadas */}
          <Animated.View
            style={[
              styles.starLeft,
              {
                transform: [{ rotate: rotateInterpolate }],
              },
            ]}
          >
            <MaterialIcons name="star" size={24} color={TOKENS.accent} />
          </Animated.View>

          <Animated.View
            style={[
              styles.starRight,
              {
                transform: [{ rotate: rotateInterpolate }],
              },
            ]}
          >
            <MaterialIcons name="star" size={24} color={TOKENS.accent} />
          </Animated.View>

          {/* Imagen del nivel */}
          {levelImage ? (
            <Image source={{ uri: levelImage }} style={styles.levelImage} />
          ) : (
            <View style={styles.levelImagePlaceholder}>
              <MaterialIcons
                name="emoji-events"
                size={40}
                color={TOKENS.text}
              />
            </View>
          )}

          {/* Mensaje principal */}
          <ThemedText type="title" style={styles.title}>
            ¡Subiste de Nivel!
          </ThemedText>

          {/* Nombre del nuevo nivel */}
          <ThemedText type="defaultSemiBold" style={styles.levelName}>
            {levelName}
          </ThemedText>

          {/* Mensaje secundario */}
          <ThemedText type="default" style={styles.message}>
            ¡Sigue explorando para alcanzar el siguiente nivel!
          </ThemedText>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH - 40, // Ancho del toast: pantalla menos márgenes
    borderRadius: 20,
    overflow: "hidden", // Asegura que el contenido no se salga del borde redondeado
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8, // Sombra para Android
  },
  gradient: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  levelImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: TOKENS.text,
  },
  levelImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    backgroundColor: TOKENS.cardBackground,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: TOKENS.text,
  },
  title: {
    fontSize: 24,
    color: TOKENS.text,
    marginBottom: 8,
    textAlign: "center",
  },
  levelName: {
    fontSize: 18,
    color: TOKENS.accent,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: TOKENS.text,
    textAlign: "center",
    opacity: 0.9,
  },
  starLeft: {
    position: "absolute",
    left: 20,
    top: 20,
  },
  starRight: {
    position: "absolute",
    right: 20,
    top: 20,
  },
});
