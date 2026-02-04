import type { RefObject } from "react";

export const MIN_WIDTH = 100;
export const MIN_HEIGHT = 80;

export type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export interface ResizeState {
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startPosX: number;
  startPosY: number;
  resizesNorth: boolean;
  resizesSouth: boolean;
  resizesEast: boolean;
  resizesWest: boolean;
}

export function calculateResize(
  state: ResizeState,
  clientX: number,
  clientY: number,
) {
  const deltaX = clientX - state.startX;
  const deltaY = clientY - state.startY;

  let newWidth = state.startWidth;
  let newHeight = state.startHeight;
  let newPosX = state.startPosX;
  let newPosY = state.startPosY;

  if (state.resizesEast) {
    newWidth = Math.max(MIN_WIDTH, state.startWidth + deltaX);
  }
  if (state.resizesWest) {
    const potentialWidth = state.startWidth - deltaX;
    if (potentialWidth >= MIN_WIDTH) {
      newWidth = potentialWidth;
      newPosX = state.startPosX + deltaX;
    } else {
      newWidth = MIN_WIDTH;
      newPosX = state.startPosX + (state.startWidth - MIN_WIDTH);
    }
  }
  if (state.resizesSouth) {
    newHeight = Math.max(MIN_HEIGHT, state.startHeight + deltaY);
  }
  if (state.resizesNorth) {
    const potentialHeight = state.startHeight - deltaY;
    if (potentialHeight >= MIN_HEIGHT) {
      newHeight = potentialHeight;
      newPosY = state.startPosY + deltaY;
    } else {
      newHeight = MIN_HEIGHT;
      newPosY = state.startPosY + (state.startHeight - MIN_HEIGHT);
    }
  }

  return {
    size: { width: newWidth, height: newHeight },
    position: { x: newPosX, y: newPosY },
  };
}

export function rectsIntersect(a: DOMRect, b: DOMRect): boolean {
  return !(
    a.right < b.left ||
    a.left > b.right ||
    a.bottom < b.top ||
    a.top > b.bottom
  );
}

export function checkTrashIntersection(
  noteElement: RefObject<HTMLDivElement | null>,
  trashElement: RefObject<HTMLDivElement | null>,
) {
  if (!noteElement.current || !trashElement.current) {
    return false;
  }

  const noteRect = noteElement.current.getBoundingClientRect();
  const trashRect = trashElement.current.getBoundingClientRect();

  return rectsIntersect(noteRect, trashRect);
}
