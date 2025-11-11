import { ExternalLink } from "@/components/external-link";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { zodResolver } from "@hookform/resolvers/zod";
import { statusCodes } from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "El email es requerido")
      .email("Ingresa un email válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(50, "La contraseña es demasiado larga"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const SignUp = () => {
  const { register, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      await register(data.email, data.password, data.confirmPassword);
      Toast.show({
        type: "success",
        text1: "Registro exitoso",
        text2: "Bienvenido",
      });
      router.replace("/(onboarding)/presentation");
    } catch {
      const message = "Error al registrarse";
      Toast.show({
        type: "error",
        text1: "Error al registrarse",
        text2: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const profileUser = await loginWithGoogle();
      if (profileUser?.on_boarding_completed_at) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(onboarding)/presentation");
      }
    } catch (error: any) {
      let errorMessage = "";

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = "Inicio de sesión cancelado por el usuario";
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = "Login en progreso";
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = "Google Play Services no disponible";
      } else {
        errorMessage = error?.message || "Error desconocido";
      }

      Toast.show({
        type: "error",
        text1: "Error al iniciar sesión con Google",
        text2: errorMessage,
      });
    }
  };

  const back = () => {
    router.replace("/(public)/welcome");
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema as any),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <ThemedBackground style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={() => back()}>
            <MaterialIcons name="arrow-back" size={24} color={TOKENS.muted} />
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <ThemedText type="title">Crear una cuenta</ThemedText>
          <View style={styles.subtitleWrapper}>
            <ThemedText type="muted">
              Unete a la red mas inversiva que hay de exploracion en La Plata
            </ThemedText>
          </View>
        </View>
        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="email@email.com"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                placeholderTextColor={TOKENS.text}
              />
            )}
          />
          {errors.email && (
            <ThemedText style={styles.errorText}>
              {errors.email.message}
            </ThemedText>
          )}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Contraseña"
                  style={[
                    styles.passwordInput,
                    errors.password && styles.inputError,
                  ]}
                  placeholderTextColor={TOKENS.text}
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={TOKENS.muted}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.password && (
            <ThemedText style={styles.errorText}>
              {errors.password.message}
            </ThemedText>
          )}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Contraseña"
                  style={[
                    styles.passwordInput,
                    errors.password && styles.inputError,
                  ]}
                  placeholderTextColor={TOKENS.text}
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={TOKENS.muted}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
          {errors.confirmPassword && (
            <ThemedText style={styles.errorText}>
              {errors.confirmPassword.message}
            </ThemedText>
          )}
          <View style={styles.signUpButtonContainer}>
            <ThemedButton
              variant="primary"
              onPress={handleSubmit(handleSignUp)}
              disabled={isSubmitting}
            >
              Iniciar Sesion
            </ThemedButton>
          </View>
        </View>
        <View style={styles.termsContainer}>
          <ThemedText type="muted" style={styles.termsText}>
            Al continuar estaras de acuerdo con los{" "}
            {/* @ts-ignore: Ignorar error de tipos del path generado por expo-router */}
            <ExternalLink
              href={process.env.EXPO_PUBLIC_WEB_FRONTEND + "/terms"}
            >
              <ThemedText type="link">Terminos y Condiciones</ThemedText>
            </ExternalLink>{" "}
            y la{" "}
            {/* @ts-ignore: Ignorar error de tipos del path generado por expo-router */}
            <ExternalLink
              href={process.env.EXPO_PUBLIC_WEB_FRONTEND + "/privacy"}
            >
              <ThemedText type="link">Politica de Privacidad</ThemedText>.
            </ExternalLink>
          </ThemedText>
        </View>
        <View style={styles.divider} />

        <View style={styles.googleButtonContainer}>
          <ThemedButton variant="secondary" onPress={handleGoogleSignIn}>
            <View style={styles.googleButtonContent}>
              <FontAwesome name="google" size={24} color={TOKENS.primary} />
              <ThemedText
                type="defaultSemiBold"
                style={[styles.googleButtonText, { flexShrink: 1 }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Continuar con Google
              </ThemedText>
            </View>
          </ThemedButton>
        </View>
        <ThemedText type="muted">
          Ya tienes una cuenta?{" "}
          <ThemedText
            type="link"
            onPress={() => router.navigate("/(public)/sign-in")}
          >
            Inicia Sesion
          </ThemedText>
        </ThemedText>
      </KeyboardAvoidingView>
    </ThemedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 20,
  },
  keyboardView: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 20,
  },
  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  titleContainer: {
    width: "100%",
    flexDirection: "column",
    gap: 10,
  },
  subtitleWrapper: {
    maxWidth: 300,
  },
  formContainer: {
    flexDirection: "column",
    gap: 12,
    alignItems: "center",
    width: "100%",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: TOKENS.tabBarInactive,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: TOKENS.text,
  },
  passwordContainer: {
    width: "100%",
    position: "relative",
  },
  passwordInput: {
    width: "100%",
    height: 50,
    borderColor: TOKENS.tabBarInactive,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingRight: 50,
    color: TOKENS.text,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 13,
    padding: 4,
  },
  signUpButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  termsContainer: {
    flexDirection: "column",
    gap: 12,
    alignItems: "center",
    width: "100%",
  },
  termsText: {
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: TOKENS.tabBarInactive,
    marginBottom: 10,
    width: "100%",
  },
  googleButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
  },
  googleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  googleButtonText: {
    color: TOKENS.primary,
    fontSize: 16,
  },
  errorText: {
    color: TOKENS.error,
    alignSelf: "flex-start",
    marginTop: -8,
    marginBottom: 8,
  },
  inputError: {
    borderColor: TOKENS.error,
  },
});

export default SignUp;
