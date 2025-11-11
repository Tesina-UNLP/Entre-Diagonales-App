import { HapticsContext } from "@/contexts/haptics";
import { useContext } from "react";
export const useHaptics = () => useContext(HapticsContext);
