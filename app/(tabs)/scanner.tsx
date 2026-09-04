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
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

export default function ScannerScreen() {
  const { user } = useAuth();
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

  const { location } = useLocation();

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

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(params.from as any);
  };

  const handleComplete = async () => {
    setIsLoading(true);

    // URL por defecto - apunta a la ruta correcta en (stack)
    let urlToRedirect = `/${params.mode === "spot" ? "(stack)/spots" : "(tabs)/profile/secrets"}/${params.secret_id ? params.secret_id : params.spot_id}`;

    // Preparar la foto para enviarla al servidor
    // FormData es una estructura especial que permite enviar archivos junto con otros datos
    const formData = new FormData();

    // Si hay una foto, la agregamos al FormData
    if (photo) {
      // Extraemos el nombre del archivo y el tipo (extensión)
      const fileName = photo.split("/").pop() || "photo.jpg";

      // Agregamos la foto al FormData como si fuera un archivo
      // @ts-ignore - React Native maneja FormData de forma especial
      // IMPORTANTE: El nombre 'file' debe coincidir con lo que el backend espera en request.FILES.get("file")
      formData.append(params.mode === "spot" ? "file" : "image", {
        uri: photo, // La ubicación de la foto en el dispositivo
        name: fileName, // El nombre del archivo
        type: "image/jpeg", // MIME estándar del JPEG creado por expo-camera
      });
    }
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
      if (params.mode === "spot") {
        formData.append("latitude", location?.latitude?.toString() || "");
        formData.append("longitude", location?.longitude?.toString() || "");
        // Intentamos completar el spot
        const response = await api.completeSpot(
          user?.access,
          parseInt(params.tour_id),
          parseInt(params.spot_id),
          formData,
        );

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
          urlToRedirect = `/(tabs)/profile/secrets/${params.secret_id}/complete?secret_id=${params.secret_id}&coins=${response.coins}&xp=${response.xp}&name=${response.name}&description=${response.description}&image_url=${response.image}`;
        }
      }

      // Si todo salió bien, limpiamos el estado y navegamos
      setIsLoading(false);
      setScanned(false);
      setPhoto(null);
      router.navigate(urlToRedirect as any);
    } catch (error) {
      // Si hay un error en cualquiera de las dos requests
      console.error("Error al completar:", error);

      // Mostramos un Toast de error
      Toast.show({
        type: "error",
        text1: "Error al procesar",
        text2: (error as any).message || "Por favor, intenta de nuevo.",
      });

      // Ocultamos el modal de cargando para que el usuario pueda reintentar
      setIsLoading(false);

      // NO limpiamos la foto ni el estado de scanned
      // Esto permite que el usuario pueda presionar "Usar esta foto" nuevamente
      // o tomar una nueva foto si lo desea
    }
  };

  // El lector queda disponible para futuros canjes. Por ahora no debe intentar
  // completar secretos ni enviar IDs inexistentes a la API.
  const handleBarcodeScanned = ({ data }: BarcodeScanningResult) => {
    // Si ya escaneamos, no hacer nada (evita múltiples escaneos)
    if (scanned) return;

    // Marcamos que ya escaneamos
    setScanned(true);

    Alert.alert(
      "Código QR detectado",
      "Los canjes con códigos QR estarán disponibles próximamente.",
      [
        {
          text: "Seguir escaneando",
          onPress: () => setScanned(false),
        },
        {
          text: "Volver",
          style: "cancel",
          onPress: handleBack,
        },
      ],
    );
  };

  // Función para tomar una foto (para modos "spot" y "secret")
  const takePicture = async () => {
    // Verificamos que la cámara esté lista
    if (!cameraRef.current) {
      Alert.alert("Error", "La cámara no está lista");
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
      console.error("Error al tomar la foto:", error);
      Alert.alert("Error", "No se pudo tomar la foto");
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
      console.warn("No se pudo configurar la resolución de la foto:", error);
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

  // MODO QR: lector disponible para futuros canjes.
  if (params.mode === "qr") {
    return (
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing="back"
          enableTorch={flashEnabled}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        >
          <View style={styles.overlay}>
            <View style={styles.scanTextContainer}>
              <TouchableOpacity
                style={styles.cameraBackButton}
                onPress={handleBack}
                accessibilityRole="button"
                accessibilityLabel="Volver al recorrido"
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
        </CameraView>

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
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          enableTorch={flashEnabled}
          pictureSize={pictureSize}
          onCameraReady={configurePictureSize}
        >
          <View style={styles.overlay}>
            <View style={styles.scanTextContainer}>
              <TouchableOpacity
                style={styles.cameraBackButton}
                onPress={handleBack}
                accessibilityRole="button"
                accessibilityLabel="Volver al recorrido"
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

            <View pointerEvents="none" style={styles.monumentGuide}>
              <ThemedText style={styles.monumentGuideLabel}>
                Encuadrá el monumento acá
              </ThemedText>
            </View>

            {/* Botón para tomar foto */}
            <CaptureButton onPress={takePicture} disabled={isTakingPhoto} />
          </View>
        </CameraView>
      )}

      {/* Modal de cargando - Se muestra mientras se procesa */}
      <LoadingModal isLoading={isLoading} text="Procesando..." />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
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
