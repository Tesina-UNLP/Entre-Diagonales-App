import Header from "@/components/header";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/libs/api";
import { CharacterApiResponse } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

const Profile = () => {
  const { user, checkAuthState } = useAuth();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [character, setCharacter] = useState<CharacterApiResponse | null>(null);
  const [characters, setCharacters] = useState<CharacterApiResponse[]>([]);
  // Estados para los campos del formulario
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setCharacter(user.character as CharacterApiResponse);
      // Inicializar los campos del formulario con los datos del usuario
      setFullName(user.display_name || "");
      setUsername(user.username || "");
      setEmail(user.email || "");
    }

    const fetchCharacters = async () => {
      const response = await api.getCharacters(user?.access || "");
      setCharacters(response);
    };
    fetchCharacters();
  }, [user]);

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  // Función para manejar el guardado del perfil
  const handleSave = async () => {
    try {
      if (!character?.id) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "No se pudo obtener el personaje",
        });
        return;
      }
      const dataForm = {
        display_name: fullName,
        username: username,
        email: email,
        character: character?.id,
      };

      const response = await api.updateProfile(user?.access || "", dataForm);
      if (response) {
        Toast.show({
          type: "success",
          text1: "Perfil actualizado",
          text2: "Tu perfil ha sido actualizado correctamente",
        });
      }
      await checkAuthState?.();
    } catch {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo guardar el perfil",
      });
    }
  };

  // Función para manejar el cambio de contraseña
  const handleChangePassword = () => {
    router.navigate("/(tabs)/profile/settings/change-password");
  };

  return (
    <ThemedBackground style={styles.container} safeArea={false}>
      <Header
        title={"Mi perfil"}
        description={"Configura tu perfil"}
        onBack={() => router.back()}
      />

      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: character?.image_url }} style={styles.avatar} />
          <TouchableOpacity
            onPress={() => openBottomSheet()}
            style={styles.avatarIconContainer}
          >
            <MaterialIcons name="edit" size={18} color={TOKENS.primary} />
          </TouchableOpacity>
        </View>

        {/* Formulario de perfil */}
        <View style={styles.formContainer}>
          {/* Campo de Nombre completo */}
          <View style={styles.inputWrapper}>
            <ThemedText type="muted">Nombre completo</ThemedText>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholderTextColor={TOKENS.muted}
            />
          </View>

          {/* Campo de Nombre de usuario */}
          <View style={styles.inputWrapper}>
            <ThemedText type="muted">Nombre de usuario</ThemedText>
            <TextInput
              style={styles.input}
              value={username ? `@${username}` : ""}
              onChangeText={(text) => {
                // Remover el @ si el usuario lo escribe
                const cleanUsername = text.startsWith("@")
                  ? text.slice(1)
                  : text;
                setUsername(cleanUsername);
              }}
              placeholderTextColor={TOKENS.muted}
            />
          </View>

          {/* Campo de Correo electrónico */}
          <View style={styles.inputWrapper}>
            <ThemedText type="muted">Correo electronico</ThemedText>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholderTextColor={TOKENS.muted}
            />
          </View>

          <View style={styles.buttonsContainer}>
            {/* Botón Guardar */}
            <ThemedButton
              variant="secondary"
              size="small"
              onPress={handleSave}
              style={styles.saveButton}
            >
              Guardar
            </ThemedButton>

            {/* Botón Cambiar contraseña */}
            {user?.provider !== "google" && (
              <ThemedButton
                variant="outline"
                size="small"
                onPress={handleChangePassword}
                style={styles.passwordButton}
              >
                Cambiar contraseña
              </ThemedButton>
            )}
          </View>
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={["40%"]}
          enablePanDownToClose
          handleIndicatorStyle={{ backgroundColor: TOKENS.muted }}
          backgroundStyle={styles.sheetBackground}
          handleStyle={styles.handle}
        >
          <BottomSheetView>
            <View style={styles.grid}>
              {characters?.map(
                ({ id, name, image_url }: CharacterApiResponse) => (
                  <TouchableOpacity
                    key={id}
                    onPress={() => {
                      setCharacter({
                        id,
                        name,
                        image_url,
                      } as CharacterApiResponse);
                      closeBottomSheet();
                    }}
                    style={styles.personButton}
                  >
                    <View
                      style={{
                        borderRadius: 100,
                        borderWidth: 3,
                        borderColor:
                          character?.id === Number(id)
                            ? "#8CBCB0"
                            : "transparent",
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
                ),
              )}
            </View>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </ThemedBackground>
  );
};

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
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 30,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: TOKENS.primary,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
    width: 100,
  },
  avatarIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: TOKENS.text,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  personButton: { marginBottom: 20, alignItems: "center", width: "30%" },
  personImage: { width: 80, height: 80, borderRadius: 100 },
  personName: { marginTop: 8 },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sheetBackground: {
    backgroundColor: "#053734",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handle: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  formContainer: {
    width: "100%",
    gap: 24,
    marginTop: 20,
    alignItems: "flex-start",
  },
  inputWrapper: {
    width: "100%",
    gap: 4,
  },
  label: {
    fontSize: 14,
  },
  input: {
    fontSize: 16,
    fontWeight: "600",
    color: TOKENS.text,
    borderBottomWidth: 1,
    borderBottomColor: TOKENS.text,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  saveButton: {
    marginTop: 8,
  },
  passwordButton: {
    marginTop: 8,
  },
  buttonsContainer: {
    width: "100%",
    gap: 10,
    flexDirection: "column",
    alignItems: "center",
  },
});

export default Profile;
