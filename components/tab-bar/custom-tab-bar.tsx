import React from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");

export function CustomTabBar() {
  const insets = useSafeAreaInsets();

  const BASE_HEIGHT = Platform.OS === "ios" ? 112 : 100;
  const HEIGHT = BASE_HEIGHT + insets.bottom;

  return (
    <View
      style={[
        styles.container,
        { height: HEIGHT, paddingBottom: insets.bottom },
      ]}
    >
      <Svg
        width={width}
        height={HEIGHT}
        style={styles.svg}
        viewBox={`0 0 ${width} ${HEIGHT}`}
      >
        {/* Ojo: el path usa HEIGHT para cerrar abajo, así acompaña bien */}
        <Path
          d={`M${width / 2} 0C${width / 2 + 14.146} 0 ${width / 2 + 26.385} 8.15921 ${
            width / 2 + 32.27
          } 20.0282C${width / 2 + 35.44} 26.4221 ${width / 2 + 41.179} 32 ${
            width / 2 + 48.316
          } 32H${width}V${HEIGHT}H0V38C0 34.6863 2.68629 32 6 32H${
            width / 2 - 48.316
          }C${width / 2 - 41.179} 32 ${width / 2 - 35.44} 26.4221 ${
            width / 2 - 32.27
          } 20.0282C${width / 2 - 26.385} 8.15921 ${width / 2 - 14.146} 0 ${
            width / 2
          } 0Z`}
          fill="#0F2624"
          fillOpacity={0.9}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    // importante: que no “corte” el botón elevado
    overflow: "visible",
  },
  svg: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
