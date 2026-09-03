import Header from "@/components/header";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/libs/api";
import { AccountDeletionPayload } from "@/types";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Ionicons } from "@expo/vector-icons";
import * as AppleAuthentication from "expo-apple-authentication";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { openBrowserAsync } from "expo-web-browser";
import Toast from "react-native-toast-message";

const webFrontend =
  process.env.EXPO_PUBLIC_WEB_FRONTEND || "https://entrediagonales.io";
const deletionInfoUrl = `${webFrontend}/eliminar-cuenta`;

export default function DeleteAccount() {
  const { user, clearDeletedAccountSession } = useAuth();
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authMethod = user?.account_deletion_auth_method ?? "password";

  const getReauthenticationPayload =
    async (): Promise<AccountDeletionPayload> => {
      if (authMethod === "password") {
        return { method: "password", password };
      }

      if (authMethod === "google") {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();
        if (response.type !== "success") {
          throw new Error("Cancelaste la verificación con Google.");
        }
        const tokens = await GoogleSignin.getTokens();
        if (!tokens.idToken) {
          throw new Error("Google no devolvió una credencial válida.");
        }
        return { method: "google", id_token: tokens.idToken };
      }

      if (Platform.OS !== "ios") {
        throw new Error(
          "La verificación con Apple sólo está disponible en iOS.",
        );
      }
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });
      if (!credential.identityToken || !credential.authorizationCode) {
        throw new Error("Apple no devolvió las credenciales necesarias.");
      }
      return {
        method: "apple",
        identity_token: credential.identityToken,
        authorization_code: credential.authorizationCode,
        apple_user: credential.user,
      };
    };

  const submitDeletion = async () => {
    if (!user?.access || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const payload = await getReauthenticationPayload();
      const result = await api.requestAccountDeletion(user.access, payload);
      await clearDeletedAccountSession();
      router.replace("/(public)/welcome");
      Toast.show({
        type: "success",
        text1: "Solicitud confirmada",
        text2:
          result.apple_revocation_status === "manual_required"
            ? "El borrado continúa. Revisá en la web cómo revocar Apple manualmente."
            : "Tu cuenta se eliminará en el próximo proceso diario.",
        visibilityTime: 6000,
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "No pudimos eliminar tu cuenta",
        text2: error?.message || "Verificá tu identidad e intentá nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeletion = () => {
    if (!accepted) {
      Toast.show({
        type: "error",
        text1: "Confirmación requerida",
        text2: "Marcá que entendés que la eliminación es irreversible.",
      });
      return;
    }
    if (authMethod === "password" && !password) {
      Toast.show({
        type: "error",
        text1: "Ingresá tu contraseña",
        text2: "La necesitamos para verificar que la cuenta es tuya.",
      });
      return;
    }

    Alert.alert(
      "¿Eliminar tu cuenta?",
      "Perderás tu perfil, recorridos, trivias, secretos, logros, monedas, gemas y posición en el ranking. Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar cuenta",
          style: "destructive",
          onPress: () => void submitDeletion(),
        },
      ],
    );
  };

  return (
    <ThemedBackground style={styles.container} safeArea={false}>
      <Header
        title="Eliminar cuenta"
        description="Revisá qué sucede antes de continuar"
        onBack={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.warningBlock}>
          <Ionicons name="warning-outline" size={28} color={TOKENS.warning} />
          <View style={styles.warningText}>
            <ThemedText type="subtitle">
              La eliminación es irreversible
            </ThemedText>
            <ThemedText type="muted">
              Tu acceso se bloqueará al confirmar. El borrado definitivo se
              ejecutará en el próximo proceso diario y, ante una incidencia,
              dentro de un máximo de 30 días.
            </ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold">Se eliminarán</ThemedText>
          {[
            "Tu cuenta, perfil y preferencias",
            "Tu progreso, recompensas y ranking",
            "Tus recorridos, trivias, secretos, logros y notificaciones",
          ].map((item) => (
            <View key={item} style={styles.listItem}>
              <Ionicons
                name="close-circle-outline"
                size={20}
                color={TOKENS.error}
              />
              <ThemedText type="muted" style={styles.listText}>
                {item}
              </ThemedText>
            </View>
          ))}
          <ThemedText type="muted">
            Conservaremos sólo registros técnicos no identificables durante 90
            días cuando sean necesarios para acreditar el proceso.
          </ThemedText>
        </View>

        <TouchableOpacity
          accessibilityRole="link"
          onPress={() => openBrowserAsync(deletionInfoUrl)}
          style={styles.infoLink}
        >
          <ThemedText type="link">
            Leer cómo funciona la eliminación de cuenta
          </ThemedText>
          <Ionicons
            name="open-outline"
            size={18}
            color={TOKENS.tabBarInactive}
          />
        </TouchableOpacity>

        {authMethod === "password" && (
          <View style={styles.fieldGroup}>
            <ThemedText type="defaultSemiBold">
              Verificá tu identidad
            </ThemedText>
            <ThemedText type="muted">
              Ingresá tu contraseña actual para continuar.
            </ThemedText>
            <TextInput
              accessibilityLabel="Contraseña actual"
              autoCapitalize="none"
              autoComplete="current-password"
              editable={!isSubmitting}
              onChangeText={setPassword}
              placeholder="Contraseña actual"
              placeholderTextColor={TOKENS.muted}
              secureTextEntry
              style={styles.input}
              value={password}
            />
          </View>
        )}

        {authMethod !== "password" && (
          <View style={styles.fieldGroup}>
            <ThemedText type="defaultSemiBold">
              Verificá tu identidad
            </ThemedText>
            <ThemedText type="muted">
              Al continuar te pediremos iniciar sesión nuevamente con{" "}
              {authMethod === "apple" ? "Apple" : "Google"}.
            </ThemedText>
          </View>
        )}

        <TouchableOpacity
          accessibilityRole="checkbox"
          accessibilityState={{ checked: accepted, disabled: isSubmitting }}
          disabled={isSubmitting}
          onPress={() => setAccepted((current) => !current)}
          style={styles.confirmationRow}
        >
          <Ionicons
            name={accepted ? "checkbox" : "square-outline"}
            size={24}
            color={accepted ? TOKENS.accent : TOKENS.muted}
          />
          <ThemedText style={styles.confirmationText}>
            Entiendo que esta acción es irreversible y que no podré recuperar mi
            progreso.
          </ThemedText>
        </TouchableOpacity>

        <ThemedButton
          variant="danger"
          loading={isSubmitting}
          disabled={!accepted || (authMethod === "password" && !password)}
          onPress={confirmDeletion}
        >
          {isSubmitting
            ? "Verificando identidad..."
            : authMethod === "password"
              ? "Verificar y eliminar cuenta"
              : `Continuar con ${authMethod === "apple" ? "Apple" : "Google"}`}
        </ThemedButton>
        <ThemedText type="muted" style={styles.finalNote}>
          Recibirás un email cuando el borrado definitivo haya terminado. Si
          volvés a registrarte, empezarás con una cuenta nueva.
        </ThemedText>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingInline: 0,
    paddingTop: 0,
  },
  content: {
    gap: 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  warningBlock: {
    alignItems: "flex-start",
    backgroundColor: "rgba(230, 154, 63, 0.10)",
    borderRadius: 16,
    flexDirection: "row",
    gap: 14,
    padding: 18,
  },
  warningText: {
    flex: 1,
    gap: 6,
  },
  section: {
    gap: 12,
  },
  listItem: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 10,
  },
  listText: {
    flex: 1,
  },
  infoLink: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 8,
  },
  fieldGroup: {
    gap: 8,
  },
  input: {
    borderColor: TOKENS.tabBarInactive,
    borderRadius: 12,
    borderWidth: 1,
    color: TOKENS.text,
    fontFamily: "ClashDisplay",
    fontSize: 16,
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  confirmationRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
  },
  confirmationText: {
    flex: 1,
  },
  finalNote: {
    textAlign: "center",
  },
  bottomSpacer: {
    height: 80,
  },
});
