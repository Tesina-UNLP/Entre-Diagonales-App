// import {
//   GoogleSignin
// } from "@react-native-google-signin/google-signin";
import { api } from "@/libs/api";
import { isTokenExpired } from "@/libs/jwt";
import { getSession, removeSession, storeSession } from "@/libs/store-session";
import React, { createContext, useEffect, useState } from "react";
export type AppUser = {
  id: string;
  email: string;
  access: string;
  refresh: string;
  on_boarding_completed_at?: boolean;
  experience: number;
  gems: number;
  coins: number;
  character?: {
    id: number;
    name: string;
    description: string;
    image_url: string;
  };
  level?: {
    id: number;
    name: string;
    description: string;
    xp_required: number;
    image_url: string;
  };
  display_name: string;
  username: string;
}

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
  loginWithGoogle: () => Promise<void>;
  completeOnboarding: (args: { characterId: number }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  login: async () => { return null; },
  register: async () => { },
  logout: async () => { },
  loginWithGoogle: async () => { },
  completeOnboarding: async ({ characterId }: { characterId: number }) => { },
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initProfile = async (session: { access: string, refresh: string }): Promise<AppUser> => {
    const profileData = await api.getProfile(session.access);

    const updatedUser = {
      ...profileData,
      access: session.access,
      refresh: session.refresh,
    };

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
        return user;
      } else {
        await removeSession();
        setUser(null);
        return;
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  const login = async (email: string, password: string): Promise<AppUser | null> => {
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
      await removeSession();
    } catch (error) {
      console.error("Error al cerrar sesiÃ³n:", error);
      // Incluso si hay error, limpiamos el estado local
      setUser(null);
    }
  };

  const loginWithGoogle = async () => {
    // future
  };

  const completeOnboarding = async ({ characterId }: { characterId: number }) => {
    if (user) {

      const onboardingData = await api.completeOnboarding(user?.access, characterId, "");

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
    completeOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
