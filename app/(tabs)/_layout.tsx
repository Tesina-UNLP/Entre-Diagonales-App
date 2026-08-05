import HomeIcon from "@/components/icons/home";
import ProfileIcon from "@/components/icons/profile";
import RankingIcon from "@/components/icons/ranking";
import RouteIcon from "@/components/icons/route";
import { CustomTabBar } from "@/components/tab-bar/custom-tab-bar";
import { CustomTabBarButton } from "@/components/tab-bar/custom-tab-bar-button";
import { HapticTab } from "@/components/tab-bar/haptic-tab";
import {
  TAB_BAR_BASE_HEIGHT,
  TAB_BAR_BOTTOM_PADDING,
  TAB_BAR_ITEM_TRANSLATE_Y,
} from "@/components/tab-bar/tab-bar-metrics";
import Colors from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs, usePathname } from "expo-router";
import { Platform, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const themeName = colorScheme === "dark" ? "dark" : "light";
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const hideTabs =
    (pathname.startsWith("/tours/") && pathname !== "/tours") ||
    (pathname.startsWith("/profile/") && pathname !== "/profile");

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[themeName].tint,
        tabBarInactiveTintColor: Colors[themeName].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: CustomTabBar,
        tabBarStyle: hideTabs
          ? { display: "none" }
          : {
              position: "absolute",
              left: 0,
              right: 0,

              bottom: 0,

              backgroundColor: "transparent",
              borderColor: "transparent",
              elevation: 0,
              shadowOpacity: 0,

              paddingTop: Platform.OS === "ios" ? 2 : 5,

              height: TAB_BAR_BASE_HEIGHT + insets.bottom,
              paddingBottom: TAB_BAR_BOTTOM_PADDING,
            },
        tabBarItemStyle: {
          transform: [{ translateY: TAB_BAR_ITEM_TRANSLATE_Y }],
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <HomeIcon color={String(color)} />,
          tabBarLabel: ({ focused, color }) =>
            focused ? <Text style={{ color }}>Inicio</Text> : undefined,
        }}
      />
      <Tabs.Screen
        name="tours"
        options={{
          tabBarLabel: ({ focused, color }) =>
            focused ? <Text style={{ color }}>Rutas</Text> : undefined,
          tabBarIcon: ({ color }) => <RouteIcon color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => null,
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} key={"scanner"} />
          ),
        }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          tabBarLabel: ({ focused, color }) =>
            focused ? <Text style={{ color }}>Ranking</Text> : undefined,
          tabBarIcon: ({ color }) => <RankingIcon color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: ({ focused, color }) =>
            focused ? <Text style={{ color }}>Perfil</Text> : undefined,
          tabBarIcon: ({ color }) => <ProfileIcon color={String(color)} />,
        }}
      />
    </Tabs>
  );
}
