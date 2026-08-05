import { Platform } from "react-native";

export const TAB_BAR_BASE_HEIGHT = Platform.OS === "ios" ? 75 : 70;
export const TAB_BAR_BOTTOM_PADDING = Platform.OS === "ios" ? 0 : 8;
export const TAB_BAR_ITEM_TRANSLATE_Y = Platform.OS === "ios" ? 36 : 0;
export const SCANNER_BUTTON_TOP_OFFSET = -20;
