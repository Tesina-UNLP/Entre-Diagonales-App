import { MapStyleElement } from "react-native-maps";

/**
 * Estilo de Google Maps alineado con la paleta oscura de Entre Diagonales.
 * Apple Maps no admite estilos JSON; allí usamos su apariencia oscura nativa.
 */
export const ENTRE_DIAGONALES_MAP_STYLE: MapStyleElement[] = [
  {
    elementType: "geometry",
    stylers: [{ color: "#123634" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#D9ECEB" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#082725" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#639E90" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [{ color: "#0D3E39" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#174A45" }],
  },
  {
    featureType: "poi",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#265A55" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#082725" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3A716A" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#234F4B" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#071F24" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8CBCB0" }],
  },
];
