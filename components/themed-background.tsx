// components/ThemedBackground.tsx
import { StyleSheet, View, ViewStyle } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

interface ThemedBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export function ThemedBackground({ children, style }: ThemedBackgroundProps) {
  return (
    <View style={[styles.container, style]}>
      {/* Base color */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "#004643" }]} />

      {/* Radial bottom-left */}
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient
            id="gradBL"
            cx="0%"
            cy="100%"
            r="80%"
            fx="0%"
            fy="100%"
          >
            <Stop offset="0%" stopColor="#122120" stopOpacity="1" />
            <Stop offset="100%" stopColor="#122120" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#gradBL)" />
      </Svg>

      {/* Radial top-right */}
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient
            id="gradTR"
            cx="100%"
            cy="0%"
            r="80%"
            fx="100%"
            fy="0%"
          >
            <Stop offset="0%" stopColor="#122120" stopOpacity="1" />
            <Stop offset="100%" stopColor="#122120" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#gradTR)" />
      </Svg>

      {/* Content */}
      <View style={{ flex: 1, paddingInline: 16, paddingTop: 30 }}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
