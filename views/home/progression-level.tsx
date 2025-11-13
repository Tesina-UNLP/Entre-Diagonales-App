import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";

const ProgressionLevel = () => {
  const { user } = useAuth();
  // Creamos un valor animado que comenzará en 0
  const animatedWidth = useRef(new Animated.Value(0)).current;

  // Calculamos el porcentaje de progreso
  const xp = user?.experience || 0;
  const req = user?.next_level?.xp_required || 1;
  const percent = Math.min((xp / req) * 100, 100);

  // Efecto que se ejecuta cuando cambia el porcentaje o cuando el componente se monta
  useEffect(() => {
    // Reiniciamos la animación a 0
    animatedWidth.setValue(0);

    // Creamos la animación que va de 0 al porcentaje final
    Animated.timing(animatedWidth, {
      toValue: percent, // Valor final: el porcentaje calculado
      duration: 1000, // Duración de la animación en milisegundos (1 segundo)
      useNativeDriver: false, // No podemos usar native driver para width
    }).start(); // Iniciamos la animación
  }, [percent, animatedWidth]);

  return (
    <View style={styles.levelProgressionContainer}>
      <Image
        source={{ uri: user?.level?.image_url }}
        style={styles.levelImage}
      />
      <View style={styles.levelProgressionInfo}>
        <View style={styles.levelExperience}>
          <ThemedText
            type="defaultSemiBold"
            style={styles.levelExperienceNumber}
          >
            {user?.experience}
          </ThemedText>
          <ThemedText type="default" style={styles.levelExperienceLabel}>
            Puntos de exploracion
          </ThemedText>
        </View>
        {/* Progress bar */}
        <View style={styles.levelProgressBarContainer}>
          <Animated.View
            style={[
              styles.levelProgressGradientWrapper,
              {
                width: animatedWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={["#F7A340", "#916026"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.levelProgressGradient}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.levelDotWrapper,
              {
                left: animatedWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          >
            <View style={styles.levelDot}>
              <MaterialIcons name="flag" size={15} color={TOKENS.text} />
            </View>
          </Animated.View>
        </View>
        <View style={styles.levelProgressPlan}>
          <ThemedText type="muted" style={styles.levelProgressPlanText}>
            {user?.level?.name}
          </ThemedText>
          <ThemedText type="muted" style={styles.levelProgressPlanText}>
            {user?.next_level?.name}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  levelProgressionContainer: {
    flexDirection: "row",
    gap: 20,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  levelImage: {
    width: 56,
    height: 56,
  },
  levelProgressionInfo: { justifyContent: "center", flex: 1, gap: 2 },
  levelExperience: { flexDirection: "row", alignItems: "center", gap: 4 },
  levelProgressBarContainer: {
    height: 8,
    width: "100%",
    borderRadius: 4,
    marginTop: 8,
    position: "relative",
    backgroundColor: TOKENS.tabBarInactive,
  },
  levelDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: TOKENS.navActive,
    borderWidth: 2,
    borderColor: TOKENS.text,
    alignItems: "center",
    justifyContent: "center",
  },
  levelProgressPlan: { flexDirection: "row", justifyContent: "space-between" },
  levelProgressGradientWrapper: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  levelProgressGradient: { height: 8, borderRadius: 4 },
  levelDotWrapper: {
    position: "absolute",
    top: -8,
    transform: [{ translateX: -12 }],
  },
  levelProgressPlanText: { marginTop: 4 },
  levelExperienceNumber: { fontSize: 18 },
  levelExperienceLabel: { color: TOKENS.navActive },
});

export default ProgressionLevel;
