import { Image, Text } from "react-native";

export function HabitEmoji({ emoji, size = 38 }: any) {
  if (emoji?.type === "image") {
    return (
      <Image
        source={emoji.value}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    );
  }

  return <Text style={{ fontSize: size }}>{emoji.value}</Text>;
}