import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import { View } from "react-native";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function CenterBubble({ color, expanded, children }: any) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(expanded ? 1.15 : 1.05, {
        duration: 900,
      }),
      -1,
      true
    );
  }, [expanded]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <Animated.View style={style}>
      <Svg width={120} height={120} viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r="40" fill={color} opacity={0.25} />
        <Circle cx="50" cy="50" r="32" fill={color} opacity={0.9} />
        <Circle cx="38" cy="35" r="10" fill="white" opacity={0.25} />
      </Svg>

      {/* 👇 THIS is the missing piece */}
      <View style={{ position: "absolute", top: 20, left: 20 }}>
        {children}
      </View>
    </Animated.View>
  );
}