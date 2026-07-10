import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function BottomTab({
  viewMode = "grid",
  onToggleView,
}: {
  viewMode?: "grid" | "stack";
  onToggleView?: () => void;
}) {
  // 0 = grid, 1 = stack
  const stackActive = useSharedValue(viewMode === "stack" ? 1 : 0);
  const gridActive = useSharedValue(viewMode === "grid" ? 1 : 0);

  useEffect(() => {
    stackActive.value = withTiming(viewMode === "stack" ? 1 : 0, {
      duration: 250,
    });

    gridActive.value = withTiming(viewMode === "grid" ? 1 : 0, {
      duration: 250,
    });
  }, [viewMode]);

  const stackStyle = useAnimatedStyle(() => ({
    backgroundColor: stackActive.value === 1 ? "#B5B5B5" : "black",
  }));

  const gridStyle = useAnimatedStyle(() => ({
    backgroundColor: gridActive.value === 1 ? "#B5B5B5" : "black",
  }));

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
      <Pressable style={styles.roundBtn}>
        <Ionicons name="add" size={25} color="white" />
      </Pressable>

      <View style={styles.group}>
        <AnimatedPressable
          onPress={onToggleView}
          style={[styles.roundBtn, stackStyle]}
        >
          <Ionicons name="copy" size={25} color="white" />
        </AnimatedPressable>

        <AnimatedPressable
          onPress={onToggleView}
          style={[styles.roundBtn, gridStyle]}
        >
          <Ionicons name="grid" size={25} color="white" />
        </AnimatedPressable>
      </View>

      <Pressable style={styles.roundBtn}>
        <Ionicons name="calendar" size={25} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  roundBtn: {
    width: 70,
    height: "auto",
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 35,
  },
  group: {
    width: "35%",
    height: 70,
    backgroundColor: "black",
    borderRadius: 35,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
});