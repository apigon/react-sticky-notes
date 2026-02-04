import type { NoteColor } from "../../../../types";

export const NOTE_COLORS: Record<
  NoteColor,
  { background: string; border: string }
> = {
  yellow: { background: "#fff9c4", border: "#f9a825" },
  red: { background: "#ffcdd2", border: "#e57373" },
  blue: { background: "#bbdefb", border: "#64b5f6" },
  green: { background: "#c8e6c9", border: "#81c784" },
  gray: { background: "#f5f5f5", border: "#bdbdbd" },
};

export const COLOR_ORDER: NoteColor[] = [
  "yellow",
  "red",
  "blue",
  "green",
  "gray",
];
