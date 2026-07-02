import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";

import BottomTab from "../components/BottomTab";
import WeekTracker from "../components/weekTracker";
import StackCard from "./StackCard";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const CARD_WIDTH = SCREEN_WIDTH * 0.7;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.50; // responsive instead of a fixed 550
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

const PEEK = 390; // was 400 — that pushed the side cards almost entirely off-screen
const SIDE_WIDTH = CARD_WIDTH * 0.92;
const SIDE_OFFSET = CARD_WIDTH / 2 - SIDE_WIDTH / 2 + PEEK;

export default function StackScreen({ habits, onToggleView }: any) {
  const [index, setIndex] = useState(0);

  const pan = useRef(new Animated.ValueXY()).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const isAnimating = useRef(false);

  const indexRef = useRef(index);
  const habitsRef = useRef(habits);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);
  useEffect(() => {
    habitsRef.current = habits;
  }, [habits]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        !isAnimating.current &&
        Math.abs(g.dx) > 6 &&
        Math.abs(g.dx) > Math.abs(g.dy),

      onPanResponderGrant: () => {
        Animated.spring(pressScale, {
          toValue: 0.97,
          friction: 7,
          useNativeDriver: false,
        }).start();
      },

      onPanResponderMove: (_, g) => {
        const list = habitsRef.current;
        const i = indexRef.current;
        const hasNext = i < list.length - 1;
        const hasPrev = i > 0;

        let dx = g.dx;
        if (dx < 0 && !hasNext) dx *= 0.3;
        if (dx > 0 && !hasPrev) dx *= 0.3;

        pan.setValue({ x: dx, y: 0 });
      },

      onPanResponderRelease: (_, g) => {
        Animated.spring(pressScale, {
          toValue: 1,
          friction: 7,
          useNativeDriver: false,
        }).start();

        const list = habitsRef.current;
        const i = indexRef.current;
        const hasNext = i < list.length - 1;
        const hasPrev = i > 0;

        if (g.dx < -SWIPE_THRESHOLD && hasNext) {
          completeSwipe(1);
        } else if (g.dx > SWIPE_THRESHOLD && hasPrev) {
          completeSwipe(-1);
        } else {
          reset();
        }
      },
    })
  ).current;

  function completeSwipe(indexDelta: 1 | -1) {
    isAnimating.current = true;
    const exitX = indexDelta > 0 ? -SCREEN_WIDTH * 1.2 : SCREEN_WIDTH * 1.2;

    Animated.timing(pan, {
      toValue: { x: exitX, y: 0 },
      duration: 220,
      useNativeDriver: false,
    }).start(() => {
      pan.setValue({ x: 0, y: 0 });
      setIndex((i) => {
        const lastIndex = habitsRef.current.length - 1;
        return Math.max(0, Math.min(lastIndex, i + indexDelta));
      });
      isAnimating.current = false;
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
    });
  }

  function reset() {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      friction: 7,
      tension: 60,
      useNativeDriver: false,
    }).start();
  }

  const current = habits[index];
  const next = habits[index + 1];
  const prev = habits[index - 1];

  if (!current) return null;

  const backgroundColor = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: [
      next ? next.color : current.color,
      current.color,
      prev ? prev.color : current.color,
    ],
    extrapolate: "clamp",
  });

  const rotate = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
    outputRange: ["-9deg", "0deg", "9deg"],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      {/* dark translucent wash — deepens the vivid color without changing it */}
      <View style={styles.darkOverlay} pointerEvents="none" />

      <SafeAreaView style={styles.safe}>
        <WeekTracker />

        <View style={styles.stackArea}>
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

          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.centerCard,
              {
                transform: [
                  { translateX: pan.x },
                  { rotate },
                  { scale: pressScale },
                ],
              },
            ]}
          >
            <StackCard habit={current} />
          </Animated.View>
        </View>

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

  stackArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  centerCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    zIndex: 10,
    borderRadius: 36,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 14,
  },

  sideCard: {
    position: "absolute",
    zIndex: 1,
    borderRadius: 36,
    
  },

  bottomTab: {
    position: "absolute",
    bottom:45 ,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 20,
  },
});