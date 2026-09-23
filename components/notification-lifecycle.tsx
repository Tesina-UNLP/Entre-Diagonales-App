import { useAuth } from "@/hooks/use-auth";
import { api } from "@/libs/api";
import { getExpoPushToken } from "@/libs/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useRef } from "react";
import { AppState } from "react-native";

const ACTIVITY_SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000;

type NotificationData = {
  type?: unknown;
  tour_id?: unknown;
};

const openNotificationDestination = (data: NotificationData) => {
  const type = typeof data.type === "string" ? data.type : "";
  const tourId = Number(data.tour_id);

  if (
    (type === "tour_resume" || type === "tour_activated") &&
    Number.isInteger(tourId) &&
    tourId > 0
  ) {
    router.navigate({
      pathname: "/(tabs)/tours/[id]",
      params: { id: String(tourId) },
    });
    return;
  }

  if (type === "comeback") {
    router.navigate({ pathname: "/(tabs)/tours" });
  }
};

export function NotificationLifecycle() {
  const { user, isLoading } = useAuth();
  const handledResponseId = useRef<string | null>(null);
  const pendingResponse = useRef<Notifications.NotificationResponse | null>(
    null,
  );
  const tokenSync = useRef<{
    access: string;
    promise: Promise<void>;
  } | null>(null);

  const handleResponse = useCallback(
    (response: Notifications.NotificationResponse) => {
      if (!user || isLoading) {
        pendingResponse.current = response;
        return;
      }

      const responseId = response.notification.request.identifier;
      if (handledResponseId.current === responseId) return;
      handledResponseId.current = responseId;
      pendingResponse.current = null;
      openNotificationDestination(
        response.notification.request.content.data as NotificationData,
      );
      Notifications.clearLastNotificationResponse();
    },
    [isLoading, user],
  );

  const syncActivity = useCallback(async () => {
    if (!user?.access) return;

    const storageKey = `notification-activity-sync:${user.id}`;
    const lastSyncValue = await AsyncStorage.getItem(storageKey);
    const lastSync = Number(lastSyncValue || 0);
    if (
      Number.isFinite(lastSync) &&
      Date.now() - lastSync < ACTIVITY_SYNC_INTERVAL_MS
    ) {
      return;
    }

    await api.updateActivity(user.access);
    await AsyncStorage.setItem(storageKey, String(Date.now()));
  }, [user]);

  const syncNotificationToken = useCallback(async () => {
    if (!user?.access || !user.notifications) {
      return;
    }

    // El arranque y AppState pueden dispararse juntos. Compartir la promesa
    // evita enviar dos veces el mismo token para un único ingreso a la app.
    if (tokenSync.current?.access === user.access) {
      return tokenSync.current.promise;
    }

    const syncPromise = (async () => {
      const expoToken = await getExpoPushToken();
      if (expoToken) {
        await api.updateNotificationToken(user.access, expoToken);
      }
    })();

    tokenSync.current = { access: user.access, promise: syncPromise };
    try {
      await syncPromise;
    } finally {
      if (tokenSync.current?.promise === syncPromise) {
        tokenSync.current = null;
      }
    }
  }, [user]);

  const syncOnAppEntry = useCallback(async () => {
    await Promise.all([
      syncActivity().catch((error) =>
        console.warn("Could not synchronize app activity", error),
      ),
      syncNotificationToken().catch((error) =>
        console.warn("Could not synchronize notification token", error),
      ),
    ]);
  }, [syncActivity, syncNotificationToken]);

  useEffect(() => {
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(handleResponse);

    return () => responseSubscription.remove();
  }, [handleResponse]);

  useEffect(() => {
    if (!user || isLoading) return;

    if (pendingResponse.current) {
      handleResponse(pendingResponse.current);
    } else {
      Notifications.getLastNotificationResponseAsync()
        .then((response) => {
          if (response) handleResponse(response);
        })
        .catch((error) =>
          console.warn("Could not read the last notification response", error),
        );
    }

    syncOnAppEntry();
  }, [handleResponse, isLoading, syncOnAppEntry, user]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        syncOnAppEntry();
      }
    });
    return () => subscription.remove();
  }, [syncOnAppEntry]);

  return null;
}
