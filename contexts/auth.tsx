// import {
//   GoogleSignin
// } from "@react-native-google-signin/google-signin";
import { getSession, removeSession, storeSession } from "@/libs/store-session";
import React, { createContext, useEffect, useState } from "react";

interface AppUser {
  id: string;
  email: string;
  name?: string;
  photo?: string;
  idToken?: string;
  hasCompletedOnboarding?: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>;
  logout: () => void;
  loginWithGoogle: () => Promise<void>;
  completeOnboarding: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  loginWithGoogle: async () => {},
  completeOnboarding: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Configurar Google Sign-in
    // GoogleSignin.configure({
    //   webClientId:
    //     "550141460093-e8cakfe22t1kr9b56ca7ue5g91pnptto.apps.googleusercontent.com",
    //   offlineAccess: true,
    //   hostedDomain: "",
    //   forceCodeForRefreshToken: true,
    //   profileImageSize: 150,
    // });
    const checkAuthState = async () => {
      try {
        setIsLoading(true);
        const session = await getSession();
        if (session) {
          setUser(session);
        }

        // const hasPreviousSignIn = GoogleSignin.hasPreviousSignIn();
        // if (hasPreviousSignIn) {
        // const userInfo = GoogleSignin.getCurrentUser();
        // if (userInfo) {
        //   const userData: AppUser = {
        //     id: userInfo.user.id,
        //     email: userInfo.user.email,
        //     name: userInfo.user.name || undefined,
        //     photo: userInfo.user.photo || undefined,
        //     idToken: userInfo.idToken || undefined,
        //     hasCompletedOnboarding: true, // Usuario que ya tenÃ­a sesiÃ³n activa
        //   };
        //   setUser(userData);
        // }
        // }

        // timeout de 2 segundos para simular carga
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        console.error("Error checking auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // SimulaciÃ³n de login - aquÃ­ harÃ­as la llamada real a tu API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email === "demo@example.com" && password === "password") {
        const userData: AppUser = {
          id: "1",
          email: email,
          name: "Usuario Demo",
          hasCompletedOnboarding: true, // Usuario demo ha completado onboarding
        };
        setUser(userData);

        await storeSession(userData);
      } else {
        throw new Error("Credenciales invÃ¡lidas");
      }
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
        throw new Error("Las contraseÃ±as no coinciden");
      }

      // SimulaciÃ³n de registro - aquÃ­ harÃ­as la llamada real a tu API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userData: AppUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: email,
        name: "Usuario Nuevo",
        hasCompletedOnboarding: false, // Nuevo usuario necesita onboarding
      };
      setUser(userData);
      await storeSession(userData);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Cerrar sesiÃ³n de Google si hay una sesiÃ³n activa
      // const hasPreviousSignIn = GoogleSignin.hasPreviousSignIn();
      // if (hasPreviousSignIn) {
      //   await GoogleSignin.revokeAccess();
      //   await GoogleSignin.signOut();
      // }
      setUser(null);
      await removeSession();
    } catch (error) {
      console.error("Error al cerrar sesiÃ³n:", error);
      // Incluso si hay error, limpiamos el estado local
      setUser(null);
    }
  };

  const loginWithGoogle = async () => {
    // try {
    //   setIsLoading(true);
    //   // Verificar si Google Play Services estÃ¡n disponibles (solo Android)
    //   await GoogleSignin.hasPlayServices();
    //   // Iniciar sesiÃ³n con Google
    //   const response = await GoogleSignin.signIn();
    //   if (response.type === "success") {
    //     const userInfo = response.data;
    //     // Obtener los tokens
    //     const tokens = await GoogleSignin.getTokens();
    //     const userData: AppUser = {
    //       id: userInfo.user.id,
    //       email: userInfo.user.email,
    //       name: userInfo.user.name || undefined,
    //       photo: userInfo.user.photo || undefined,
    //       idToken: tokens.idToken,
    //       hasCompletedOnboarding: false, // Google signin tambiÃ©n necesita onboarding
    //     };
    //     setUser(userData);
    //     await storeSession(userData);
    //     // AquÃ­ puedes enviar el idToken a tu backend para validaciÃ³n
    //     console.log("Google ID Token:", tokens.idToken);
    //   } else {
    //     // El usuario cancelÃ³ el proceso de login
    //     throw new Error("Login cancelado por el usuario");
    //   }
    // } catch (error: any) {
    //   console.error("Error en login con Google:", error);
    //   if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //     throw new Error("Login cancelado por el usuario");
    //   } else if (error.code === statusCodes.IN_PROGRESS) {
    //     throw new Error("Login en progreso");
    //   } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    //     throw new Error("Google Play Services no disponible");
    //   } else {
    //     throw new Error(
    //       "Error al iniciar sesiÃ³n con Google: " + error.message
    //     );
    //   }
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const completeOnboarding = () => {
    if (user) {
      setUser({
        ...user,
        hasCompletedOnboarding: true,
      });

      // ActualizaciÃ³n de sesiÃ³n en almacenamiento seguro
      storeSession({
        ...user,
        hasCompletedOnboarding: true,
      });
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
