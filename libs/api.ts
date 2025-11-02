
const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api";

export type CharacterApiResponse = {
  id: number;
  name: string;
  description: string;
  image_url: string;
};

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
        data?.error || data?.message || data?.detail || response.statusText || "Login failed";
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
        data?.error || data?.message || data?.detail || response.statusText || "Google login failed";
      throw new Error(message);
    }
    return data;
  },

  // register
  register: async (email: string, password: string, confirmPassword: string) => {
    const response = await fetch(`${apiBaseUrl}/auth/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, confirm_password: confirmPassword }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error || data?.message || data?.detail || response.statusText || "Registration failed";
      throw new Error(message);
    }
    return data;
  },

  // completar onboarding
  completeOnboarding: async (token: string, character_id: number, notification_token: string) => {
    const response = await fetch(`${apiBaseUrl}/onboarding/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ character: character_id, notification_token }),
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        data?.error || data?.message || data?.detail || response.statusText || "Onboarding completion failed";
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
        data?.error || data?.message || data?.detail || response.statusText || "Forgot password request failed";
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
        data?.error || data?.message || data?.detail || response.statusText || "Fetching profile failed";
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
        data?.error || data?.message || data?.detail || response.statusText || "Fetching characters failed";
      throw new Error(message);
    }
    return data as CharacterApiResponse[];
  }
};
