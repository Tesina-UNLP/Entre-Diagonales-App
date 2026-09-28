import { Image } from "expo-image";
import React, { useEffect, useId } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Defs, Ellipse, RadialGradient, Stop } from "react-native-svg";
import { useTranslation } from "react-i18next";

interface SecretParallaxObjectProps {
  imageUrl: string;
  name: string;
  kind?: "secret" | "achievement";
}

const MAX_TRANSLATE_X = 18;
const MAX_TRANSLATE_Y = 14;
const MAX_ROTATION = 8;

const clamp = (value: number, min: number, max: number) => {
  "worklet";
  return Math.min(Math.max(value, min), max);
};

/**
 * Convierte una imagen plana en un objeto manipulable mediante perspectiva,
 * desplazamiento, flotacion y una sombra desacoplada. Todo el movimiento corre
 * en el UI thread y queda acotado para no competir con la lectura de la pantalla.
 */
export function SecretParallaxObject({
  imageUrl,
  name,
  kind = "secret",
}: SecretParallaxObjectProps) {
  const { height, width } = useWindowDimensions();
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const objectSize = Math.max(Math.min(width * 0.7, height * 0.32, 310), 180);
  const shadowGradientId = `secret-shadow-${useId().replace(/:/g, "")}`;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const floatY = useSharedValue(0);
  const entrance = useSharedValue(reduceMotion ? 1 : 0);

  useEffect(() => {
    if (reduceMotion) {
      cancelAnimation(floatY);
      floatY.value = 0;
      entrance.value = 1;
      return;
    }

    entrance.value = withTiming(1, {
      duration: 520,
      easing: Easing.out(Easing.exp),
    });
    floatY.value = 3;
    floatY.value = withRepeat(
      withTiming(-5, {
        duration: 1900,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true,
    );

    return () => {
      cancelAnimation(floatY);
      cancelAnimation(entrance);
    };
  }, [entrance, floatY, reduceMotion]);

  const panGesture = Gesture.Pan()
    .enabled(!reduceMotion)
    .minDistance(3)
    .onUpdate((event) => {
      translateX.value = clamp(
        event.translationX * 0.32,
        -MAX_TRANSLATE_X,
        MAX_TRANSLATE_X,
      );
      translateY.value = clamp(
        event.translationY * 0.26,
        -MAX_TRANSLATE_Y,
        MAX_TRANSLATE_Y,
      );
    })
    .onFinalize(() => {
      const spring = { damping: 14, stiffness: 170, mass: 0.65 };
      translateX.value = withSpring(0, spring);
      translateY.value = withSpring(0, spring);
    });

  const stageStyle = useAnimatedStyle(() => ({
    opacity: entrance.value,
    transform: [{ scale: interpolate(entrance.value, [0, 1], [0.94, 1]) }],
  }));

  const objectStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 700 },
      { translateX: translateX.value },
      { translateY: translateY.value + floatY.value },
      {
        rotateX: `${interpolate(
          translateY.value,
          [-MAX_TRANSLATE_Y, MAX_TRANSLATE_Y],
          [MAX_ROTATION, -MAX_ROTATION],
        )}deg`,
      },
      {
        rotateY: `${interpolate(
          translateX.value,
          [-MAX_TRANSLATE_X, MAX_TRANSLATE_X],
          [-MAX_ROTATION, MAX_ROTATION],
        )}deg`,
      },
      {
        scale: interpolate(
          Math.abs(translateX.value) + Math.abs(translateY.value),
          [0, MAX_TRANSLATE_X + MAX_TRANSLATE_Y],
          [1, 1.025],
        ),
      },
    ],
  }));

  const shadowStyle = useAnimatedStyle(() => {
    const movement = Math.abs(translateX.value) + Math.abs(translateY.value);
    const distanceOpacity = interpolate(floatY.value, [-5, 3], [0.34, 0.46]);
    const gestureFade = interpolate(
      movement,
      [0, MAX_TRANSLATE_X + MAX_TRANSLATE_Y],
      [0, 0.04],
    );
    const floatScale = interpolate(floatY.value, [-5, 3], [0.88, 1.03]);

    return {
      opacity: distanceOpacity - gestureFade,
      transform: [
        { translateX: -translateX.value * 0.28 },
        { translateY: -translateY.value * 0.12 },
        {
          scaleX:
            floatScale *
            interpolate(
              movement,
              [0, MAX_TRANSLATE_X + MAX_TRANSLATE_Y],
              [1, 1.08],
            ),
        },
        {
          scaleY: interpolate(floatY.value, [-5, 3], [0.82, 1]),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.stage,
          { width: objectSize, height: objectSize + 34 },
          stageStyle,
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.shadow,
            {
              width: objectSize * 0.82,
              bottom: objectSize * 0.005,
            },
            shadowStyle,
          ]}
        >
          <Svg width="100%" height="100%" viewBox="0 0 100 48">
            <Defs>
              <RadialGradient
                id={shadowGradientId}
                cx="50%"
                cy="50%"
                rx="50%"
                ry="50%"
              >
                <Stop offset="0%" stopColor="#001210" stopOpacity={0.86} />
                <Stop offset="48%" stopColor="#001210" stopOpacity={0.4} />
                <Stop offset="100%" stopColor="#001210" stopOpacity={0} />
              </RadialGradient>
            </Defs>
            <Ellipse
              cx={50}
              cy={25}
              rx={44}
              ry={10}
              fill={`url(#${shadowGradientId})`}
            />
          </Svg>
        </Animated.View>

        <GestureDetector gesture={panGesture}>
          <Animated.View
            accessible
            accessibilityRole="image"
            accessibilityLabel={t(
              kind === "achievement"
                ? "achievements.interactiveObject"
                : "secrets.interactiveObject",
              { name },
            )}
            accessibilityHint={
              reduceMotion
                ? undefined
                : t(
                    kind === "achievement"
                      ? "achievements.interactionAccessibilityHint"
                      : "secrets.interactionAccessibilityHint",
                  )
            }
            style={[
              styles.object,
              { width: objectSize, height: objectSize },
              objectStyle,
            ]}
          >
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              contentFit="contain"
              cachePolicy="memory-disk"
              transition={reduceMotion ? 0 : 220}
              accessible={false}
              accessibilityIgnoresInvertColors
            />
          </Animated.View>
        </GestureDetector>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "stretch",
  },
  stage: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  object: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  shadow: {
    position: "absolute",
    height: 48,
  },
});
