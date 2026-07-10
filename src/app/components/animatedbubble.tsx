import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function AnimatedBubble({ color = "#6C5CE7" }) {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.08, { duration: 1200 }),
      -1,
      true
    );

    glow.value = withRepeat(
      withTiming(1, { duration: 900 }),
      -1,
      true
    );
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    r: 45 * scale.value,
    opacity: glow.value,
  }));

  return (
    <Svg width={110} height={110} viewBox="0 0 100 100">
      <AnimatedCircle
        cx="50"
        cy="50"
        fill={color}
        animatedProps={animatedProps}
      />
    </Svg>
  );
}