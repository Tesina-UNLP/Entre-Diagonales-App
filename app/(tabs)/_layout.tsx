import HomeIcon from "@/components/icons/home";
import ProfileIcon from "@/components/icons/profile";
import RankingIcon from "@/components/icons/ranking";
import RouteIcon from "@/components/icons/route";
import { CustomTabBar } from "@/components/tab-bar/custom-tab-bar";
import { CustomTabBarButton } from "@/components/tab-bar/custom-tab-bar-button";
import { HapticTab } from "@/components/tab-bar/haptic-tab";
import Colors from "@/constants/colors";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Tabs, useNavigation, usePathname } from "expo-router";
import { useEffect } from "react";
import { Platform, Text } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const nav = useNavigation();

  const hideTabs =
    (pathname.startsWith("/tours/") && pathname !== "/tours") ||
    (pathname.startsWith("/profile/") && pathname !== "/profile");

  useEffect(() => {
    nav.getParent()?.setOptions({
      tabBarStyle: hideTabs
        ? { display: "none" }
        : {
            position: "absolute",
            backgroundColor: "transparent",
            borderColor: "transparent",
            height: Platform.OS === "ios" ? 75 : 70,
            elevation: 0,
            shadowOpacity: 0,
            paddingTop: Platform.OS === "ios" ? 2 : 5,
          },
    });
  }, [hideTabs, nav]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: CustomTabBar,
        tabBarStyle: hideTabs
          ? { display: "none" }
          : {
              position: "absolute",
              backgroundColor: "transparent",
              borderColor: "transparent",
              height: Platform.OS === "ios" ? 75 : 70,
              elevation: 0,
              shadowOpacity: 0,
              paddingTop: Platform.OS === "ios" ? 2 : 5,
            },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
          tabBarLabel: ({ focused, color }) =>
            focused ? <Text style={{ color }}>Inicio</Text> : undefined,
        }}
      />
      <Tabs.Screen
        name="tours"
        options={{
          tabBarLabel: ({ focused, color }) =>
            focused ? <Text style={{ color }}>Rutas</Text> : undefined,
          tabBarIcon: ({ color }) => <RouteIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => null, // ocultamos el ícono default
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
          tabBarIcon: ({ color }) => <RankingIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: ({ focused, color }) =>
            focused ? <Text style={{ color }}>Perfil</Text> : undefined,
          tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
