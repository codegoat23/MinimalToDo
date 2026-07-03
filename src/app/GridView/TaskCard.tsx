import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Habit } from "../data/habits";
import { router } from "expo-router";

type Props = {
  habit: Habit;
  rotation?: string;
};

export default function TaskCard({
  habit,
  rotation = "0deg",
}: Props) {
  const [done, setDone] = useState(false);

  return (
  
  <Pressable
    onPress={() =>
      router.push({
        pathname: "/task/[id]",
        params: {
          id: habit.id,
        },
      })
    }
    style={[
      styles.card,
      {
        backgroundColor: habit.color,
        transform: [{ rotate: rotation }],
      },
    ]}
  >
      {/* checkbox */}
      <Pressable
        onPress={() => setDone((d) => !d)}
        hitSlop={10}
        style={[styles.circle, done && styles.circleDone]}
      >
        {done && (
          <Ionicons
            name="checkmark"
            size={13}
            color={habit.color}
          />
        )}
      </Pressable>

      {/* emoji */}
      <Text style={styles.emoji}>{habit.emoji}</Text>

      {/* title */}
      <Text style={styles.title} numberOfLines={2}>
        {habit.title}
      </Text>

      {/* time */}
      <View style={styles.timeRow}>
        <Ionicons
          name="time-outline"
          size={12}
          color="rgba(0,0,0,0.55)"
        />
        <Text style={styles.timeText}>
          {habit.time ?? "06:00 - 07:00"}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "47%",
    height: 320,

    borderRadius: 30,

    paddingHorizontal: 18,
    paddingVertical: 22,

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },

  circle: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  circleDone: {
    backgroundColor: "#111",
    borderColor: "#111",
  },

  emoji: {
    fontSize: 38,
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontFamily: "InterTight_700Bold",
    color: "#111",
    textAlign: "center",
    letterSpacing: -0.6,
    marginBottom: 14,
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  timeText: {
    fontSize: 12,
    fontFamily: "InterTight_500Medium",
    color: "rgba(0,0,0,0.6)",
  },
});