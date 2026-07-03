import React from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";

import WeekTracker from "../components/weekTracker";
import BottomTab from "../components/BottomTab";
import TaskCard from "./TaskCard";
import { useTaskStore } from "../store/taskStore";

export default function GridScreen({
  
  onToggleView,
}: {
  onToggleView?: () => void;
}) {
  const habits = useTaskStore((state) => state.tasks);
  // 🎯 rotation pattern (fanned layout)
  const rotations = ["-2deg", "2deg", "2deg", "-2deg"];

  return (
    <SafeAreaView style={styles.container}>
      <WeekTracker />

      <FlatList
        data={habits}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TaskCard
            habit={item}
            rotation={rotations[index % rotations.length]}
          />
        )}
      />

      <View style={styles.bottomTab}>
        <BottomTab
          viewMode="grid"
          onToggleView={onToggleView}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131719",
    paddingHorizontal: 20,
    paddingTop: 70,
  },

  list: {
    paddingBottom: 140,
    paddingTop: 50,
  },

  row: {
    gap:20,
    marginBottom: 30,
    margin:"auto"
  },

  bottomTab: {
    position: "absolute",
    bottom: 45,
    width: "100%",
    paddingHorizontal: 20,
    alignSelf: "center",
  },
});