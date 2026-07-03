import React, { useState, useCallback } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { useTaskStore } from "../store/taskStore";

export default function TaskDetail() {
  const { tasks, updateTask } = useTaskStore();
  const { id } = useLocalSearchParams();

  const task = tasks.find((t) => t.id === String(id));

  const [title, setTitle] = useState(task?.title || "");
  const [emoji, setEmoji] = useState(task?.emoji || "✨");
  const [isDirty, setIsDirty] = useState(false);

  const emojis = ["😀", "🚀", "🔥", "📚", "💻", "🎮", "🌱", "☕", "🎯", "✨"];
    const [expanded, setExpanded] = useState(false);

  const fonts = {
    medium: "InterTight_500Medium",
    semibold: "InterTight_600SemiBold",
    bold: "InterTight_700Bold",
  };

  // 🧠 Safe color fallback (prevents white wash issues)
  const taskColor = task?.color || "#38bdf8";

  if (!task) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#94a3b8", fontFamily: fonts.medium }}>
          Task not found
        </Text>
      </View>
    );
  }

  // 🎨 safer color blending (prevents washed white look)
  function withTint(hex: string, opacity = 0.14) {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  function saveTask() {
    if(!task) return;
    updateTask(task.id, {
      title,
      emoji,
    });

    setIsDirty(false);
  }

  function handleSave() {
    saveTask();
    router.back();
  }

  // 💾 auto-save on swipe back / leave screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (isDirty) {
          saveTask();
        }
      };
    }, [isDirty, title, emoji])
  );

  return (
    <View style={styles.container}>
      {/* 🌈 COLOR AURA LAYER */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: withTint(taskColor, 0.90),
          },
        ]}
      />

      {/* 🌟 FLOATING GLOW ORB */}
      <View
        style={{
          position: "absolute",
          top: -120,
          left: -80,
          width: 280,
          height: 280,
          borderRadius: 200,
          backgroundColor: taskColor,
          opacity: 0.12,
        }}
      />

      {/* SAVE BUTTON */}
      <Pressable onPress={handleSave} style={styles.saveBtn}>
        <Text style={styles.saveText}>Save Changes</Text>
      </Pressable>

      {/* CENTER CONTENT */}
      <View style={styles.centerContent}>
       {/* 🌟 RADIAL EMOJI PICKER */}
<View style={styles.radialContainer}>
  {/* CENTER BUBBLE */}
  <Pressable
    onPress={() => setExpanded(!expanded)}
    style={[
      styles.centerBubble,
      { backgroundColor: taskColor },
    ]}
  >
    <Text style={styles.centerEmoji}>{emoji}</Text>
  </Pressable>

  {/* SURROUNDING EMOJIS */}
  {emojis.map((e, index) => {
    const angle = (index / emojis.length) * Math.PI * 2;
    const radius = expanded ? 90 : 0;

    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    return (
      <Pressable
        key={e}
        onPress={() => {
          setEmoji(e);
          setIsDirty(true);
          setExpanded(false);
        }}
        style={[
          styles.floatingEmoji,
          {
            transform: [
              { translateX: x },
              { translateY: y },
              { scale: expanded ? 1 : 0 },
            ],
            opacity: expanded ? 1 : 0,
          },
        ]}
      >
        <Text style={{ fontSize: 22 }}>{e}</Text>
      </Pressable>
    );
  })}
</View>

        <TextInput
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            setIsDirty(true);
          }}
          placeholder="Task title..."
          placeholderTextColor="#64748b"
          style={styles.input}
        />

       

        <Text style={styles.time}>
          {task.time ?? "06:00 - 07:00"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1220", // IMPORTANT: keeps contrast so glow doesn't wash out
    paddingHorizontal: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  saveBtn: {
    marginTop: 50,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#111827",
  },

  saveText: {
    color: "#38bdf8",
    fontFamily: "InterTight_600SemiBold",
    fontSize: 14,
  },

  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emoji: {
    fontSize: 60,
    marginBottom: 20,
  },

  input: {
    fontSize: 26,
    color: "#fff",
    textAlign: "center",
    width: "100%",
    marginBottom: 20,
    fontFamily: "InterTight_700Bold",
    letterSpacing: 0.3,
  },

  label: {
    color: "#94a3b8",
    marginBottom: 10,
    fontFamily: "InterTight_500Medium",
    fontSize: 13,
  },

  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },

  emojiBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
  },

  activeBox: {
    borderWidth: 1,
    borderColor: "#38bdf8",
    backgroundColor: "#1f2937",
  },

  emojiSmall: {
    fontSize: 22,
    opacity: 0.6,
  },

  activeEmoji: {
    opacity: 1,
  },

  time: {
    marginTop: 10,
    color: "#64748b",
    fontSize: 13,
    fontFamily: "InterTight_400Regular",
  },
  radialContainer: {
  width: 300,
  height: 300,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 20,
},

centerBubble: {
  width: 200,
  height: 200,
  borderRadius: 100,
  alignItems: "center",
  justifyContent: "center",

  shadowColor: "#000",
  shadowOpacity: 0.3,
  shadowRadius: 10,
  elevation: 7,
},

centerEmoji: {
  fontSize: 70,
},

floatingEmoji: {
  position: "absolute",
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: "#111827",
  alignItems: "center",
  justifyContent: "center",
},
});