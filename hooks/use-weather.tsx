import { TOKENS } from "@/constants/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { JSX, useEffect, useState } from "react";

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  isDay: boolean;
  updatedAt: Date;
  wm: { label: string; icon: JSX.Element };
}

// --- Weather code mapping (WMO) → label + emoji icon
const WEATHER_MAP: Record<number, { label: string; icon: JSX.Element }> = {
  0: {
    label: "Despejado",
    icon: <MaterialIcons name="wb-sunny" size={16} color={TOKENS.navActive} />,
  },
  1: {
    label: "Mayormente despejado",
    icon: <MaterialIcons name="wb-sunny" size={16} color={TOKENS.navActive} />,
  },
  2: {
    label: "Parcialmente nublado",
    icon: <MaterialIcons name="cloud" size={16} color={TOKENS.navActive} />,
  },
  3: {
    label: "Nublado",
    icon: <MaterialIcons name="cloud" size={16} color={TOKENS.navActive} />,
  },
  45: {
    label: "Niebla",
    icon: <MaterialIcons name="cloud" size={16} color={TOKENS.navActive} />,
  },
  48: {
    label: "Niebla con escarcha",
    icon: <MaterialIcons name="cloud" size={16} color={TOKENS.navActive} />,
  },
  51: {
    label: "Llovizna ligera",
    icon: (
      <MaterialCommunityIcons
        name="weather-rainy"
        size={16}
        color={TOKENS.navActive}
      />
    ),
  },
  53: {
    label: "Llovizna",
    icon: (
      <MaterialCommunityIcons
        name="weather-rainy"
        size={16}
        color={TOKENS.navActive}
      />
    ),
  },
  55: {
    label: "Llovizna intensa",
    icon: (
      <MaterialCommunityIcons
        name="weather-rainy"
        size={16}
        color={TOKENS.navActive}
      />
    ),
  },
  56: {
    label: "Llovizna helada",
    icon: (
      <MaterialCommunityIcons
        name="weather-rainy"
        size={16}
        color={TOKENS.navActive}
      />
    ),
  },
  57: {
    label: "Llovizna helada",
    icon: (
      <MaterialCommunityIcons
        name="weather-rainy"
        size={16}
        color={TOKENS.navActive}
      />
    ),
  },
  61: {
    label: "Lluvia débil",
    icon: (
      <MaterialCommunityIcons
        name="weather-rainy"
        size={16}
        color={TOKENS.navActive}
      />
    ),
  },
  63: {
    label: "Lluvia",
    icon: (
      <MaterialCommunityIcons
        name="weather-rainy"
        size={16}
        color={TOKENS.navActive}
      />
    ),
  },
  65: {
    label: "Lluvia fuerte",
    icon: (
      <MaterialCommunityIcons
        name="weather-rainy"
        size={16}
        color={TOKENS.navActive}
      />
    ),
  },
  66: {
    label: "Lluvia helada",
    icon: (
      <MaterialCommunityIcons
        name="weather-rainy"
        size={16}
        color={TOKENS.navActive}
      />
    ),
  },
  67: {
    label: "Lluvia helada",
    icon: (
      <MaterialCommunityIcons
        name="weather-rainy"
        size={16}
        color={TOKENS.navActive}
      />
    ),
  },
  71: {
    label: "Nieve ligera",
    icon: (
      <MaterialCommunityIcons
        name="weather-snowy"
        size={16}
        color={TOKENS.navActive}
      />
    ),
  },
  73: {
    label: "Nieve",
    icon: (
      <MaterialCommunityIcons
        name="weather-snowy"
        size={16}
        color={TOKENS.navActive}
      />
    ),
  },
  75: {
    label: "Nieve intensa",
    icon: (
      <MaterialCommunityIcons
        name="weather-snowy"
        size={16}
        color={TOKENS.navActive}
      />
    ),
  },
  77: {
    label: "Granizo fino",
    icon: (
      <MaterialCommunityIcons
        name="weather-hail"
        size={16}
        color={TOKENS.navActive}
      />
    ),
  },
  80: {
    label: "Chaparrones débiles",
    icon: (
      <MaterialCommunityIcons
        name="weather-pouring"
        size={16}
        color={TOKENS.navActive}
      />
    ),
  },
  81: {
    label: "Chaparrones",
    icon: (
      <MaterialCommunityIcons
        name="weather-pouring"
        size={16}
        color={TOKENS.navActive}
      />
    ),
  },
  82: {
    label: "Chaparrones fuertes",
    icon: (
      <MaterialCommunityIcons
        name="weather-pouring"
        size={16}
        color={TOKENS.navActive}
      />
    ),
  },
  85: {
    label: "Chaparrones de nieve débiles",
    icon: (
      <MaterialCommunityIcons
        name="weather-snowy"
        size={16}
        color={TOKENS.navActive}
      />
    ),
  },
  86: {
    label: "Chaparrones de nieve fuertes",
    icon: (
      <MaterialCommunityIcons
        name="weather-snowy"
        size={16}
        color={TOKENS.navActive}
      />
    ),
  },
  95: {
    label: "Tormenta",
    icon: (
      <MaterialCommunityIcons
        name="weather-lightning"
        size={16}
        color={TOKENS.navActive}
      />
    ),
  },
  96: {
    label: "Tormenta con granizo",
    icon: (
      <MaterialCommunityIcons
        name="weather-lightning"
        size={16}
        color={TOKENS.navActive}
      />
    ),
  },
  99: {
    label: "Tormenta con granizo",
    icon: (
      <MaterialCommunityIcons
        name="weather-lightning"
        size={16}
        color={TOKENS.navActive}
      />
    ),
  },
};

const API_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-34.9213&longitude=-57.9544&current=temperature_2m,is_day,precipitation,rain,showers,snowfall,apparent_temperature,weather_code&timezone=America%2FArgentina%2FBuenos_Aires";

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(API_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("No se pudo obtener el clima");
      const json = await res.json();
      const temperature = json?.current?.temperature_2m;
      const weatherCode = json?.current?.weather_code;
      const isDay = json?.current?.is_day === 1;
      const timeStr = json?.current?.time; // ISO
      const updatedAt = timeStr ? new Date(timeStr) : new Date();

      if (typeof temperature !== "number" || typeof weatherCode !== "number") {
        throw new Error("Respuesta inválida del servicio de clima");
      }

      const wm = WEATHER_MAP[weatherCode] || { label: "Condición", icon: "🌡️" };

      setWeather({ temperature, weatherCode, isDay, updatedAt, wm });
    } catch (e: any) {
      setError(e?.message || "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return { weather, isLoading, error, fetchWeather };
};
