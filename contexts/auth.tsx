import { api } from "@/libs/api";
import { isTokenExpired } from "@/libs/jwt";
import { getSession, removeSession, storeSession } from "@/libs/store-session";
import { AppUser } from "@/types";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import React, { createContext, useEffect, useState } from "react";
import Toast from "react-native-toast-message";

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AppUser | null>;
  register: (
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>;
  logout: () => void;
  checkAuthState?: () => Promise<void>;
  loginWithGoogle: () => Promise<AppUser | null>;
  completeOnboarding: (args: {
    characterId: number;
    notificationToken?: string;
  }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  login: async () => {
    return null;
  },
  register: async () => {},
  logout: async () => {},
  loginWithGoogle: async () => {
    return null;
  },
  checkAuthState: async () => {},
  completeOnboarding: async ({
    characterId,
    notificationToken,
  }: {
    characterId: number;
    notificationToken?: string;
  }) => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Guardamos el nivel anterior para detectar cambios
  const previousLevelIdRef = React.useRef<number | undefined>(undefined);

  const initProfile = async (session: {
    access: string;
    refresh: string;
  }): Promise<AppUser> => {
    const profileData = await api.getProfile(session.access);

    const updatedUser = {
      ...profileData,
      access: session.access,
      refresh: session.refresh,
    };

    // Detectamos si el usuario subió de nivel comparando el nivel anterior con el nuevo
    const previousLevelId = previousLevelIdRef.current;
    const newLevelId = updatedUser.level?.id;

    // Solo mostramos el toast si:
    // 1. Ya teníamos un nivel anterior (no es la primera carga)
    // 2. El nuevo nivel es diferente al anterior
    // 3. El nuevo nivel existe
    if (
      previousLevelId !== undefined &&
      newLevelId !== undefined &&
      previousLevelId !== newLevelId
    ) {
      // Mostramos el toast de nivel up
      Toast.show({
        type: "levelUp",
        text1: updatedUser.level?.name || "Nuevo Nivel",
        props: {
          levelImage: updatedUser.level?.image_url,
        },
        visibilityTime: 4000, // El toast se muestra por 4 segundos
      });
    }

    // Actualizamos la referencia del nivel anterior
    previousLevelIdRef.current = newLevelId;

    setUser(updatedUser);
    await storeSession(updatedUser);

    return updatedUser;
  };

  const checkAuthState = async () => {
    try {
      setIsLoading(true);
      const session = await getSession();
      if (session?.access && !isTokenExpired(session.access)) {
        await initProfile(session);
      } else {
        await removeSession();
        setUser(null);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error al verificar",
        text2: "Por favor, intente nuevamente más tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID || "",
      offlineAccess: true,
      hostedDomain: "",
      forceCodeForRefreshToken: true,
      profileImageSize: 150,
    });
    checkAuthState();
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<AppUser | null> => {
    try {
      setIsLoading(true);

      const userData = await api.login(email, password);
      if (!userData) {
        return null;
      }

      const userProfile = await initProfile(userData);

      return userProfile;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    try {
      setIsLoading(true);

      if (password !== confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
      }

      const userData = await api.register(email, password, confirmPassword);

      initProfile(userData);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      // Reseteamos la referencia del nivel anterior al cerrar sesión
      previousLevelIdRef.current = undefined;
      await removeSession();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Incluso si hay error, limpiamos el estado local
      setUser(null);
      previousLevelIdRef.current = undefined;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);

      // Verificar si Google Play Services están disponibles (solo Android)
      await GoogleSignin.hasPlayServices();

      // Iniciar sesión con Google
      const response = await GoogleSignin.signIn();

      if (response.type === "success") {
        // Obtener los tokens
        const tokens = await GoogleSignin.getTokens();

        const token = tokens.idToken;

        const userData = await api.loginWithGoogle(token);

        const userProfile = await initProfile(userData);

        return userProfile;
      } else {
        // El usuario canceló el proceso de login
        throw new Error("Login cancelado por el usuario");
      }
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async ({
    characterId,
    notificationToken,
  }: {
    characterId: number;
    notificationToken?: string;
  }) => {
    if (user) {
      const onboardingData = await api.completeOnboarding(
        user?.access,
        characterId,
        notificationToken ?? "",
      );

      if (!onboardingData) {
        throw new Error("Onboarding completion failed");
      }

      initProfile({ access: user.access, refresh: user.refresh });
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    loginWithGoogle,
    checkAuthState,
    completeOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
