import Header from "@/components/header";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/libs/api";
import { useLocalizedAlert } from "@/hooks/use-localized-alert";
import { useLanguage } from "@/hooks/use-language";
import { BlockedRankingUserApiResponse } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  View,
} from "react-native";

export default function BlockedUsersScreen() {
  const showAlert = useLocalizedAlert();
  const { locale } = useLanguage();
  const { user } = useAuth();
  const [blockedUsers, setBlockedUsers] = useState<
    BlockedRankingUserApiResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadBlockedUsers = useCallback(async () => {
    if (!user?.access) return;
    try {
      setLoading(true);
      setBlockedUsers(await api.getBlockedRankingUsers(user.access));
    } catch (error) {
      showAlert(
        "No pudimos cargar los usuarios bloqueados",
        error instanceof Error ? error.message : "Intentá nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  }, [showAlert, user?.access]);

  useFocusEffect(
    useCallback(() => {
      void loadBlockedUsers();
    }, [loadBlockedUsers]),
  );

  const unblock = async (blockedUser: BlockedRankingUserApiResponse) => {
    if (!user?.access) return;
    try {
      setUpdatingId(blockedUser.id);
      await api.unblockRankingUser(user.access, blockedUser.id);
      setBlockedUsers((current) =>
        current.filter((item) => item.id !== blockedUser.id),
      );
    } catch (error) {
      showAlert(
        "No pudimos desbloquear al usuario",
        error instanceof Error ? error.message : "Intentá nuevamente.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <ThemedBackground style={styles.container} safeArea={false}>
      <Header
        title="Usuarios bloqueados"
        description="Administrá los nombres que ocultaste"
        onBack={() => router.back()}
      />
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={TOKENS.primary} size="large" />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={
            blockedUsers.length ? styles.list : styles.emptyList
          }
          data={blockedUsers}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="eye-outline" size={42} color={TOKENS.muted} />
              <ThemedText type="subtitle">No bloqueaste usuarios</ThemedText>
              <ThemedText type="muted" style={styles.emptyText}>
                Podés ocultar nombres desde las opciones de cada persona en el
                ranking.
              </ThemedText>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.character ? (
                <Image source={{ uri: item.character }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarFallback]}>
                  <Ionicons name="person" size={22} color={TOKENS.muted} />
                </View>
              )}
              <View style={styles.info}>
                <ThemedText type="subtitle">
                  {item.display_name || item.username}
                </ThemedText>
                <ThemedText type="muted">
                  Bloqueado el{" "}
                  {new Date(item.blocked_at).toLocaleDateString(locale)}
                </ThemedText>
              </View>
              <ThemedButton
                size="small"
                variant="outline"
                loading={updatingId === item.id}
                disabled={updatingId !== null}
                onPress={() => void unblock(item)}
                style={styles.unblockButton}
              >
                Desbloquear
              </ThemedButton>
            </View>
          )}
        />
      )}
    </ThemedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    paddingHorizontal: 0,
    paddingInline: 0,
    paddingTop: 0,
  },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { gap: 12, padding: 20, paddingBottom: 40 },
  emptyList: { flexGrow: 1, padding: 24 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  emptyText: { maxWidth: 300, textAlign: "center" },
  card: {
    alignItems: "center",
    backgroundColor: TOKENS.cardBackground,
    borderRadius: 16,
    flexDirection: "row",
    gap: 12,
    padding: 14,
  },
  avatar: { borderRadius: 24, height: 48, width: 48 },
  avatarFallback: { alignItems: "center", justifyContent: "center" },
  info: { flex: 1, gap: 2 },
  unblockButton: { width: 112 },
});
