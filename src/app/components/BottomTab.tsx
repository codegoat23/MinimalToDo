import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BottomTab({
  viewMode = "grid",
  onToggleView,
}: {
  viewMode?: "grid" | "stack";
  onToggleView?: () => void;
}) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
      <Pressable style={styles.roundBtn}>
        <Ionicons name="add" size={25} color="white" />
      </Pressable>

      <View style={styles.group}>
        <Pressable 
          onPress={onToggleView}
          style={[
            styles.roundBtn,
            { backgroundColor: viewMode === "stack" ? "#B5B5B5" : "black" },
          ]}
        >
          <Ionicons name="copy" size={25} color="white" />
        </Pressable>

        <Pressable
          onPress={onToggleView}
          style={[
            styles.roundBtn,
            { backgroundColor: viewMode === "grid" ? "#B5B5B5" : "black" },
          ]}
        >
          <Ionicons name="grid" size={25} color="white" />
        </Pressable>
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