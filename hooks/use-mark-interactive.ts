import { useStartupReady } from "@/contexts/startup";
import { useObserve } from "expo-observe";
import { useEffect } from "react";

export function useMarkInteractive(isScreenReady = true) {
  const isStartupReady = useStartupReady();
  const { markInteractive } = useObserve();

  useEffect(() => {
    if (isStartupReady && isScreenReady) {
      markInteractive();
    }
  }, [isScreenReady, isStartupReady, markInteractive]);
}
