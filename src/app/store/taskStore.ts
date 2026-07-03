import { create } from "zustand";
import { habits } from "../data/habits";

export type Task = {
  id: string;
  title: string;
  emoji: string;
  time?: string;
  color: string;
};

type TaskStore = {
  tasks: Task[];

  updateTask: (id: string, data: Partial<Task>) => void;
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: habits,

  updateTask: (id, data) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...data } : t
      ),
    })),
}));