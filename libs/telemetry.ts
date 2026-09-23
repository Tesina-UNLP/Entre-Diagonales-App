import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Application from "expo-application";
import PostHog, { type PostHogOptions } from "posthog-react-native";
import { Platform } from "react-native";

const POSTHOG_HOST =
  process.env.EXPO_PUBLIC_POSTHOG_HOST?.trim() || "https://us.i.posthog.com";
const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY?.trim();
const APP_ENVIRONMENT =
  process.env.EXPO_PUBLIC_APP_ENV?.trim() || "development";
const POSTHOG_ENABLED =
  process.env.EXPO_PUBLIC_POSTHOG_ENABLED === "true" && !!POSTHOG_API_KEY;
const REPLAY_FEATURE_ENABLED =
  process.env.EXPO_PUBLIC_POSTHOG_SESSION_REPLAY_ENABLED === "true";
const REPLAY_CONSENT_KEY = "posthog.session-replay-consent.v1";
const REDACTED = "[REDACTED]";
let telemetryLanguage: string | undefined;

const sensitiveKey =
  /(^|[_.$-])(authorization|cookie|password|passwd|secret|access[_-]?token|refresh[_-]?token|id[_-]?token|jwt|email|full[_-]?name|first[_-]?name|last[_-]?name|location|latitude|longitude|address|phone)([_.$-]|$)/i;
const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const jwtPattern = /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g;
const bearerPattern = /\bBearer\s+[A-Za-z0-9._~+\/-]+=*/gi;

function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return value
      .replace(emailPattern, REDACTED)
      .replace(jwtPattern, REDACTED)
      .replace(bearerPattern, `Bearer ${REDACTED}`);
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return sanitizeRecord(value as Record<string, unknown>);
  }

  return value;
}

function sanitizeRecord(
  value: Record<string, unknown>,
  preservedKeys: ReadonlySet<string> = new Set(),
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      sensitiveKey.test(key) && !preservedKeys.has(key)
        ? REDACTED
        : sanitizeValue(nestedValue),
    ]),
  );
}

type BeforeSend = Exclude<
  NonNullable<PostHogOptions["before_send"]>,
  readonly unknown[]
>;

const beforeSend: BeforeSend = (event) => {
  if (!event) return null;

  return {
    ...event,
    // `token` is the public project token required by PostHog ingestion.
    properties: event.properties
      ? (sanitizeRecord(
          event.properties,
          new Set(["token"]),
        ) as typeof event.properties)
      : event.properties,
    $set: event.$set
      ? (sanitizeRecord(event.$set) as typeof event.$set)
      : event.$set,
    $set_once: event.$set_once
      ? (sanitizeRecord(event.$set_once) as typeof event.$set_once)
      : event.$set_once,
  };
};

export const posthog = new PostHog(POSTHOG_API_KEY || "ph_disabled", {
  host: POSTHOG_HOST,
  disabled: !POSTHOG_ENABLED,
  personProfiles: "identified_only",
  captureAppLifecycleEvents: false,
  capturePushNotificationSubscriptions: false,
  capturePushNotificationOpened: false,
  disableSurveys: true,
  errorTracking: {
    autocapture: {
      uncaughtExceptions: true,
      unhandledRejections: true,
      console: [],
      nativeCrashes: true,
    },
  },
  enableSessionReplay: false,
  sessionReplayConfig: {
    sampleRate: 0.1,
    captureTouches: false,
    maskAllTextInputs: true,
    maskAllImages: true,
    maskAllSandboxedViews: true,
    captureLog: false,
    captureNetworkTelemetry: false,
    throttleDelayMs: 1000,
  },
  before_send: beforeSend,
  customAppProperties: (properties) => ({
    ...properties,
    $app_name: "Entre Diagonales",
    $app_namespace: Application.applicationId,
    $app_version: Application.nativeApplicationVersion,
    $app_build: Application.nativeBuildVersion,
  }),
});

posthog.register({
  environment: APP_ENVIRONMENT,
  platform: Platform.OS,
  service: "expo-mobile",
});

export type ProductEventName =
  | "app_opened"
  | "sign_up_completed"
  | "onboarding_completed"
  | "tour_viewed"
  | "tour_started"
  | "spot_viewed"
  | "camera_opened"
  | "recognition_succeeded"
  | "recognition_failed"
  | "quiz_started"
  | "quiz_answered"
  | "quiz_completed"
  | "secret_found"
  | "level_up"
  | "ranking_viewed"
  | "tutorial_started"
  | "tutorial_step_viewed"
  | "tutorial_completed"
  | "tutorial_dismissed"
  | "tutorial_restarted";

type ProductEventProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

/** Capture an interaction without putting it on the UI's critical path. */
export function trackProductEvent(
  eventName: ProductEventName,
  properties: ProductEventProperties = {},
): void {
  if (!POSTHOG_ENABLED) return;

  const definedProperties = Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined),
  );
  posthog.capture(
    eventName,
    sanitizeRecord({
      environment: APP_ENVIRONMENT,
      platform: Platform.OS,
      app_version: Application.nativeApplicationVersion,
      ...(telemetryLanguage ? { language: telemetryLanguage } : {}),
      ...definedProperties,
    }) as Parameters<typeof posthog.capture>[1],
  );
}

export function setTelemetryLanguage(language: string): void {
  telemetryLanguage = language;
  posthog.register({ language });
}

export function identifyTelemetryUser(userId: AppUserId): void {
  if (POSTHOG_ENABLED) {
    posthog.identify(String(userId));
  }
}

export function resetTelemetryUser(): void {
  posthog.reset();
}

export function captureException(
  error: unknown,
  context: Record<string, string | number | boolean | null> = {},
): void {
  if (POSTHOG_ENABLED) {
    posthog.captureException(
      error,
      sanitizeRecord(context) as Record<
        string,
        string | number | boolean | null
      >,
    );
  }
}

export function getPostHogCorrelationHeaders(): Record<string, string> {
  if (!POSTHOG_ENABLED) return {};

  return {
    "X-POSTHOG-DISTINCT-ID": posthog.getDistinctId(),
    "X-POSTHOG-SESSION-ID": posthog.getSessionId(),
  };
}

export async function setSessionReplayConsent(granted: boolean): Promise<void> {
  await AsyncStorage.setItem(
    REPLAY_CONSENT_KEY,
    granted ? "granted" : "denied",
  );
  await applySessionReplayConsent(granted);
}

export async function syncSessionReplayConsent(): Promise<void> {
  const storedConsent = await AsyncStorage.getItem(REPLAY_CONSENT_KEY);
  await applySessionReplayConsent(storedConsent === "granted");
}

async function applySessionReplayConsent(granted: boolean): Promise<void> {
  if (POSTHOG_ENABLED && REPLAY_FEATURE_ENABLED && granted) {
    await posthog.startSessionRecording();
    return;
  }

  await posthog.stopSessionRecording();
}

export function hasSessionReplayConsent(): Promise<boolean> {
  return AsyncStorage.getItem(REPLAY_CONSENT_KEY).then(
    (value) => value === "granted",
  );
}

type AppUserId = string | number;

export const telemetryConfig = {
  enabled: POSTHOG_ENABLED,
  environment: APP_ENVIRONMENT,
  replayFeatureEnabled: REPLAY_FEATURE_ENABLED,
} as const;

export const __telemetryTesting = { sanitizeRecord, beforeSend };
