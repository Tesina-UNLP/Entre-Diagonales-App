import { TOKENS } from "@/constants/colors";
import { Stack } from "expo-router";

export default function ToursLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: TOKENS.background },
      }}
    />
  );
}
