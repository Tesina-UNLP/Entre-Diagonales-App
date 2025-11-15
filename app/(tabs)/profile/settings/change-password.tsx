import Header from "@/components/header";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/libs/api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

// Esquema de validación con Zod
// Define las reglas de validación para el formulario de cambio de contraseña
const changePasswordSchema = z
  .object({
    // Contraseña actual: debe tener al menos 1 carácter
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    // Nueva contraseña: debe tener al menos 8 caracteres
    newPassword: z
      .string()
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
    // Confirmar nueva contraseña: debe tener al menos 8 caracteres
    confirmPassword: z
      .string()
      .min(8, "La confirmación de contraseña debe tener al menos 8 caracteres"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    // Validación personalizada: las contraseñas deben coincidir
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"], // El error se mostrará en el campo confirmPassword
  });

// Tipo TypeScript inferido del esquema de Zod
type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const ChangePassword = () => {
  const { user } = useAuth();
  // Estados para mostrar/ocultar las contraseñas
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Configuración de react-hook-form con el resolver de Zod
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset, // Función para resetear el formulario después de un cambio exitoso
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema as any),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Función que se ejecuta cuando el formulario es válido
  const onSubmit = async (data: ChangePasswordFormData) => {
    // Verificamos que el usuario tenga un token de acceso
    if (!user?.access) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo obtener la información de autenticación",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      // Llamamos a la API para cambiar la contraseña
      await api.changePassword(
        user.access,
        data.currentPassword,
        data.newPassword,
        data.confirmPassword,
      );

      // Mostramos mensaje de éxito
      Toast.show({
        type: "success",
        text1: "Contraseña actualizada",
        text2: "Tu contraseña ha sido cambiada exitosamente",
      });

      // Reseteamos el formulario
      reset();
      // Regresamos a la pantalla anterior
      router.back();
    } catch (error: any) {
      // Manejo de errores
      const message =
        error?.message || "Error al cambiar la contraseña. Intenta nuevamente.";
      Toast.show({
        type: "error",
        text1: "Error al cambiar la contraseña",
        text2: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedBackground style={styles.container} safeArea={false}>
      <Header
        title={"Cambiar contraseña"}
        description={"Actualiza tu contraseña"}
        onBack={() => router.back()}
      />

      <View style={styles.content}>
        <View style={styles.formContainer}>
          {/* Campo: Contraseña actual */}
          <View style={styles.inputWrapper}>
            <ThemedText type="muted">Contraseña actual</ThemedText>
            <Controller
              control={control}
              name="currentPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      errors.currentPassword && styles.inputError,
                    ]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Ingresa tu contraseña actual"
                    placeholderTextColor={TOKENS.muted}
                    secureTextEntry={!showCurrentPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={styles.eyeButton}
                  >
                    <Ionicons
                      name={
                        showCurrentPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={20}
                      color={TOKENS.muted}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {/* Mostrar error de validación si existe */}
            {errors.currentPassword && (
              <ThemedText style={styles.errorText}>
                {errors.currentPassword.message}
              </ThemedText>
            )}
          </View>

          {/* Campo: Nueva contraseña */}
          <View style={styles.inputWrapper}>
            <ThemedText type="muted">Nueva contraseña</ThemedText>
            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      errors.newPassword && styles.inputError,
                    ]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Ingresa tu nueva contraseña"
                    placeholderTextColor={TOKENS.muted}
                    secureTextEntry={!showNewPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    style={styles.eyeButton}
                  >
                    <Ionicons
                      name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={TOKENS.muted}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {/* Mostrar error de validación si existe */}
            {errors.newPassword && (
              <ThemedText style={styles.errorText}>
                {errors.newPassword.message}
              </ThemedText>
            )}
          </View>

          {/* Campo: Confirmar nueva contraseña */}
          <View style={styles.inputWrapper}>
            <ThemedText type="muted">Confirmar nueva contraseña</ThemedText>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      errors.confirmPassword && styles.inputError,
                    ]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Confirma tu nueva contraseña"
                    placeholderTextColor={TOKENS.muted}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeButton}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={20}
                      color={TOKENS.muted}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {/* Mostrar error de validación si existe */}
            {errors.confirmPassword && (
              <ThemedText style={styles.errorText}>
                {errors.confirmPassword.message}
              </ThemedText>
            )}
          </View>

          {/* Botón para guardar */}
          <View style={styles.buttonsContainer}>
            <ThemedButton
              variant="secondary"
              size="small"
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              style={styles.saveButton}
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </ThemedButton>
          </View>
        </View>
      </View>
    </ThemedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    marginTop: 0,
    paddingInline: 0,
    paddingHorizontal: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 30,
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    gap: 24,
    marginTop: 20,
    alignItems: "flex-start",
  },
  inputWrapper: {
    width: "100%",
    gap: 4,
  },
  passwordContainer: {
    width: "100%",
    position: "relative",
  },
  input: {
    fontSize: 16,
    fontWeight: "600",
    color: TOKENS.text,
    borderBottomWidth: 1,
    borderBottomColor: TOKENS.text,
    paddingVertical: 8,
    paddingHorizontal: 0,
    paddingRight: 40,
  },
  inputError: {
    borderBottomColor: TOKENS.error,
  },
  eyeButton: {
    position: "absolute",
    right: 0,
    top: 3,
    padding: 4,
  },
  errorText: {
    color: TOKENS.error,
    fontSize: 12,
    marginTop: 4,
  },
  saveButton: {
    marginTop: 8,
  },
  buttonsContainer: {
    width: "100%",
    gap: 10,
    flexDirection: "column",
    alignItems: "center",
  },
});

export default ChangePassword;
