# App móvil de Entre Diagonales 👋

Este es un proyecto de [Expo](https://expo.dev) creado con [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Comenzar

1. Instala las dependencias

   ```bash
   pnpm install
   ```

2. Inicia la app

   ```bash
   pnpx expo start
   ```

En la salida, encontrarás opciones para abrir la app en:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/) (compilación de desarrollo)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/) (emulador de Android)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/) (simulador de iOS)
- [Expo Go](https://expo.dev/go), un entorno limitado para probar el desarrollo de apps con Expo

Puedes comenzar a desarrollar editando los archivos dentro del directorio **app**. Este proyecto utiliza [ruteo basado en archivos](https://docs.expo.dev/router/introduction).

## Observabilidad con PostHog

PostHog captura excepciones JavaScript, rechazos no manejados, errores de render y crashes nativos. La app identifica únicamente con el `AppUser.id` interno y agrega los encabezados `X-POSTHOG-DISTINCT-ID` y `X-POSTHOG-SESSION-ID` a las llamadas de la API. No se envían nombres, emails, tokens ni ubicación.

Configurá las variables públicas de `.env.example` mediante los entornos EAS. Session Replay está apagado por defecto y sólo puede iniciar si `EXPO_PUBLIC_POSTHOG_SESSION_REPLAY_ENABLED=true` y existe consentimiento persistido; texto e imágenes se enmascaran y no se capturan logs, red ni toques.

Los builds EAS cargan source maps, dSYM y mappings Android mediante el plugin Expo. Las credenciales `POSTHOG_CLI_*` son secretos de build y nunca deben llevar el prefijo `EXPO_PUBLIC_`.

### Plan de eventos de producto

Las interacciones de Expo se emiten mediante `trackProductEvent` en `libs/telemetry.ts`: `app_opened`, `sign_up_completed`, `onboarding_completed`, `tour_viewed`, `tour_started`, `spot_viewed`, `camera_opened`, `recognition_succeeded`, `recognition_failed`, `quiz_started`, `quiz_answered`, `quiz_completed`, `secret_found`, `level_up` y `ranking_viewed`.

Cada evento incorpora `environment`, `platform`, `app_version` e `language`; los eventos de recorrido/cámara agregan sólo IDs internos de tour, spot, quiz o secreto. Las fotos, coordenadas, direcciones, respuestas y mensajes de error no se capturan. `tour_completed`, `spot_verified` y `achievement_unlocked` son hechos confirmados y los emite únicamente la API de Django mediante su outbox.

`tour_abandoned` y `spot_reached` no se emiten todavía: la UX no define un abandono explícito ni dispone de una regla de llegada validada antes de la confirmación server-side. Instrumentarlos ahora produciría métricas engañosas.

Para una actualización OTA, usá el wrapper obligatorio y pasale los argumentos normales de `eas update`:

```bash
pnpm update:posthog -- --channel production --message "Descripción"
```

El comando publica en `dist` y sólo si finaliza correctamente ejecuta `posthog-cli hermes upload`.

## Aprende más

Para aprender más sobre el desarrollo de tu proyecto con Expo, revisa los siguientes recursos:

- [Documentación de Expo](https://docs.expo.dev/): Aprende los fundamentos o explora temas avanzados con nuestras [guías](https://docs.expo.dev/guides).
- [Tutorial de Expo](https://docs.expo.dev/tutorial/introduction/): Sigue un tutorial paso a paso donde crearás un proyecto que funciona en Android, iOS y la web.

## Únete a la comunidad

Únete a nuestra comunidad de desarrolladores creando apps universales.

- [Expo en GitHub](https://github.com/expo/expo): Mira nuestra plataforma open source y contribuye.
- [Comunidad en Discord](https://chat.expo.dev): Chatea con usuarios de Expo y haz preguntas.
