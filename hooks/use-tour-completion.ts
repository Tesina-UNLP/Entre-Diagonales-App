import { Share } from "react-native";

/**
 * Parámetros necesarios para compartir el logro de completar un tour
 */
interface ShareAchievementParams {
  tourName: string;
  xp: number;
  coins: number;
  secretsCompleted: number;
  secretsTotal: number;
  triviasCompleted: number;
  triviasTotal: number;
}

/**
 * Hook personalizado que proporciona funcionalidad para compartir
 * el logro de completar un tour
 *
 * @returns Objeto con la función shareAchievement
 */
export const useTourCompletion = () => {
  /**
   * Función que abre el diálogo nativo de compartir con información del tour
   *
   * @param params - Parámetros del tour completado
   */
  const shareAchievement = async (params: ShareAchievementParams) => {
    try {
      // Preparamos el mensaje a compartir con toda la información del tour
      const message =
        `🎉 ¡Completé la ruta "${params.tourName}" en Entre Diagonales!\n\n` +
        `🌟 XP ganada: +${params.xp}\n` +
        `💰 Monedas obtenidas: ${params.coins}\n` +
        `💎 Secretos descubiertos: ${params.secretsCompleted}/${params.secretsTotal}\n` +
        `❓ Trivias respondidas: ${params.triviasCompleted}/${params.triviasTotal}\n\n` +
        `¡Únete a mí en esta aventura de exploración!`;

      // Llamamos a la API nativa de compartir
      const result = await Share.share({
        message: message,
        // Opcional: Puedes agregar una URL si tienes deep linking configurado
        // url: 'https://yourapp.com/tours/' + tourId
      });

      // Verificamos si el usuario compartió o canceló el diálogo
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Compartido con un tipo de actividad específico (solo iOS)
        } else {
          // Compartido exitosamente
        }
      } else if (result.action === Share.dismissedAction) {
        // El usuario canceló el diálogo de compartir
      }
    } catch (error) {
      // Manejamos cualquier error que pueda ocurrir
      console.error("Error al compartir el logro:", error);
    }
  };

  // Retornamos la función para que pueda ser usada en componentes
  return {
    shareAchievement,
  };
};
