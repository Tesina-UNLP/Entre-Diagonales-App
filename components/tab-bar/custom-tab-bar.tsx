import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Svg, { ClipPath, Defs, Path } from "react-native-svg";

const { width } = Dimensions.get("window");

export function CustomTabBar() {
  return (
    <View style={styles.container}>
      {/* SVG Background con la forma personalizada */}
      <Svg
        width={width}
        height={100}
        style={styles.svg}
        viewBox={`0 0 ${width} 100`}
      >
        <Defs>
          <ClipPath id="tabBarClip">
            <Path
              d={`M${width / 2} 0C${width / 2 + 14.146} 0 ${width / 2 + 26.385} 8.15921 ${width / 2 + 32.27} 20.0282C${width / 2 + 35.44} 26.4221 ${width / 2 + 41.179} 32 ${width / 2 + 48.316} 32H${width}V100H0V38C0 34.6863 2.68629 32 6 32H${width / 2 - 48.316}C${width / 2 - 41.179} 32 ${width / 2 - 35.44} 26.4221 ${width / 2 - 32.27} 20.0282C${width / 2 - 26.385} 8.15921 ${width / 2 - 14.146} 0 ${width / 2} 0Z`}
            />
          </ClipPath>
        </Defs>

        {/* Fondo principal con blur effect */}
        <Path
          d={`M${width / 2} 0C${width / 2 + 14.146} 0 ${width / 2 + 26.385} 8.15921 ${width / 2 + 32.27} 20.0282C${width / 2 + 35.44} 26.4221 ${width / 2 + 41.179} 32 ${width / 2 + 48.316} 32H${width}V100H0V38C0 34.6863 2.68629 32 6 32H${width / 2 - 48.316}C${width / 2 - 41.179} 32 ${width / 2 - 35.44} 26.4221 ${width / 2 - 32.27} 20.0282C${width / 2 - 26.385} 8.15921 ${width / 2 - 14.146} 0 ${width / 2} 0Z`}
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
    height: 100,
  },
  svg: {
    position: "absolute",
    bottom: 0,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
