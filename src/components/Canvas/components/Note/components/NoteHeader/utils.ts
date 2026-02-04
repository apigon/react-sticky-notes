import type { RefObject } from "react";

export function rectsIntersect(a: DOMRect, b: DOMRect): boolean {
  return !(
    a.right < b.left ||
    a.left > b.right ||
    a.bottom < b.top ||
    a.top > b.bottom
  );
}

export function checkDeleteZoneIntersection(
  noteRef: RefObject<HTMLDivElement | null>,
  deleteRef: RefObject<HTMLDivElement | null>,
) {
  if (!noteRef.current || !deleteRef.current) {
    return false;
  }

  const noteRect = noteRef.current.getBoundingClientRect();
  const trashRect = deleteRef.current.getBoundingClientRect();

  return rectsIntersect(noteRect, trashRect);
}
