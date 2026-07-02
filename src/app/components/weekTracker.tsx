import React from "react";
import { StyleSheet, Text, View } from "react-native";

const days = [
  { day: "M", date: 26, done: true },
  { day: "T", date: 27, done: false },
  { day: "W", date: 28, done: true },
  { day: "T", date: 29, done: true },
  { day: "F", date: 30, done: false, today: true },
  { day: "S", date: 31, done: false },
];

export default function WeekTracker() {
  return (
    <View style={styles.weekContainer}>
      {days.map((item, index) => (
        <View key={index} style={styles.dayItem}>
          
          {item.today && <View style={styles.todayDot} />}

          <Text style={styles.dayText}>
            {item.date}
          </Text>

          <View
            style={[
              styles.indicator,
              { backgroundColor: item.done ? "#48FF00" : "#2A2D2F" },
            ]}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  dayItem: {
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
  },

  todayDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    marginBottom: 2,
  },

  dayText: {
    color: "white",
    fontSize: 14,

    // ✨ Inter Tight Bold
    fontFamily: "InterTight_700Bold",
  
  },

  indicator: {
    width: 27,
    height: 30,
    borderRadius: 7,
  },
});