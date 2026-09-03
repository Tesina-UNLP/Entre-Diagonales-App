import {
  AccountDeletionPayload,
  AccountDeletionResponse,
  CharacterApiResponse,
  FeedbackApiData,
  IndividualSpotApiResponse,
  LevelApiResponse,
  PowerUp5050ApiResponse,
  QuizApiResponse,
  RankingApiResponse,
  SecretItemApiResponse,
  TourApiResponse,
  TourInfoApiResponse,
  UserAchievementApiResponse,
} from "@/types";

const apiBaseUrl =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://started-circles-tim-optimization.trycloudflare.com/api";

export const api = {
  // login
  login: async (email: string, password: string) => {
    const response = await fetch(`${apiBaseUrl}/auth/login/`, {
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
    const response = await fetch(`${apiBaseUrl}/auth/google/`, {
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
    const response = await fetch(`${apiBaseUrl}/auth/apple/`, {
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
    const response = await fetch(`${apiBaseUrl}/auth/register/`, {
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
    const response = await fetch(`${apiBaseUrl}/profile/account-deletion/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
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
    const response = await fetch(`${apiBaseUrl}/onboarding/`, {
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
    const response = await fetch(`${apiBaseUrl}/auth/password-reset/`, {
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
    const response = await fetch(`${apiBaseUrl}/profile/`, {
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
    const response = await fetch(`${apiBaseUrl}/characters/`, {
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
    const response = await fetch(`${apiBaseUrl}/levels/`, {
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

  getRoutes: async (token: string): Promise<TourApiResponse[]> => {
    const response = await fetch(`${apiBaseUrl}/tours/`, {
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
    return data as TourApiResponse[];
  },

  getRoute: async (token: string, id: number): Promise<TourInfoApiResponse> => {
    const response = await fetch(`${apiBaseUrl}/tours/${id}/`, {
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
    const response = await fetch(`${apiBaseUrl}/tours/start/`, {
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
    const response = await fetch(
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
    const response = await fetch(
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
    const response = await fetch(`${apiBaseUrl}/spots/${id}/`, {
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
    const response = await fetch(`${apiBaseUrl}/quizzes/${id}/`, {
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
    const response = await fetch(
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
    const response = await fetch(`${apiBaseUrl}/tours/${tour_id}/feedback/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
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
    const response = await fetch(`${apiBaseUrl}/secret_items/`, {
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
    const response = await fetch(`${apiBaseUrl}/profile/notifications/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notifications, notification_token: expoToken }),
    });
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
    const response = await fetch(`${apiBaseUrl}/profile/notifications/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notification_token: expoToken }),
    });
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
    const response = await fetch(`${apiBaseUrl}/profile/activity/`, {
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
    const response = await fetch(`${apiBaseUrl}/achievements/`, {
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
    const response = await fetch(`${apiBaseUrl}/achievements/redeem/${id}/`, {
      method: "POST",
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
    const response = await fetch(`${apiBaseUrl}/profile/`, {
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
    const response = await fetch(`${apiBaseUrl}/auth/change-password/`, {
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
  ): Promise<RankingApiResponse[]> => {
    const url = new URL(`${apiBaseUrl}/ranking/`);

    // Solo agrego level si está definido
    if (level != null) {
      url.searchParams.append("level", String(level));
    }

    const response = await fetch(url.toString(), {
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

    return data as RankingApiResponse[];
  },

  reportRankingName: async (
    token: string,
    userId: number,
    reason: "offensive" | "impersonation" | "other",
  ): Promise<{ message: string }> => {
    const response = await fetch(`${apiBaseUrl}/ranking/${userId}/report-name/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(
        data?.detail || data?.error || data?.message || "No pudimos enviar el reporte.",
      );
    }
    return data as { message: string };
  },

  usePowerUp5050: async (
    token: string,
    id: number,
  ): Promise<PowerUp5050ApiResponse> => {
    const response = await fetch(`${apiBaseUrl}/quizzes/${id}/powerup/5050/`, {
      method: "POST",
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
        "Using power up 5050 failed";
      throw new Error(message);
    }
    return data as PowerUp5050ApiResponse;
  },
};
