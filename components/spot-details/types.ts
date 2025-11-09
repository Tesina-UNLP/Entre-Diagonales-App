/**
 * TIPOS PARA LOS COMPONENTES DE DETALLES DE SPOTS
 *
 * Este archivo contiene todas las interfaces (tipos) que necesitamos
 * para los componentes de la pantalla de detalles de un spot.
 */

// Tipo para el componente ImageCarousel
export interface ImageCarouselProps {
  imageUrls: string[]; // Array de URLs de imágenes
}

// Tipo para el componente FloatingButtons
export interface FloatingButtonsProps {
  onShare: () => void; // Función que se ejecuta al presionar compartir
  onClose: () => void; // Función que se ejecuta al presionar cerrar
}

// Tipo para el componente SpotHeader
export interface SpotHeaderProps {
  name: string; // Nombre del lugar
  address: string; // Dirección del lugar
  tag?: string | null; // Etiqueta opcional (ej: "Museo", "Parque")
}

// Tipo para el componente FunFactsCard
export interface FunFactsCardProps {
  funFacts: string; // Texto con datos curiosos
}

// Tipo para el componente HistoricalSection
export interface HistoricalSectionProps {
  historicalInfo: string; // Información histórica del lugar
}

// Tipo para el componente VisitInfoSection
export interface VisitInfoSectionProps {
  schedule?: string; // Horarios de visita
  ticketPrice?: number | null; // Precio de entrada
  wheelchairAccessible?: boolean; // Si es accesible para sillas de ruedas
}

// Tipo para el componente ActionButtons
export interface ActionButtonsProps {
  address: string; // Dirección para Google Maps
  quizSolved: boolean; // Si ya se resolvió la trivia
  hasQuiz: boolean; // Si tiene trivia disponible
  quizId?: number; // ID de la trivia (opcional)
}
