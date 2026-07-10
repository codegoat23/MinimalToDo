import { create } from "zustand";
import { habits } from "../data/habits";

export type Emoji = {
  type: "image";
  value: any; // require() image
};

export type Task = {
  id: string;
  title: string;
  emoji: Emoji;
  time?: string;
  color: string;
};

type TaskStore = {
  tasks: Task[];
  updateTask: (id: string, data: Partial<Task>) => void;
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: habits as Task[],

  updateTask: (id, data) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...data } : t
      ),
    })),
}));