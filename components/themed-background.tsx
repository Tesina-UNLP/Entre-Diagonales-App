// components/ThemedBackground.tsx
import { TOKENS } from "@/constants/colors";
import { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

interface ThemedBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  scrollable?: boolean;
  onRefresh?: () => void | Promise<void>;
  safeArea?: boolean;
}

export function ThemedBackground({
  children,
  style,
  scrollable = false,
  onRefresh,
  safeArea = true,
}: ThemedBackgroundProps) {
  const [refreshing, setRefreshing] = useState(false);
  const ContentWrapper = scrollable ? ScrollView : View;
  const SafeArea = safeArea ? SafeAreaView : View;

  const handleRefresh = async () => {
    if (!onRefresh) return;

    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeArea style={[styles.container]}>
      {/* Base color */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "#004643" }]} />

      {/* Radial bottom-left */}
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient
            id="gradBL"
            cx="-50%"
            cy="130%"
            r="60%"
            fx="-90%"
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
      <ContentWrapper
        style={[styles.content, style]}
        {...(scrollable && {
          showsVerticalScrollIndicator: false,
          refreshControl: onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={TOKENS.primary}
              progressBackgroundColor={TOKENS.primary}
              colors={[TOKENS.navActive]}
            />
          ) : undefined,
        })}
      >
        {children}
      </ContentWrapper>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 12,
  },
  content: { flex: 1, paddingInline: 24, paddingTop: 30 },
});
