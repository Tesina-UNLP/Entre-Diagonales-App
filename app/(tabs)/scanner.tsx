import { ThemedBackground } from "@/components/themed-background";
import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/libs/api";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BarcodeScanningResult, CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, Alert, Image, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
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

  // Estado para controlar el flash/linterna de la cámara
  const [flashEnabled, setFlashEnabled] = useState(false);

  // Estado para mostrar el modal de cargando (simulación de llamada a API)
  const [isLoading, setIsLoading] = useState(false);

  // Referencia a la cámara para poder tomar fotos
  const cameraRef = useRef<CameraView>(null);

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
  const params = parsed.success ? parsed.data : { mode: "qr", from: "/(tabs)", secret_id: "", spot_id: "", tour_id: "" };

  // Función para simular una llamada a la API
  // En el futuro, aquí harás la petición real al servidor
  const simulateAPICall = async () => {
    // Mostramos el modal de cargando
    setIsLoading(true);

    let urlToRedirect = `(tabs)/${params.mode === "spot" ? "spots" : "secrets"}/${params.secret_id ? params.secret_id : params.spot_id}`

    // Preparar la foto para enviarla al servidor
    // FormData es una estructura especial que permite enviar archivos junto con otros datos
    const formData = new FormData();

    // Si hay una foto, la agregamos al FormData
    if (photo) {
      // Extraemos el nombre del archivo y el tipo (extensión)
      const fileName = photo.split('/').pop() || 'photo.jpg';
      const fileType = fileName.split('.').pop();

      // Agregamos la foto al FormData como si fuera un archivo
      // @ts-ignore - React Native maneja FormData de forma especial
      // IMPORTANTE: El nombre 'file' debe coincidir con lo que el backend espera en request.FILES.get("file")
      formData.append(params.mode === "spot" ? "file" : "image", {
        uri: photo, // La ubicación de la foto en el dispositivo
        name: fileName, // El nombre del archivo
        type: `image/${fileType}`, // El tipo MIME (image/jpg, image/png, etc.)
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
        // Intentamos completar el spot
        const response = await api.completeSpot(user?.access, parseInt(params.tour_id), parseInt(params.spot_id), formData)
        Toast.show({
          type: "success",
          text1: "Spot completado",
          text2: "El spot ha sido completado correctamente",
        });

        if (response.tour_completed) {
          urlToRedirect = `/(stacks)/tours/${params.tour_id}/completed`
        }

      } else {
        // Intentamos completar el objeto secreto
        await api.completeSecret(user?.access, parseInt(params.secret_id), parseInt(params.spot_id), formData)
        Toast.show({
          type: "success",
          text1: "Objeto secreto completado",
          text2: "El objeto secreto ha sido completado correctamente",
        });
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
        text2: "No se pudo completar la acción. Por favor, intenta de nuevo.",
      });

      // Ocultamos el modal de cargando para que el usuario pueda reintentar
      setIsLoading(false);

      // NO limpiamos la foto ni el estado de scanned
      // Esto permite que el usuario pueda presionar "Usar esta foto" nuevamente
      // o tomar una nueva foto si lo desea
    }
  };

  // Función que se ejecuta cuando se escanea un código QR o de barras (solo para modo "qr")
  const handleBarcodeScanned = ({ type, data }: BarcodeScanningResult) => {
    // Si ya escaneamos, no hacer nada (evita múltiples escaneos)
    if (scanned) return;

    // Marcamos que ya escaneamos
    setScanned(true);

    // Aquí llamamos a la función que simula la API
    // En el futuro, enviarás los datos del QR al servidor
    console.log("QR escaneado - Tipo:", type, "Datos:", data);
    simulateAPICall();
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

      // Tomamos la foto con calidad media (0.5) para no ocupar mucho espacio
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
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

  // Validación de parámetros
  if (!params.mode || !params.from) {
    return (
      <ThemedBackground style={styles.container}>
        <ThemedText>Invalid params</ThemedText>
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
    return (
      <ThemedBackground style={styles.container}>
        <View style={styles.permissionContainer}>
          <ThemedText style={styles.message}>
            Necesitamos tu permiso para usar la cámara
          </ThemedText>
          <TouchableOpacity
            style={styles.button}
            onPress={requestPermission}
          >
            <ThemedText style={styles.buttonText}>
              Conceder permiso
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedBackground>
    );
  }

  // MODO QR: Para escanear códigos QR/barras
  if (params.mode === "qr") {
    return (
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing="back"
          enableTorch={flashEnabled}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "ean8", "code128", "code39"],
          }}
        >
          <View style={styles.overlay}>
            <View style={styles.scanTextContainer}>
              <ThemedText style={styles.scanText}>
                Escanea un código QR o de barras
              </ThemedText>

              {/* Botón de flash */}
              <TouchableOpacity
                style={[styles.flashButton, flashEnabled && styles.flashButtonActive]}
                onPress={() => setFlashEnabled(!flashEnabled)}
              >
                <MaterialCommunityIcons name="flash" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>

        {/* Modal de cargando - Se muestra mientras se procesa */}
        <Modal
          transparent={true}
          visible={isLoading}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ActivityIndicator size="large" color={TOKENS.accent} />
              <ThemedText style={styles.modalText}>Procesando...</ThemedText>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // MODOS SPOT y SECRET: Para tomar fotos de estructuras
  return (
    <View style={styles.container}>
      {/* Si ya tomamos una foto, mostramos preview */}
      {photo ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />

          <View style={styles.previewButtons}>
            <ThemedButton
              variant="outline"
              size="small"
              style={styles.previewButton}
              onPress={() => setPhoto(null)}
            >
              Tomar otra foto
            </ThemedButton>

            <ThemedButton
              variant="secondary"
              size="small"
              style={styles.previewButton}
              onPress={() => {
                // Aquí llamamos a la función que simula la API
                // En el futuro, enviarás la foto al servidor
                console.log("Usando foto:", photo);
                simulateAPICall();
              }}
            >
              Usar esta foto
            </ThemedButton>
          </View>
        </View>
      ) : (
        // Mostrar cámara para tomar fotos
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
          enableTorch={flashEnabled}
        >
          <View style={styles.overlay}>
            <View style={styles.scanTextContainer}>
              <ThemedText style={styles.scanText}>
                {params.mode === "spot"
                  ? "Toma una foto del lugar"
                  : "Toma una foto del objeto"}
              </ThemedText>

              {/* Botón de flash */}
              <TouchableOpacity
                style={[styles.flashButton, flashEnabled && styles.flashButtonActive]}
                onPress={() => setFlashEnabled(!flashEnabled)}
              >
                <MaterialCommunityIcons name="flash" size={20} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.cameraControls}>
              {/* Botón para tomar foto - grande y centrado */}
              <TouchableOpacity
                style={[styles.captureButton, isTakingPhoto && styles.captureButtonDisabled]}
                onPress={takePicture}
                disabled={isTakingPhoto}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      )}

      {/* Modal de cargando - Se muestra mientras se procesa */}
      <Modal
        transparent={true}
        visible={isLoading}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color={TOKENS.accent} />
            <ThemedText style={styles.modalText}>Procesando...</ThemedText>
          </View>
        </View>
      </Modal>
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
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  message: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
  },
  flashButtonActive: {
    backgroundColor: TOKENS.accent,
  },
  scanText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "rgba(15, 38, 36, 0.4)",
    paddingHorizontal: 15,
    paddingVertical: 10,

    borderRadius: 8,
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
  // Estilos para controles de la cámara (tomar fotos)
  cameraControls: {
    alignItems: "center",
    gap: 20,
    position: "absolute",
    bottom: 120,
    left: 0,
    right: 0,
  },
  // Botón circular para capturar foto (estilo clásico de cámara)
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  // Estilos para la vista previa de la foto
  previewContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  preview: {
    flex: 1,
    resizeMode: "contain",
  },
  previewButtons: {
    position: "absolute",
    bottom: 120,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  previewButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // Estilos para el botón de flash
  flashButton: {
    backgroundColor: "rgba(15, 38, 36, 0.4)",
    padding: 12,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  // Estilos para el modal de cargando
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: TOKENS.background,
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    gap: 15,
    minWidth: 200,
    // Sombra para darle profundidad al modal
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
