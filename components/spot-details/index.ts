/**
 * ARCHIVO ÍNDICE (BARREL EXPORT)
 *
 * Este archivo permite importar todos los componentes desde un solo lugar.
 * En lugar de hacer múltiples imports como:
 *   import { ImageCarousel } from "@/components/spot-details/ImageCarousel"
 *   import { SpotHeader } from "@/components/spot-details/SpotHeader"
 *
 * Podemos hacer:
 *   import { ImageCarousel, SpotHeader } from "@/components/spot-details"
 */

export { ActionButtons } from "./action-buttons";
export { FloatingButtons } from "./floating-buttons";
export { FunFactsCard } from "./fun-facts-card";
export { HistoricalSection } from "./historical-section";
export { ImageCarousel } from "./image-carousel";
export { QuizChallengeCard } from "./quiz-challenge-card";
export { SpotHeader } from "./spot-header";
export * from "./types";
export { VisitInfoSection } from "./visit-info-section";
