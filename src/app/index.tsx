import React, { useState } from "react";
import GridScreen from "./GridView/GridScreen";
import StackScreen from "./StackView/StackScreen";
import { habits } from "./data/habits";

export default function App() {
  const [viewMode, setViewMode] = useState<"grid" | "stack">("grid");

  return viewMode === "stack" ? (
    <StackScreen habits={habits} onToggleView={() => setViewMode("grid")} />
  ) : (
    <GridScreen onToggleView={() => setViewMode("stack")} />
  );
}