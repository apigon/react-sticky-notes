export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type NoteColor = "yellow" | "red" | "blue" | "green" | "gray";

export interface Note {
  id: string;
  content: string;
  position: Position;
  size: Size;
  zIndex: number;
  color: NoteColor;
}
