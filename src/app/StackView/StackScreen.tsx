import React, { useEffect, useState } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  interpolateColor,
  Extrapolation,
  runOnJS,
  FadeInDown,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import BottomTab from "../components/BottomTab";
import WeekTracker from "../components/weekTracker";
import StackCard from "./StackCard";
import { useTaskStore } from "../store/taskStore";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const CARD_WIDTH = SCREEN_WIDTH * 0.72;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.6;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

const PEEK = 380;
const SIDE_WIDTH = CARD_WIDTH * 0.92;
const SIDE_OFFSET = CARD_WIDTH / 2 - SIDE_WIDTH / 2 + PEEK;

export default function StackScreen({ onToggleView }: any) {
  const tasks = useTaskStore((state) => state.tasks);
  const [index, setIndex] = useState(0);

  const panX = useSharedValue(0);
  const pressScale = useSharedValue(1);
  const isAnimating = useSharedValue(false);

  const indexShared = useSharedValue(index);
  const tasksLengthShared = useSharedValue(tasks.length);

  useEffect(() => {
    indexShared.value = index;
  }, [index]);

  useEffect(() => {
    tasksLengthShared.value = tasks.length;
    if (index >= tasks.length) {
      setIndex(Math.max(0, tasks.length - 1));
    }
  }, [tasks]);

  // reset the drag position instantly once the index (and current/next/prev)
  // has actually updated. No animation needed here — by this point the
  // background color has already fully transitioned during the exit swipe,
  // so there's nothing left to visually "catch up" on.
  useEffect(() => {
    panX.value = 0;
  }, [index]);

  const triggerHaptic = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  };

  const advanceIndex = (delta: 1 | -1) => {
    setIndex((i) => {
      const lastIndex = tasksLengthShared.value - 1;
      return Math.max(0, Math.min(lastIndex, i + delta));
    });
    isAnimating.value = false;
    triggerHaptic();
  };

  const completeSwipe = (delta: 1 | -1) => {
    isAnimating.value = true;
    const exitX = delta > 0 ? -SCREEN_WIDTH * 1.2 : SCREEN_WIDTH * 1.2;

    panX.value = withTiming(exitX, { duration: 220 }, (finished) => {
      if (finished) {
        runOnJS(advanceIndex)(delta);
      }
    });
  };

  const reset = () => {
    panX.value = withSpring(0, {
      damping: 18,
      stiffness: 160,
      mass: 0.9,
    });
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-15, 15])
    .onStart(() => {
      "worklet";
      pressScale.value = withSpring(0.97, { damping: 10 });
    })
    .onUpdate((e) => {
      "worklet";

      if (isAnimating.value) return;

      const i = indexShared.value;
      const length = tasksLengthShared.value;

      const hasNext = i < length - 1;
      const hasPrev = i > 0;

      let dx = e.translationX;

      if (dx < 0 && !hasNext) dx *= 0.35;
      if (dx > 0 && !hasPrev) dx *= 0.35;

      panX.value = dx;
    })
    .onEnd((e) => {
      "worklet";

      pressScale.value = withSpring(1, { damping: 10 });

      const i = indexShared.value;
      const length = tasksLengthShared.value;

      const hasNext = i < length - 1;
      const hasPrev = i > 0;

      const vx = e.velocityX;
      const tx = e.translationX;

      const goNext = hasNext && (tx < -SWIPE_THRESHOLD || vx < -800);
      const goPrev = hasPrev && (tx > SWIPE_THRESHOLD || vx > 800);

      if (goNext) {
        runOnJS(completeSwipe)(1);
      } else if (goPrev) {
        runOnJS(completeSwipe)(-1);
      } else {
        runOnJS(reset)();
      }
    });

  const current = tasks?.[index];
  const next = tasks?.[index + 1];
  const prev = tasks?.[index - 1];

  const containerStyle = useAnimatedStyle(() => {
    if (!current) return {};
    const backgroundColor = interpolateColor(
      panX.value,
      [-SCREEN_WIDTH * 0.8, 0, SCREEN_WIDTH * 0.8],
      [
        next ? next.color : current.color,
        current.color,
        prev ? prev.color : current.color,
      ]
    );
    return { backgroundColor };
  });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      panX.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [-9, 0, 9],
      Extrapolation.CLAMP
    );
    return {
      transform: [
        { translateX: panX.value },
        { rotate: `${rotate}deg` },
        { scale: pressScale.value },
      ],
    };
  });

  if (!current) return null;

  return (
    <Animated.View style={[styles.container, containerStyle]}
    
    >
      <View style={styles.darkOverlay} pointerEvents="none" />

      <SafeAreaView style={styles.safe}>
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={styles.DayIndicator}
        >
          <WeekTracker />
        </Animated.View>

        <Animated.View style={styles.stackArea}
        
        >
          {prev && (
            <View
              style={[
                styles.sideCard,
                { width: SIDE_WIDTH, height: CARD_HEIGHT * 0.94 },
                { transform: [{ translateX: -SIDE_OFFSET }, { scale: 0.94 }] },
              ]}
            >
              <StackCard habit={prev} dim />
            </View>
          )}

          {next && (
            <View
              style={[
                styles.sideCard,
                { width: SIDE_WIDTH, height: CARD_HEIGHT * 0.94 },
                { transform: [{ translateX: SIDE_OFFSET }, { scale: 0.94 }] },
              ]}
            >
              <StackCard habit={next} dim />
            </View>
          )}

          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.centerCard, cardStyle]}>
              <StackCard habit={current} />
            </Animated.View>
          </GestureDetector>
        </Animated.View>

        <View style={styles.bottomTab}>
          <BottomTab viewMode="stack" onToggleView={onToggleView} />
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  darkOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  safe: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  stackArea: { flex: 1, justifyContent: "center", alignItems: "center" },
  centerCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    zIndex: 10,
    borderRadius: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 14,
  },
  sideCard: { position: "absolute", zIndex: 1, borderRadius: 100 },
  bottomTab: {
    position: "absolute",
    bottom: 45,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 20,
  },
  DayIndicator: { marginTop: 10 },
});