import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HabitEmoji } from "../components/habitemoji";
import { StackEmoji } from "../components/stackemoji";

export default function StackCard({
  habit,
  dim = false,
}: {
  habit: any;
  dim?: boolean;
}) {
  const [done, setDone] = useState(false);

  return (
    <View style={[styles.card, { backgroundColor: habit.color }]}>
      {dim && <View style={styles.dimOverlay} pointerEvents="none" />}

      <Pressable
        onPress={() => setDone((d) => !d)}
        hitSlop={10}
        style={[styles.circle, done && styles.circleDone]}
      >
        {done && (
          <Ionicons
            name="checkmark"
            size={15}
            color={habit.color}
          />
        )}
      </Pressable>

          <View style={styles.emoji}>
        <StackEmoji emoji={habit.emoji} size={250} />
      </View>

      <View style={{ flex: 1 }} />

      <Text style={styles.title} numberOfLines={2}>
        {habit.title}
      </Text>

      <View style={styles.timePill}>
        <Ionicons
          name="alarm-outline"
          size={14}
          color="rgba(0,0,0,0.6)"
        />
        <Text style={styles.timeText}>
          {habit.time ?? "06:00 - 07:00"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection:"column",
    borderRadius: 85,
    paddingTop: 70,
    paddingBottom:70,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    
  },

  dimOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.32)",
  },

  circle: {
    position: "absolute",
    top: 50,
    right: 45,
    width: 30,
    height: 30,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },

  circleDone: {
    backgroundColor: "#111",
    borderColor: "#111",
  },

  emoji: {
    fontSize: 78,
    marginTop: 6,
  },

  title: {
    fontSize: 30,

    // ✨ Inter Tight Bold (primary emphasis)
    fontFamily: "InterTight_700Bold",

    color: "#111",
    letterSpacing: -0.8,
    marginBottom: 150,
    textAlign: "center",
  },

  timePill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    
   
  },

  timeText: {
    fontSize: 12.5,

    // ✨ Inter Tight Medium (secondary UI text)
    fontFamily: "InterTight_500Medium",

    color: "rgba(0,0,0,0.6)",
  },
});