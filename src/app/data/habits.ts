export type HabitEmoji = {
  type: "image";
  value: any; // require() result
};

export type Habit = {
  id: string;
  title: string;
  emoji: HabitEmoji;
  color: string;
  time?: string;
};



export const habits: Habit[] = [
  {
    id: "1",
    title: "Wake up at 7:00AM",
    emoji: { type: "image", value: require("../../../assets/emojis/sun.png") },
    color: "#FFD84D",
    time: "06:00 - 07:00",
  },
  {
    id: "2",
    title: "Do Home Workout",
    emoji: { type: "image", value: require("../../../assets/emojis/dumpbell.png") },
    color: "#FF5A5F",
    time: "06:00 - 07:00",
  },
  {
    id: "3",
    title: "Code an app",
    emoji: { type: "image", value: require("../../../assets/emojis/laptop.png") },
    color: "#3FD0E0",
    time: "06:00 - 07:00",
  },
  {
    id: "4",
    title: "Shoot Content",
    emoji: { type: "image", value: require("../../../assets/emojis/camera.png") },
    color: "#6FE38B",
    time: "06:00 - 07:00",
  },
];