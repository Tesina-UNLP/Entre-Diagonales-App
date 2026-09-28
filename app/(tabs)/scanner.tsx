import { CameraPermissionView } from "@/components/camera-permission-view";
import { CaptureButton } from "@/components/capture-button";
import { FlashButton } from "@/components/flash-button";
import LoadingModal from "@/components/loading-modal";
import { PhotoPreview } from "@/components/photo-preview";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "@/hooks/use-location";
import { api } from "@/libs/api";
import { captureException, trackProductEvent } from "@/libs/telemetry";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { File } from "expo-file-system";
import { useIsFocused, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { TourTarget } from "@wrack/react-native-tour-guide";
import { useTutorial } from "@/contexts/tutorial";
import { useLocalizedAlert } from "@/hooks/use-localized-alert";
import { useLanguage } from "@/hooks/use-language";

export default function ScannerScreen() {
  const { t } = useTranslation();
  const showAlert = useLocalizedAlert();
  const { locale } = useLanguage();
  const { user, checkAuthState } = useAuth();
  const { triggerTutorial, ready: tutorialReady } = useTutorial();
  const isFocused = useIsFocused();
  // Camera permissions hook - nos ayuda a manejar los permisos de la cámara
  const [permission, requestPermission] = useCameraPermissions();

  // Estado para controlar si ya escaneamos un código (evita escaneos múltiples)
  const [scanned, setScanned] = useState(false);

  // Estado para guardar la foto tomada
  const [photo, setPhoto] = useState<string | null>(null);

  // Estado para indicar si está tomando la foto
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);

  // Limitar la resolución evita subir fotos tomadas a la resolución nativa
  // completa (normalmente 12 MP o más). Dos megapíxeles mantienen suficiente
  // detalle para la verificación visual y reducen de forma considerable el
  // tiempo de subida y el consumo de datos.
  const [pictureSize, setPictureSize] = useState<string | undefined>();

  // Estado para controlar el flash/linterna de la cámara
  const [flashEnabled, setFlashEnabled] = useState(false);

  // Estado para mostrar el modal de cargando (simulación de llamada a API)
  const [isLoading, setIsLoading] = useState(false);

  // Referencia a la cámara para poder tomar fotos
  const cameraRef = useRef<CameraView>(null);

  const {
    location,
    isLoading: isLocationLoading,
    error: locationError,
  } = useLocation();

  // Router para navegar después de escanear
  const router = useRouter();

  const ParamsSchema = z.object({
    mode: z.enum(["spot", "secret", "qr"]).optional().default("qr"),
    from: z.string().optional().default("/(tabs)"),
    secret_id: z.string().optional().default(""),
    spot_id: z.string().optional().default(""),
    tour_id: z.string().optional().default(""),
  });

  // get query params
  const parsed = ParamsSchema.safeParse(useLocalSearchParams());
  const params = parsed.success
    ? parsed.data
    : { mode: "qr", from: "/(tabs)", secret_id: "", spot_id: "", tour_id: "" };

  useEffect(() => {
    if (isFocused && permission?.granted) {
      trackProductEvent("camera_opened", {
        camera_mode: params.mode,
        tour_id: params.tour_id ? Number(params.tour_id) : undefined,
        spot_id: params.spot_id ? Number(params.spot_id) : undefined,
      });
    }
  }, [
    isFocused,
    params.mode,
    params.spot_id,
    params.tour_id,
    permission?.granted,
  ]);

  useEffect(() => {
    if (
      isFocused &&
      permission?.granted &&
      params.mode !== "qr" &&
      tutorialReady
    ) {
      void triggerTutorial("camera");
    }
  }, [
    isFocused,
    params.mode,
    permission?.granted,
    triggerTutorial,
    tutorialReady,
  ]);

  // Las pantallas de tabs permanecen montadas. Al volver a entrar, o al
  // cambiar de modo, no reutilizamos resultados, previews ni estados de una
  // sesión anterior de cámara.
  useEffect(() => {
    if (!isFocused) return;

    setScanned(false);
    setPhoto(null);
    setIsTakingPhoto(false);
    setIsLoading(false);
    setFlashEnabled(false);
    setPictureSize(undefined);
  }, [
    isFocused,
    params.mode,
    params.secret_id,
    params.spot_id,
    params.tour_id,
  ]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(params.from as any);
  };

  const handleComplete = async () => {
    if (
      params.mode === "spot" &&
      (!location ||
        !Number.isFinite(location.latitude) ||
        !Number.isFinite(location.longitude))
    ) {
      showAlert(
        "Ubicación no disponible",
        isLocationLoading
          ? "Todavía estamos obteniendo tu ubicación. Esperá unos segundos e intentá nuevamente."
          : locationError ||
              "Necesitamos una ubicación válida para completar esta parada.",
      );
      return;
    }

    setIsLoading(true);

    // URL por defecto - apunta a la ruta correcta en (stack)
    let urlToRedirect = `/${params.mode === "spot" ? "(stack)/spots" : "(tabs)/profile/secrets"}/${params.secret_id ? params.secret_id : params.spot_id}`;

    if (!user?.access) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se ha iniciado sesión",
      });
      setIsLoading(false);
      return;
    }

    // Bloque try-catch para manejar errores de las requests
    try {
      const formData = new FormData();

      if (photo) {
        const imageFile = new File(photo);

        if (!imageFile.exists) {
          throw new Error("No se encontró la foto capturada");
        }

        // Expo 57 serializa multipart con Blob/File. El objeto histórico
        // `{ uri, name, type }` falla en Android con expo/fetch.
        // El nombre 'file' debe coincidir con request.FILES.get("file") del backend.
        formData.append(
          params.mode === "spot" ? "file" : "image",
          imageFile,
          imageFile.name,
        );
      }

      if (params.mode === "spot") {
        // La validación anterior garantiza coordenadas reales; nunca enviamos
        // strings vacíos, que el backend rechaza como un multipart inválido.
        formData.append("latitude", String(location!.latitude));
        formData.append("longitude", String(location!.longitude));
        // Intentamos completar el spot
        const response = await api.completeSpot(
          user?.access,
          parseInt(params.tour_id),
          parseInt(params.spot_id),
          formData,
        );
        trackProductEvent("recognition_succeeded", {
          tour_id: Number(params.tour_id),
          spot_id: Number(params.spot_id),
        });

        if (response.tour_completed) {
          urlToRedirect = `/(tabs)/tours/${params.tour_id}/complete?tour_id=${params.tour_id}&xp=${response.rewards.experience}&coins=${response.rewards.coins}&secrets=${response.total_secret_items}&trivias=${response.total_quizzes}&secrets_completed=${response.secret_items_completed}&trivias_completed=${response.quizzes_completed}&tour_name=${response.tour_name}`;
        } else {
          urlToRedirect = `/(stack)/spots/${params.spot_id}?tourId=${params.tour_id}`;
        }
      } else {
        // Intentamos completar el objeto secreto
        const response = await api.completeSecret(
          user?.access,
          parseInt(params.secret_id),
          parseInt(params.spot_id),
          formData,
        );

        if (response.success) {
          trackProductEvent("secret_found", {
            secret_id: Number(params.secret_id),
            spot_id: Number(params.spot_id),
            tour_id: params.tour_id ? Number(params.tour_id) : undefined,
          });
          urlToRedirect = `/(tabs)/profile/secrets/${params.secret_id}/complete?secret_id=${params.secret_id}&coins=${response.coins}&xp=${response.xp}&name=${response.name}&description=${response.description}&image_url=${response.image}`;
        }
      }

      // Si todo salió bien, limpiamos el estado y navegamos
      setIsLoading(false);
      setScanned(false);
      setPhoto(null);
      router.navigate(urlToRedirect as any);
    } catch (error) {
      if (params.mode === "spot") {
        trackProductEvent("recognition_failed", {
          tour_id: Number(params.tour_id),
          spot_id: Number(params.spot_id),
          failure_kind: "verification_request_failed",
        });
      }
      // Si hay un error en cualquiera de las dos requests
      captureException(error, { operation: "scanner.complete_challenge" });

      // Un Alert queda por encima de la vista nativa de cámara y permite ver
      // el `detail` exacto que devuelve el backend para los errores 400.
      showAlert(
        "No pudimos completar la parada",
        error instanceof Error ? error.message : "Por favor, intentá de nuevo.",
      );

      // Ocultamos el modal de cargando para que el usuario pueda reintentar
      setIsLoading(false);

      // NO limpiamos la foto ni el estado de scanned
      // Esto permite que el usuario pueda presionar "Usar esta foto" nuevamente
      // o tomar una nueva foto si lo desea
    }
  };

  const handleBarcodeScanned = async ({ data }: BarcodeScanningResult) => {
    // Si ya escaneamos, no hacer nada (evita múltiples escaneos)
    if (scanned) return;

    // Marcamos que ya escaneamos
    setScanned(true);

    const match = data
      .trim()
      .match(
        /^entrediagonales:\/\/qr\/([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i,
      );

    if (!match) {
      showAlert(
        "Código no válido",
        "Este código no pertenece a Entre Diagonales.",
        [
          { text: "Seguir escaneando", onPress: () => setScanned(false) },
          { text: "Volver", style: "cancel", onPress: handleBack },
        ],
      );
      return;
    }

    if (!user?.access) {
      showAlert("Sesión requerida", "Iniciá sesión para canjear recompensas.", [
        { text: "Volver", onPress: handleBack },
      ]);
      return;
    }

    try {
      setIsLoading(true);
      const redemption = await api.redeemQRCode(user.access, match[1]);
      await checkAuthState?.().catch((error) => {
        captureException(error, { operation: "scanner.refresh_balance" });
      });
      const unit = t(
        redemption.reward_type === "coins" ? "scanner.coins" : "scanner.gems",
      );
      showAlert(
        "Recompensa canjeada",
        t("scanner.received", {
          amount: redemption.reward_amount.toLocaleString(locale),
          unit,
        }),
        [
          { text: "Seguir escaneando", onPress: () => setScanned(false) },
          { text: "Volver", style: "cancel", onPress: handleBack },
        ],
      );
    } catch (error) {
      captureException(error, { operation: "scanner.redeem_qr" });
      const message =
        error instanceof Error ? error.message : "Intentá nuevamente.";
      showAlert("No pudimos canjear el código", message, [
        { text: "Seguir escaneando", onPress: () => setScanned(false) },
        { text: "Volver", style: "cancel", onPress: handleBack },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para tomar una foto (para modos "spot" y "secret")
  const takePicture = async () => {
    // Verificamos que la cámara esté lista
    if (!cameraRef.current) {
      showAlert("Error", "La cámara no está lista");
      return;
    }

    try {
      // Indicamos que estamos tomando la foto (para feedback visual)
      setIsTakingPhoto(true);

      // La resolución se limita con `pictureSize` y luego se comprime el JPEG.
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.65,
        base64: false,
      });

      // Guardamos la URI (ubicación) de la foto
      if (photo) {
        setPhoto(photo.uri);
      }
    } catch (error) {
      captureException(error, { operation: "scanner.take_picture" });
      showAlert("Error", "No se pudo tomar la foto");
    } finally {
      setIsTakingPhoto(false);
    }
  };

  const configurePictureSize = async () => {
    try {
      const sizes = await cameraRef.current?.getAvailablePictureSizesAsync();
      if (!sizes?.length) return;

      const targetPixels = 2_200_000;
      const candidates = sizes
        .map((size) => {
          const [width, height] = size.split("x").map(Number);
          return { size, pixels: width * height };
        })
        .filter(({ pixels }) => Number.isFinite(pixels) && pixels > 0)
        .sort((a, b) => b.pixels - a.pixels);

      // Elegimos la mayor resolución que no supere el objetivo. Si el equipo
      // no ofrece una menor, usamos la más pequeña disponible.
      const selected =
        candidates.find(({ pixels }) => pixels <= targetPixels) ??
        candidates[candidates.length - 1];

      setPictureSize(selected?.size);
    } catch (error) {
      // La cámara conserva su tamaño predeterminado si el dispositivo no
      // expone los tamaños disponibles; la compresión JPEG sigue aplicando.
      captureException(error, { operation: "scanner.configure_camera" });
    }
  };

  // Validación de parámetros
  if (!params.mode || !params.from) {
    return (
      <ThemedBackground style={styles.container}>
        <ThemedText>Error de parámetros</ThemedText>
      </ThemedBackground>
    );
  }

  // Si aún no se solicitaron permisos o están cargando
  if (!permission) {
    return (
      <ThemedBackground style={styles.container}>
        <ThemedText>Cargando...</ThemedText>
      </ThemedBackground>
    );
  }

  // Si no tenemos permisos, mostramos un botón para solicitarlos
  if (!permission.granted) {
    return <CameraPermissionView onRequestPermission={requestPermission} />;
  }

  // Las pantallas de tabs permanecen montadas al navegar. Desmontar la vista
  // nativa cuando pierde foco evita reutilizar una sesión de cámara inválida
  // al entrar y salir varias veces, especialmente en iOS.
  if (!isFocused) {
    return <View style={styles.container} />;
  }

  // MODO QR: canje de recompensas configuradas desde el backend.
  if (params.mode === "qr") {
    return (
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing="back"
          enableTorch={flashEnabled}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        />
        <View
          collapsable={false}
          pointerEvents="box-none"
          style={styles.overlay}
        >
          <View style={styles.scanTextContainer}>
            <TouchableOpacity
              style={styles.cameraBackButton}
              onPress={handleBack}
              accessibilityRole="button"
              accessibilityLabel={t("scanner.backToTour")}
              hitSlop={8}
            >
              <Ionicons name="chevron-back" size={26} color="white" />
            </TouchableOpacity>
            <ThemedText style={styles.scanText}>
              Escaneá un código QR
            </ThemedText>

            {/* Botón de flash */}
            <FlashButton
              enabled={flashEnabled}
              onPress={() => setFlashEnabled(!flashEnabled)}
            />
          </View>
        </View>

        {/* Modal de cargando - Se muestra mientras se procesa */}
        <LoadingModal isLoading={isLoading} text="Procesando..." />
      </View>
    );
  }

  // MODOS SPOT y SECRET: Para tomar fotos de estructuras
  return (
    <View style={styles.container}>
      {/* Si ya tomamos una foto, mostramos preview */}
      {photo ? (
        <PhotoPreview
          photoUri={photo}
          onRetake={() => setPhoto(null)}
          onConfirm={handleComplete}
          isLoading={isLoading}
        />
      ) : (
        // Mostrar cámara para tomar fotos
        <>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            enableTorch={flashEnabled}
            pictureSize={pictureSize}
            onCameraReady={configurePictureSize}
          />
          <View
            collapsable={false}
            pointerEvents="box-none"
            style={styles.overlay}
          >
            <View style={styles.scanTextContainer}>
              <TouchableOpacity
                style={styles.cameraBackButton}
                onPress={handleBack}
                accessibilityRole="button"
                accessibilityLabel={t("scanner.backToTour")}
                hitSlop={8}
              >
                <Ionicons name="chevron-back" size={26} color="white" />
              </TouchableOpacity>
              <ThemedText type="defaultSemiBold" style={styles.scanText}>
                Intenta apuntar de frente al lugar
              </ThemedText>

              {/* Botón de flash */}
              <FlashButton
                enabled={flashEnabled}
                onPress={() => setFlashEnabled(!flashEnabled)}
              />
            </View>

            <TourTarget id="tutorial-camera-frame" style={styles.monumentGuide}>
              <ThemedText style={styles.monumentGuideLabel}>
                Encuadrá el monumento acá
              </ThemedText>
            </TourTarget>

            {/* Botón para tomar foto */}
            <CaptureButton
              tutorialTargetId="tutorial-camera-capture"
              onPress={takePicture}
              disabled={isTakingPhoto}
            />
          </View>
        </>
      )}

      {/* Modal de cargando - Se muestra mientras se procesa */}
      <LoadingModal isLoading={isLoading} text="Procesando..." />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 0,
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 10,
    backgroundColor: "transparent",
    justifyContent: "space-between",
    padding: 20,
  },
  scanTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  scanText: {
    flex: 1,
    color: "white",
    textAlign: "center",
    backgroundColor: "rgba(15, 38, 36, 0.4)",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cameraBackButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15, 38, 36, 0.72)",
  },
  monumentGuide: {
    position: "absolute",
    top: "20%",
    left: "10%",
    right: "10%",
    aspectRatio: 0.82,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: "rgba(217, 236, 235, 0.72)",
    backgroundColor: "rgba(15, 38, 36, 0.08)",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 14,
  },
  monumentGuideLabel: {
    color: "rgba(217, 236, 235, 0.9)",
    fontSize: 13,
    fontWeight: "700",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(15, 38, 36, 0.72)",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  backButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 40,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
