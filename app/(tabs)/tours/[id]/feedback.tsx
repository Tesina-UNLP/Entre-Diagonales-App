import Header from "@/components/header";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/libs/api";
import { FeedbackApiData } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
// Importamos los nuevos componentes modularizados
import {
  CommentSection,
  FeedbackOptionsSelector,
  QualificationSelector,
} from "@/components/feedback";

const Feedback = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const idStr = useMemo(() => (Array.isArray(id) ? id?.[0] : id), [id]);
  // Estado para rastrear la calificación seleccionada (solo una)
  const [selectedQualification, setSelectedQualification] = useState<
    number | null
  >(null);

  // Estado para rastrear las opciones seleccionadas (múltiples)
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  // Estado para rastrear el comentario
  const [comment, setComment] = useState<string>("");

  const { user } = useAuth();

  // Función para manejar la selección de calificación
  const handleQualificationPress = (id: number) => {
    setSelectedQualification(id);
  };

  // Función para manejar la selección de opciones (múltiples)
  const handleOptionPress = (id: number) => {
    if (selectedOptions.includes(id)) {
      // Si ya está seleccionada, la removemos
      setSelectedOptions(selectedOptions.filter((optionId) => optionId !== id));
    } else {
      // Si no está seleccionada, la agregamos
      setSelectedOptions([...selectedOptions, id]);
    }
  };

  const handleSendFeedback = async () => {
    const dataForm = {
      qualification: selectedQualification || 1,
      trivia_liked: selectedOptions.includes(1),
      spots_liked: selectedOptions.includes(2),
      secrets_liked: selectedOptions.includes(3),
      route_liked: selectedOptions.includes(4),
      rewards_liked: selectedOptions.includes(5),
      name: user?.username || "",
      comment: comment,
    } as unknown as FeedbackApiData;

    try {
      if (!user?.access) {
        Toast.show({
          type: "error",
          text1: "No estás autenticado",
        });
        return;
      }
      const response = await api.sendFeedback(
        user?.access,
        dataForm,
        parseInt(idStr),
      );

      if (response) {
        Toast.show({
          type: "success",
          text1: "Feedback enviado correctamente",
        });
        router.navigate("/(tabs)/tours");
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Error al enviar el feedback",
        text2: error.message,
      });
    }
  };

  return (
    <ThemedBackground style={styles.container} safeArea={false}>
      <Header
        title={"Cuentanos tu experiencia"}
        description={"Ayudanos a mejorar!"}
        onBack={() => router.back()}
      />

      <View style={styles.content}>
        {/* Sección de calificación con emojis */}
        <QualificationSelector
          selectedQualification={selectedQualification}
          onSelect={handleQualificationPress}
        />

        {/* Sección de opciones múltiples de feedback */}
        <FeedbackOptionsSelector
          selectedOptions={selectedOptions}
          onToggle={handleOptionPress}
        />

        {/* Sección de comentarios adicionales */}
        <CommentSection value={comment} onChangeText={setComment} />

        {/* Botones de acción */}
        <View style={styles.buttonsContainer}>
          <ThemedButton
            variant="secondary"
            size="small"
            onPress={handleSendFeedback}
          >
            <ThemedText
              type="defaultSemiBold"
              style={{ color: TOKENS.primary }}
            >
              Enviar feedback
            </ThemedText>
          </ThemedButton>

          <ThemedButton
            variant="outline"
            size="small"
            onPress={() => router.navigate("/(tabs)/tours")}
          >
            <ThemedText
              type="defaultSemiBold"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ flexShrink: 1 }}
            >
              Omitir
            </ThemedText>
          </ThemedButton>
        </View>
      </View>
    </ThemedBackground>
  );
};

// Estilos simplificados - la mayoría de los estilos ahora están en los componentes modulares
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 30,
  },
  buttonsContainer: {
    gap: 10,
  },
});

export default Feedback;
