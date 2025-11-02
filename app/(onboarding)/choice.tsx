import { ThemedBackground } from "@/components/themed-background";
import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { api, CharacterApiResponse } from "@/libs/api";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const xThinkingImage = require("../../assets/images/onboarding/choice.png");

const Choice = () => {
  const { completeOnboarding, user } = useAuth();
  const [npcs, setNpcs] = useState<CharacterApiResponse[]>([]);
  const [selectedNpc, setSelectedNpc] = useState<number | null>(null);

  useEffect(() => {
    const fetchNpcs = async () => {
      const token = user?.access;
      if (!token) return;
      const data = await api.getCharacters(token);
      setNpcs(data);
    };

    fetchNpcs();
  }, [user]);

  const complete = () => {
    try {
      if (!selectedNpc) return;
      completeOnboarding({ characterId: selectedNpc });
      router.replace("/(tabs)");
    } catch (error: any) {
      const message = error?.message || "Error desconocido";
      Toast.show({
        type: "error",
        text1: "Error al completar el onboarding",
        text2: message,
      });
    }
  };

  const back = () => {
    router.replace("/(onboarding)/presentation");
  };

  return (
    <ThemedBackground style={styles.container}>
      <View style={styles.header}>
        <View style={styles.actionBack}>
          <TouchableOpacity onPress={() => back()}>
            <MaterialIcons name="arrow-back" size={24} color={TOKENS.muted} />
          </TouchableOpacity>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar]} />
        </View>

        <View style={styles.actionNext} />
      </View>
      <View style={styles.content}>
        <ThemedText type="title">Elige tu personaje</ThemedText>
        <ThemedText type="muted" style={styles.description}>
          Selecciona el personaje que más te guste para acompañarte en tu viaje
          de aprendizaje.
        </ThemedText>

        <View style={styles.grid}>
          {npcs?.map(({ id, name, image_url }: any) => (
            <TouchableOpacity
              key={id}
              onPress={() => setSelectedNpc(Number(id))}
              style={styles.personButton}
            >
              <View
                style={{
                  borderRadius: 100,
                  borderWidth: 3,
                  borderColor:
                    selectedNpc === Number(id) ? "#8CBCB0" : "transparent",
                }}
              >
                <Image
                  source={{ uri: image_url }}
                  style={styles.personImage}
                  resizeMode="contain"
                />
              </View>
              <ThemedText type="muted" style={styles.personName}>
                {name}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
        <Image
          source={xThinkingImage}
          style={styles.xImage}
          resizeMode="contain"
        />
      </View>
      {selectedNpc && (
        <View style={styles.navigationContainer}>
          <ThemedButton variant="primary" onPress={complete}>
            Iniciar aventuras
          </ThemedButton>
        </View>
      )}
    </ThemedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  actionBack: { flex: 1, height: 24 },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 20,
    paddingTop: 40,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    textAlign: "center",
    paddingHorizontal: 20,
    fontSize: 18,
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: Platform.OS === "ios" ? 30 : 20,
  },
  progressBarContainer: {
    width: 100,
    height: 4,
    borderRadius: 2,
    backgroundColor: TOKENS.primary,
  },
  progressBar: {
    height: 4,
    backgroundColor: TOKENS.muted,
    borderRadius: 2,
  },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionNext: { flex: 1, height: 24 },
  personButton: { marginBottom: 20, alignItems: "center", width: "30%" },
  personImage: { width: 80, height: 80, borderRadius: 100 },
  personName: { marginTop: 8 },
  xImage: { width: 250, height: 250, marginTop: 20 },
});

export default Choice;
