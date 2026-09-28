import {
  AccountDeletionPayload,
  AccountDeletionResponse,
  BlockedRankingUserApiResponse,
  CharacterApiResponse,
  FeedbackApiData,
  IndividualSpotApiResponse,
  LevelApiResponse,
  PowerUp5050ApiResponse,
  PaginatedRankingResponse,
  PaginatedResponse,
  QuizApiResponse,
  QRCodeRedemptionApiResponse,
  SecretItemApiResponse,
  TourApiResponse,
  TourInfoApiResponse,
  TourListFilters,
  UserAchievementApiResponse,
} from "@/types";
import { getPostHogCorrelationHeaders } from "@/libs/telemetry";

const apiBaseUrl =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://started-circles-tim-optimization.trycloudflare.com/api";

async function posthogFetch(
  input: Parameters<typeof globalThis.fetch>[0],
  init: RequestInit = {},
) {
  const headers = new Headers(init.headers);
  Object.entries(getPostHogCorrelationHeaders()).forEach(([name, value]) => {
    headers.set(name, value);
  });

  return globalThis.fetch(input, { ...init, headers });
}

export const api = {
  // login
  login: async (email: string, password: string) => {
    const response = await posthogFetch(`${apiBaseUrl}/auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Login failed";
      throw new Error(message);
    }
    return data;
  },

  loginWithGoogle: async (token: string) => {
    const response = await posthogFetch(`${apiBaseUrl}/auth/google/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Google login failed";
      throw new Error(message);
    }
    return data;
  },

  loginWithApple: async (
    idToken: string,
    appleUser: string,
    fullName?: string | null,
  ) => {
    const response = await posthogFetch(`${apiBaseUrl}/auth/apple/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken, appleUser, fullName }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Apple login failed";
      throw new Error(message);
    }
    return data;
  },

  // register
  register: async (
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    const response = await posthogFetch(`${apiBaseUrl}/auth/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        confirm_password: confirmPassword,
      }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Registration failed";
      throw new Error(message);
    }
    return data;
  },

  requestAccountDeletion: async (
    token: string,
    payload: AccountDeletionPayload,
  ): Promise<AccountDeletionResponse> => {
    const response = await posthogFetch(
      `${apiBaseUrl}/profile/account-deletion/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.detail ||
        data?.error ||
        data?.message ||
        "No pudimos solicitar la eliminación de la cuenta.";
      throw new Error(message);
    }
    return data;
  },

  // completar onboarding
  completeOnboarding: async (
    token: string,
    character_id: number,
    notificationToken: string,
  ) => {
    const response = await posthogFetch(`${apiBaseUrl}/onboarding/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        character: character_id,
        notification_token: notificationToken,
      }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Onboarding completion failed";
      throw new Error(message);
    }
    return data;
  },

  forgotPassword: async (email: string) => {
    const response = await posthogFetch(`${apiBaseUrl}/auth/password-reset/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Forgot password request failed";
      throw new Error(message);
    }
    return data;
  },

  getProfile: async (token: string) => {
    const response = await posthogFetch(`${apiBaseUrl}/profile/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Fetching profile failed";
      throw new Error(message);
    }
    return data;
  },

  //  get characters
  getCharacters: async (token: string): Promise<CharacterApiResponse[]> => {
    const response = await posthogFetch(`${apiBaseUrl}/characters/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Fetching characters failed";
      throw new Error(message);
    }
    return data as CharacterApiResponse[];
  },

  getLevels: async (token: string): Promise<LevelApiResponse[]> => {
    const response = await posthogFetch(`${apiBaseUrl}/levels/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Fetching levels failed";
      throw new Error(message);
    }
    return data as LevelApiResponse[];
  },

  getRoutesPage: async (
    token: string,
    filters: TourListFilters = {},
  ): Promise<PaginatedResponse<TourApiResponse>> => {
    const url = new URL(`${apiBaseUrl}/tours/`);
    url.searchParams.set("page", String(filters.page ?? 1));
    if (filters.tag) url.searchParams.set("tag", filters.tag);
    if (filters.completion)
      url.searchParams.set("completion", filters.completion);
    if (filters.maxSpots != null) {
      url.searchParams.set("max_spots", String(filters.maxSpots));
    }

    const response = await posthogFetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Fetching routes failed";
      throw new Error(message);
    }
    return data as PaginatedResponse<TourApiResponse>;
  },

  getRoutes: async (token: string): Promise<TourApiResponse[]> => {
    const routes: TourApiResponse[] = [];
    let page = 1;
    let next: string | null = "initial";

    while (next) {
      const response = await api.getRoutesPage(token, { page });
      routes.push(...response.results);
      next = response.next;
      page += 1;
    }

    return routes;
  },

  getRoute: async (token: string, id: number): Promise<TourInfoApiResponse> => {
    const response = await posthogFetch(`${apiBaseUrl}/tours/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Fetching route failed";
      throw new Error(message);
    }
    return data as TourInfoApiResponse;
  },

  startTour: async (token: string, id: number) => {
    const response = await posthogFetch(`${apiBaseUrl}/tours/start/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ tour_id: id }),
    });
    const data = await response.json().catch(() => null);
    return data;
  },

  completeSpot: async (
    token: string,
    tour_id: number,
    item_id: number,
    photo: FormData,
  ) => {
    const response = await posthogFetch(
      `${apiBaseUrl}/tours/${tour_id}/spots/${item_id}/complete`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: photo,
      },
    );

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Spot completion failed";
      throw new Error(message);
    }
    return data;
  },

  completeSecret: async (
    token: string,
    item_id: number,
    spot_id: number,
    photo: FormData,
  ) => {
    const response = await posthogFetch(
      `${apiBaseUrl}/spots/${spot_id}/secret_items/${item_id}/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: photo,
      },
    );

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Secret completion failed";
      throw new Error(message);
    }
    return data;
  },

  getSpot: async (
    token: string,
    id: number,
  ): Promise<IndividualSpotApiResponse> => {
    const response = await posthogFetch(`${apiBaseUrl}/spots/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Fetching spot failed";
      throw new Error(message);
    }
    return data as IndividualSpotApiResponse;
  },

  getQuiz: async (token: string, id: number): Promise<QuizApiResponse> => {
    const response = await posthogFetch(`${apiBaseUrl}/quizzes/${id}/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Fetching quiz failed";
      throw new Error(message);
    }
    return data;
  },

  solveQuiz: async (token: string, id: number, answer_id: number) => {
    const response = await posthogFetch(
      `${apiBaseUrl}/quizzes/${id}/answer/${answer_id}/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Solving quiz failed";
      throw new Error(message);
    }
    return data;
  },

  sendFeedback: async (
    token: string,
    formData: FeedbackApiData,
    tour_id: number,
  ) => {
    const response = await posthogFetch(
      `${apiBaseUrl}/tours/${tour_id}/feedback/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      },
    );
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Sending feedback failed";
      throw new Error(message);
    }
    return data;
  },

  getSecrets: async (token: string): Promise<SecretItemApiResponse[]> => {
    const response = await posthogFetch(`${apiBaseUrl}/secret_items/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Fetching secrets failed";
      throw new Error(message);
    }
    return data as SecretItemApiResponse[];
  },

  updateNotifications: async (
    token: string,
    notifications: boolean,
    expoToken: string,
  ) => {
    const response = await posthogFetch(
      `${apiBaseUrl}/profile/notifications/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notifications, notification_token: expoToken }),
      },
    );
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Updating notifications failed";
      throw new Error(message);
    }
    return data;
  },

  updateNotificationToken: async (token: string, expoToken: string) => {
    const response = await posthogFetch(
      `${apiBaseUrl}/profile/notifications/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notification_token: expoToken }),
      },
    );
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Updating notification token failed";
      throw new Error(message);
    }
    return data;
  },

  updateActivity: async (token: string, notificationToken?: string) => {
    const response = await posthogFetch(`${apiBaseUrl}/profile/activity/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        notificationToken ? { notification_token: notificationToken } : {},
      ),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.detail || response.statusText || "Updating activity failed";
      throw new Error(message);
    }
    return data;
  },

  getAchievements: async (
    token: string,
  ): Promise<UserAchievementApiResponse[]> => {
    const response = await posthogFetch(`${apiBaseUrl}/achievements/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Fetching achievements failed";
      throw new Error(message);
    }
    return data as UserAchievementApiResponse[];
  },

  claimAchievement: async (token: string, id: number) => {
    const response = await posthogFetch(
      `${apiBaseUrl}/achievements/redeem/${id}/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Claiming achievement failed";
      throw new Error(message);
    }
    return data as UserAchievementApiResponse;
  },

  updateProfile: async (
    token: string,
    dataForm: {
      display_name: string;
      username: string;
      email: string;
      character: number;
    },
  ) => {
    const response = await posthogFetch(`${apiBaseUrl}/profile/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataForm),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Updating profile failed";
      throw new Error(message);
    }
    return data;
  },

  changePassword: async (
    token: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) => {
    const response = await posthogFetch(`${apiBaseUrl}/auth/change-password/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_new_password: confirmPassword,
      }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Changing password failed";
      throw new Error(message);
    }
    return data;
  },

  getRanking: async (
    token: string,
    level?: string,
    page = 1,
  ): Promise<PaginatedRankingResponse> => {
    const url = new URL(`${apiBaseUrl}/ranking/`);

    // Solo agrego level si está definido
    if (level != null) {
      url.searchParams.append("level", String(level));
    }
    url.searchParams.set("page", String(page));

    const response = await posthogFetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Fetching ranking failed";
      throw new Error(message);
    }

    return data as PaginatedRankingResponse;
  },

  reportRankingName: async (
    token: string,
    userId: number,
    reason: "offensive" | "impersonation" | "other",
  ): Promise<{ message: string }> => {
    const response = await posthogFetch(
      `${apiBaseUrl}/ranking/${userId}/report-name/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      },
    );
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(
        data?.detail ||
          data?.error ||
          data?.message ||
          "No pudimos enviar el reporte.",
      );
    }
    return data as { message: string };
  },

  blockRankingUser: async (token: string, userId: number) => {
    const response = await posthogFetch(
      `${apiBaseUrl}/ranking/${userId}/block/`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.detail || "No pudimos bloquear al usuario.");
    }
    return data as { message: string; is_blocked: true };
  },

  unblockRankingUser: async (token: string, userId: number) => {
    const response = await posthogFetch(
      `${apiBaseUrl}/ranking/${userId}/block/`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.detail || "No pudimos desbloquear al usuario.");
    }
  },

  getBlockedRankingUsers: async (
    token: string,
  ): Promise<BlockedRankingUserApiResponse[]> => {
    const response = await posthogFetch(`${apiBaseUrl}/ranking/blocked/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(
        data?.detail || "No pudimos cargar los usuarios bloqueados.",
      );
    }
    return data as BlockedRankingUserApiResponse[];
  },

  redeemQRCode: async (
    token: string,
    guid: string,
  ): Promise<QRCodeRedemptionApiResponse> => {
    const response = await posthogFetch(`${apiBaseUrl}/qr/redeem/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ guid }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const error = new Error(
        data?.detail || "No pudimos canjear el código.",
      ) as Error & {
        code?: string;
      };
      error.code = data?.code;
      throw error;
    }
    return data as QRCodeRedemptionApiResponse;
  },

  usePowerUp5050: async (
    token: string,
    id: number,
  ): Promise<PowerUp5050ApiResponse> => {
    const response = await posthogFetch(
      `${apiBaseUrl}/quizzes/${id}/powerup/5050/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error ||
        data?.message ||
        data?.detail ||
        response.statusText ||
        "Using power up 5050 failed";
      throw new Error(message);
    }
    return data as PowerUp5050ApiResponse;
  },
};
