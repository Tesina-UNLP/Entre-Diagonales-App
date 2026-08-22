import { ConfigContext, ExpoConfig } from "expo/config";

declare const require: (id: "fs") => {
  existsSync: (path: string) => boolean;
};

const { existsSync } = require("fs");

type ExpoConfigWithNativeFlags = ExpoConfig & {
  newArchEnabled: boolean;
};

const googleServicesFile = "./google-services.json";

const requireGoogleClientId = (name: string): string => {
  const clientId = process.env[name]?.trim();

  if (!clientId?.endsWith(".apps.googleusercontent.com")) {
    throw new Error(
      `${name} debe contener un Client ID OAuth válido de Google.`,
    );
  }

  return clientId;
};

const googleWebClientId = requireGoogleClientId("EXPO_PUBLIC_WEB_CLIENT_ID");
const googleIosClientId = requireGoogleClientId("EXPO_PUBLIC_IOS_CLIENT_ID");
const googleWebProjectNumber = googleWebClientId.split("-", 1)[0];
const googleIosProjectNumber = googleIosClientId.split("-", 1)[0];

if (googleWebProjectNumber !== googleIosProjectNumber) {
  throw new Error(
    "EXPO_PUBLIC_WEB_CLIENT_ID y EXPO_PUBLIC_IOS_CLIENT_ID deben pertenecer al mismo proyecto de Google Cloud.",
  );
}

const googleIosUrlScheme = `com.googleusercontent.apps.${googleIosClientId.replace(
  ".apps.googleusercontent.com",
  "",
)}`;

export default ({ config }: ConfigContext): ExpoConfig =>
  ({
    ...config,
    name: "Entre Diagonales",
    slug: "entre-diagonales",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "entrediagonales",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.entrediagonales.app",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#004643",
      },
      edgeToEdgeEnabled: true,
      package: "com.entrediagonales.app",
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS,
        },
      },
      ...(existsSync(googleServicesFile) ? { googleServicesFile } : {}),
    } as ExpoConfig["android"] & { edgeToEdgeEnabled: boolean },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-asset",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#004643",
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
        },
      ],
      "expo-secure-store",
      "expo-font",
      "expo-web-browser",
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: googleIosUrlScheme,
        },
      ],
      "./plugins/with-google-signin-modular-headers",
      [
        "expo-camera",
        {
          cameraPermission: "Permiso para usar la cámara de Entre Diagonales",
          microphonePermission:
            "Permiso para usar el micrófono de Entre Diagonales",
          recordAudioAndroid: true,
        },
      ],
      [
        "expo-location",
        {
          locationWhenInUsePermission:
            "Permiso para usar la ubicación de Entre Diagonales",
        },
      ],
      [
        "react-native-maps",
        {
          androidGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS,
        },
      ],
      [
        "expo-notifications",
        {
          defaultChannel: "default",
          sounds: ["./assets/sfx/notifications.wav"],
        },
      ],
      "expo-audio",
    ],
    updates: {
      url: "https://u.expo.dev/d8afb0e4-db66-480e-800f-b4d06f1368aa",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    experiments: {
      typedRoutes: true,
    },
    owner: "entre-diagonales",
    extra: {
      router: {},
      eas: {
        projectId: "d8afb0e4-db66-480e-800f-b4d06f1368aa",
      },
    },
  }) as ExpoConfigWithNativeFlags;
