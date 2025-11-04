import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TOKENS } from "./colors";

export const TAGS = [
  {
    id: "todos",
    label: "Todos",
    icon: (
      <FontAwesome6 name="building-columns" size={14} color={TOKENS.text} />
    ),
  },
  {
    id: "turístico",
    label: "Turístico",
    icon: <FontAwesome6 name="map-location" size={14} color={TOKENS.text} />,
  },
  {
    id: "cultural",
    label: "Cultural",
    icon: <MaterialIcons name="museum" size={14} color={TOKENS.text} />,
  },
  {
    id: "familiar",
    label: "Familiar",
    icon: (
      <MaterialIcons name="family-restroom" size={14} color={TOKENS.text} />
    ),
  },
  {
    id: "gastronomico",
    label: "Gastronómico",
    icon: <FontAwesome6 name="utensils" size={14} color={TOKENS.text} />,
  },
  {
    id: "natural",
    label: "Natural",
    icon: <FontAwesome6 name="leaf" size={14} color={TOKENS.text} />,
  },
];

export const LEVELS = [
  { id: "1", label: "Todos" },
  { id: "2", label: "Fácil", maxSpots: 5 },
  { id: "3", label: "Intermedio", maxSpots: 10 },
  { id: "4", label: "Difícil", maxSpots: 15 },
];
