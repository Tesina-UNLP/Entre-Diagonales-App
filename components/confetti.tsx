import React, {
  createContext,
  PropsWithChildren,
  RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, StyleSheet, useWindowDimensions, View } from "react-native";

type ConfettiHandle = {
  addParticles: (amount: number) => void;
};

type ConfettiProviderProps = PropsWithChildren<{
  colorPalette?: [number, number, number, number][];
  initParticleAmount?: number;
}>;

type Particle = {
  id: number;
  color: string;
  left: number;
  size: number;
  travelX: number;
  duration: number;
  delay: number;
  rotateTo: string;
};

const DEFAULT_PALETTE: [number, number, number, number][] = [
  [247, 163, 64, 1],
  [140, 188, 176, 1],
  [249, 188, 96, 1],
  [38, 90, 85, 1],
];

const ConfettiContext = createContext<RefObject<ConfettiHandle | null> | null>(
  null,
);

const rgba = ([r, g, b, a]: [number, number, number, number]) =>
  `rgba(${r}, ${g}, ${b}, ${a})`;

function ConfettiParticle({
  particle,
  height,
}: {
  particle: Particle;
  height: number;
}) {
  const fall = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fall, {
        toValue: 1,
        delay: particle.delay,
        duration: particle.duration,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        delay: particle.delay + particle.duration * 0.7,
        duration: particle.duration * 0.3,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fall, opacity, particle.delay, particle.duration]);

  const translateY = fall.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, height + 80],
  });

  const translateX = fall.interpolate({
    inputRange: [0, 1],
    outputRange: [0, particle.travelX],
  });

  const rotate = fall.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", particle.rotateTo],
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: particle.left,
          width: particle.size,
          height: particle.size * 1.45,
          backgroundColor: particle.color,
          opacity,
          transform: [{ translateX }, { translateY }, { rotate }],
        },
      ]}
    />
  );
}

export function ConfettiProvider({
  children,
  colorPalette = DEFAULT_PALETTE,
  initParticleAmount = 0,
}: ConfettiProviderProps) {
  const { width, height } = useWindowDimensions();
  const [particles, setParticles] = useState<Particle[]>([]);
  const nextId = useRef(0);

  const addParticles = useCallback(
    (amount: number) => {
      const clampedAmount = Math.min(Math.max(amount, 0), 240);
      const newParticles = Array.from({ length: clampedAmount }, () => {
        const id = nextId.current++;
        const color =
          colorPalette[Math.floor(Math.random() * colorPalette.length)];

        return {
          id,
          color: rgba(color),
          left: Math.random() * width,
          size: 6 + Math.random() * 8,
          travelX: -140 + Math.random() * 280,
          duration: 1300 + Math.random() * 1200,
          delay: Math.random() * 260,
          rotateTo: `${180 + Math.random() * 720}deg`,
        };
      });

      setParticles((current) => [...current, ...newParticles]);

      const maxLifetime = Math.max(
        ...newParticles.map((particle) => particle.duration + particle.delay),
        0,
      );

      setTimeout(() => {
        const ids = new Set(newParticles.map((particle) => particle.id));
        setParticles((current) =>
          current.filter((particle) => !ids.has(particle.id)),
        );
      }, maxLifetime + 120);
    },
    [colorPalette, width],
  );

  const confettiRef = useRef<ConfettiHandle | null>(null);
  confettiRef.current = { addParticles };

  React.useEffect(() => {
    if (initParticleAmount > 0) {
      addParticles(initParticleAmount);
    }
  }, [addParticles, initParticleAmount]);

  const contextValue = useMemo(() => confettiRef, []);

  return (
    <ConfettiContext.Provider value={contextValue}>
      <View style={styles.root}>
        {children}
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {particles.map((particle) => (
            <ConfettiParticle
              key={particle.id}
              particle={particle}
              height={height}
            />
          ))}
        </View>
      </View>
    </ConfettiContext.Provider>
  );
}

export function useConfetti() {
  const confetti = useContext(ConfettiContext);

  if (!confetti) {
    throw new Error("useConfetti must be used within a ConfettiProvider");
  }

  return confetti;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  particle: {
    position: "absolute",
    top: 0,
    borderRadius: 2,
  },
});
