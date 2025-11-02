import { ExternalLink } from "@/components/external-link";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { api } from "@/libs/api";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Platform, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";

import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Ingresa un email válido"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    try {
      setIsSubmitting(true);
      await api.forgotPassword(data.email);
      Toast.show({
        type: "success",
        text1: "Solicitud de restablecimiento de contraseña enviada",
        text2: "Revisa tu correo para más instrucciones",
      });
    } catch (error: any) {
      const message = "Error al enviar solicitud";
      Toast.show({
        type: "error",
        text1: "Error al enviar solicitud",
        text2: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const back = () => {
    router.replace("/(public)/welcome");
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema as any),
    defaultValues: {
      email: "",
    },
  });

  return (
    <ThemedBackground style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => back()}>
          <MaterialIcons name="arrow-back" size={24} color={TOKENS.muted} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <ThemedText type="title">Olvidaste tu contraseña?</ThemedText>
        <View style={{ maxWidth: 300 }}>
          <ThemedText type="muted">
            Te enviaremos un enlace para restablecerla
          </ThemedText>
        </View>
      </View>
      <View style={styles.inputContainer}>
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
        <View style={styles.buttonContainer}>
          <ThemedButton
            variant="primary"
            onPress={handleSubmit(handleForgotPassword)}
            disabled={isSubmitting}
          >
            Enviar enlace
          </ThemedButton>
        </View>
      </View>

      <View style={styles.securityContainer}>
        <View style={styles.securityHeader}>
          <MaterialIcons name="security" size={24} color={TOKENS.warning} />
          <ThemedText type="subtitle">Seguridad</ThemedText>
        </View>
        <ThemedText type="muted">
          Por tu seguridad, no revelaremos si el correo esta registrado o no. Si
          no recibes el email en 5 minutos, revisa tu carpeta de spam.
        </ThemedText>
      </View>
      { /* @ts-ignore: Ignorar error de tipos del path generado por expo-router */}
      <ExternalLink href={process.env.EXPO_PUBLIC_WEB_FRONTEND + "/help"}>
        <ThemedText
          type="default"
        >
          Necesitas ayuda?
        </ThemedText>
      </ExternalLink>
    </ThemedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: Platform.OS === "ios" ? 40 : 24,
    gap: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  backButton: {
    padding: 12,
  },
  content: {
    width: "100%",
    flexDirection: "column",
    gap: 10,
  },
  inputContainer: {
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
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  securityContainer: {
    flexDirection: "column",
    padding: 20,
    backgroundColor: "rgba(146, 146, 146, 0.07)",
    width: "100%",
    borderRadius: 8,
    gap: 10,
  },
  securityHeader: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
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

export default ForgotPassword;
