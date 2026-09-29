import { TOKENS } from "@/constants/colors";
import { Stack } from "expo-router";

export const unstable_settings = {
  anchor: "index",
};

export default function ProfileLayout() {
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
