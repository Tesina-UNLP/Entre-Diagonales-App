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

export const QUALIFICATION_OPTIONS = [
  {
    id: 1,
    label: "Muy mal",
    icon: "emoticon-sad-outline",
  },
  {
    id: 2,
    label: "Mal",
    icon: "emoticon-neutral-outline",
  },
  {
    id: 3,
    label: "Regular",
    icon: "emoticon-happy-outline",
  },
  {
    id: 4,
    label: "Bueno",
    icon: "emoticon-excited-outline",
  },
  {
    id: 5,
    label: "Muy bueno",
    icon: "emoticon-cool-outline",
  },
];

export const FEEDBACK_OPTIONS = [
  {
    id: 1,
    label: "Trivias",
    icon: "help-circle",
  },
  {
    id: 2,
    label: "Secretos",
    icon: "lock",
  },
  {
    id: 3,
    label: "Lugares",
    icon: "map-marker",
  },
  {
    id: 4,
    label: "Mapa",
    icon: "map",
  },
  {
    id: 5,
    label: "Recompensas",
    icon: "gift",
  },
];

export const ACHIEVEMENT_TAGS = [
  {
    id: "todos",
    label: "Todos",
  },
  {
    id: "tour",
    label: "Rutas",
  },
  {
    id: "secret_item",
    label: "Secretos",
  },
  {
    id: "trivia",
    label: "Trivias",
  },
  {
    id: "not-completed",
    label: "No completados",
  },
];
