export type Habit = {
  id: string;
  title: string;
  emoji: string;
  color: string;
  time?: string;
};

export const habits: Habit[] = [
  { id: "1", title: "Wake up at 7:00AM", emoji: "☀️", color: "#FFD84D", time: "06:00 - 07:00" },
  { id: "2", title: "Do Home Workout", emoji: "💪", color: "#FF5A5F", time: "06:00 - 07:00" },
  { id: "3", title: "Code an app", emoji: "👽", color: "#3FD0E0", time: "06:00 - 07:00" },
  { id: "4", title: "Shoot Content", emoji: "📸", color: "#6FE38B", time: "06:00 - 07:00" },
];