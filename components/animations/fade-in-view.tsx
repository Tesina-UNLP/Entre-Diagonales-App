import React, { useEffect, useRef } from "react";
import { Animated, ViewStyle } from "react-native";

/**
 * Props para el componente FadeInView
 * @param children - Contenido que se animará con el efecto fade-in
 * @param duration - Duración de la animación en milisegundos (por defecto: 600ms)
 * @param delay - Retraso antes de iniciar la animación en milisegundos (por defecto: 0ms)
 * @param style - Estilos adicionales para el contenedor
 */
interface FadeInViewProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: ViewStyle;
}

/**
 * Componente que anima su contenido con un efecto de fade-in (desvanecimiento al aparecer)
 *
 * ¿Cómo funciona?
 * 1. Comienza con opacidad 0 (invisible)
 * 2. Anima gradualmente la opacidad hasta 1 (completamente visible)
 * 3. Usa la API Animated de React Native para una animación suave
 *
 * Ejemplo de uso:
 * <FadeInView duration={800} delay={200}>
 *   <Text>Este texto aparecerá con efecto fade-in</Text>
 * </FadeInView>
 */
export const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  duration = 600,
  delay = 0,
  style,
}) => {
  // useRef mantiene una referencia al valor animado que persiste entre renders
  // Animated.Value(0) crea un valor animado que comienza en 0 (opacidad invisible)
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animated.timing() crea una animación que cambia un valor en el tiempo
    Animated.timing(
      fadeAnim, // El valor que queremos animar
      {
        toValue: 1, // Valor final de la animación (opacidad totalmente visible)
        duration, // Cuánto tiempo tomará la animación
        delay, // Cuánto tiempo esperar antes de comenzar
        useNativeDriver: true, // Usa el driver nativo para mejor performance
      },
    ).start(); // Inicia la animación
  }, [fadeAnim, duration, delay]);

  return (
    // Animated.View es un componente especial que puede ser animado
    <Animated.View
      style={[
        style, // Estilos personalizados pasados como prop
        {
          opacity: fadeAnim, // Vincula la opacidad al valor animado
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};
