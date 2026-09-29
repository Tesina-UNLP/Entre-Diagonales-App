import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type MessageVariant = {
  titleKey: string;
  descriptionKey: string;
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
};

export type DailyMessage = {
  title: string;
  description: string;
  icon: React.ComponentProps<typeof MaterialIcons>["name"];
};

const GENERAL_MESSAGES: MessageVariant[] = [
  {
    titleKey: "home.cityAwaits",
    descriptionKey: "home.cityAwaitsDescription",
    icon: "explore",
  },
  {
    titleKey: "home.lookUp",
    descriptionKey: "home.lookUpDescription",
    icon: "architecture",
  },
  {
    titleKey: "home.takeADiagonal",
    descriptionKey: "home.takeADiagonalDescription",
    icon: "alt-route",
  },
  {
    titleKey: "home.exploreAtYourPace",
    descriptionKey: "home.exploreAtYourPaceDescription",
    icon: "directions-walk",
  },
];

const ACTIVE_TOUR_MESSAGES: MessageVariant[] = [
  {
    titleKey: "home.continueYourTour",
    descriptionKey: "home.continueYourTourDescription",
    icon: "near-me",
  },
  ...GENERAL_MESSAGES,
];

const getDailyIndex = (length: number) => {
  const today = new Date();
  const localDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ).getTime();

  return Math.floor(localDay / 86_400_000) % length;
};

export function useMessageOfTheDay(hasActiveTour = false) {
  const { t } = useTranslation();
  const [rotationOffset, setRotationOffset] = useState(0);
  const variants = hasActiveTour ? ACTIVE_TOUR_MESSAGES : GENERAL_MESSAGES;
  const dailyIndex = getDailyIndex(variants.length);
  const selectedVariant =
    variants[(dailyIndex + rotationOffset) % variants.length];

  const messageOfTheDay = useMemo<DailyMessage>(
    () => ({
      title: t(selectedVariant.titleKey),
      description: t(selectedVariant.descriptionKey),
      icon: selectedVariant.icon,
    }),
    [selectedVariant, t],
  );

  const refreshMessage = useCallback(() => {
    setRotationOffset((current) => (current + 1) % variants.length);
  }, [variants.length]);

  return { messageOfTheDay, refreshMessage };
}
