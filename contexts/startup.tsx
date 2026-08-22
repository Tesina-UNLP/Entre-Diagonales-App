import { useAuth } from "@/hooks/use-auth";
import * as SplashScreen from "expo-splash-screen";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const StartupReadyContext = createContext(false);

export function StartupProvider({ children }: { children: React.ReactNode }) {
  const { isLoading: isAuthLoading } = useAuth();
  const [isStartupReady, setIsStartupReady] = useState(false);

  useEffect(() => {
    if (isAuthLoading || isStartupReady) return;

    let isMounted = true;

    const finishStartup = async () => {
      await SplashScreen.hideAsync();
      if (isMounted) setIsStartupReady(true);
    };

    void finishStartup();

    return () => {
      isMounted = false;
    };
  }, [isAuthLoading, isStartupReady]);

  return (
    <StartupReadyContext.Provider value={isStartupReady}>
      {children}
    </StartupReadyContext.Provider>
  );
}

export function useStartupReady() {
  return useContext(StartupReadyContext);
}
