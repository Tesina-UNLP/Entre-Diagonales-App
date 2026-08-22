import { useAuth } from "@/hooks/use-auth";
import { api } from "@/libs/api";
import {
  getExpoPushToken,
  hasNotificationPermissions,
} from "@/libs/notifications";
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

    let expoToken: string | undefined;
    if (user.notifications && (await hasNotificationPermissions())) {
      expoToken = (await getExpoPushToken()) ?? undefined;
    }

    await api.updateActivity(user.access, expoToken);
    await AsyncStorage.setItem(storageKey, String(Date.now()));
  }, [user]);

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

    syncActivity().catch((error) =>
      console.warn("Could not synchronize app activity", error),
    );
  }, [handleResponse, isLoading, syncActivity, user]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        syncActivity().catch((error) =>
          console.warn("Could not synchronize app activity", error),
        );
      }
    });
    return () => subscription.remove();
  }, [syncActivity]);

  return null;
}
