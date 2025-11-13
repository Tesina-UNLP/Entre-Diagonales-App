import Header from "@/components/header";
import { ThemedBackground } from "@/components/themed-background";
import { ThemedButton } from "@/components/themed-button";
import { ThemedText } from "@/components/themed-text";
import { TOKENS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Linking, ScrollView, StyleSheet, TextInput, View } from "react-native";

const sections = [
  {
    question: "¿Cómo juego las trivias?",
    answer:
      "Después de escanear un monumento o edificio puede surgir una trivia.",
  },
  {
    question: "¿Se puede ver la ubicación de los monumentos en el mapa?",
    answer: "Si, se puede ver la ubicación de los monumentos en el mapa.",
  },
  {
    question: "¿Cómo puedo reportar un error?",
    answer:
      "Puedes reportar un error a través de la sección de contacto en la aplicación.",
  },
  {
    question: "¿Se puede comprar gemas?",
    answer: "No, actualmente no se puede comprar gemas.",
  },
  {
    question: "¿Puedo hacer de nuevo un recorrido?",
    answer: "No, actualmente no se puede hacer de nuevo un recorrido.",
  },
  {
    question: "¿Puedo ver los recorridos completados?",
    answer: "Si, se puede ver los recorridos completados.",
  },
];

const Help = () => {
  const [search, setSearch] = useState("");
  const filteredSections = sections.filter((section) =>
    section.question.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <ThemedBackground style={styles.container} safeArea={false}>
      <Header
        title={"Ayuda"}
        description={"Ayuda para resolver tus dudas"}
        onBack={() => router.back()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Buscar"
            style={styles.searchInput}
            placeholderTextColor={TOKENS.muted}
            value={search}
            onChangeText={setSearch}
          />
          <Ionicons name="search" size={18} color={TOKENS.muted} />
        </View>

        {filteredSections.map((section) => (
          <View key={section.question} style={styles.sectionContainer}>
            <ThemedText type="defaultSemiBold">{section.question}</ThemedText>
            <ThemedText type="muted">{section.answer}</ThemedText>
          </View>
        ))}

        {filteredSections.length === 0 && (
          <View style={styles.noResultsContainer}>
            <ThemedText type="muted">No se encontraron resultados</ThemedText>
          </View>
        )}

        <View style={styles.contactContainer}>
          <Ionicons name="headset" size={24} color={TOKENS.accent} />
          <ThemedText type="subtitle">¿Necesitas mas ayuda?</ThemedText>
          <ThemedText type="muted" style={styles.contactDescription}>
            No encontraste la respuesta que buscabas? Contacta a nuestro equipo
            de soporte.
          </ThemedText>
          <ThemedButton
            variant="accent"
            size="small"
            onPress={() =>
              Linking.openURL("mailto:entrediagonalesunlp@gmail.com")
            }
          >
            <View style={styles.contactButtonContent}>
              <Ionicons name="mail" size={18} color={TOKENS.primaryHover} />
              <ThemedText
                type="defaultSemiBold"
                style={styles.contactButtonText}
              >
                Contactar Soporte
              </ThemedText>
            </View>
          </ThemedButton>
        </View>

        <View style={styles.bottomSpacer}></View>
      </ScrollView>
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 30,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 0,
    color: TOKENS.text,
    fontSize: 16,
    fontFamily: "ClashDisplay",
  },

  sectionContainer: {
    gap: 10,
    backgroundColor: TOKENS.cardBackground,
    borderRadius: 18,
    padding: 24,
    marginBottom: 10,
  },
  bottomSpacer: {
    height: 120,
  },
  contactContainer: {
    gap: 10,
    backgroundColor: TOKENS.cardBackground,
    borderRadius: 18,
    padding: 24,
    marginBottom: 10,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  },
  contactDescription: {
    textAlign: "center",
  },
  contactButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  contactButtonText: {
    color: TOKENS.primaryHover,
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
});

export default Help;
