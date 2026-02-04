import { describe, it, expect, vi } from "vitest";
import type { RefObject } from "react";
import { rectsIntersect, checkDeleteZoneIntersection } from "./utils";

function createDOMRect(
  left: number,
  top: number,
  width: number,
  height: number,
): DOMRect {
  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
    x: left,
    y: top,
    toJSON: () => ({}),
  };
}

describe("rectsIntersect", () => {
  it("returns true when rects overlap", () => {
    const a = createDOMRect(0, 0, 100, 100);
    const b = createDOMRect(50, 50, 100, 100);

    expect(rectsIntersect(a, b)).toBe(true);
  });

  it("returns true when one rect contains another", () => {
    const a = createDOMRect(0, 0, 200, 200);
    const b = createDOMRect(50, 50, 50, 50);

    expect(rectsIntersect(a, b)).toBe(true);
  });

  it("returns true when rects share an edge", () => {
    const a = createDOMRect(0, 0, 100, 100);
    const b = createDOMRect(100, 0, 100, 100);

    expect(rectsIntersect(a, b)).toBe(true);
  });

  it("returns false when rect a is to the left of rect b", () => {
    const a = createDOMRect(0, 0, 50, 100);
    const b = createDOMRect(100, 0, 50, 100);

    expect(rectsIntersect(a, b)).toBe(false);
  });

  it("returns false when rect a is to the right of rect b", () => {
    const a = createDOMRect(200, 0, 50, 100);
    const b = createDOMRect(0, 0, 50, 100);

    expect(rectsIntersect(a, b)).toBe(false);
  });

  it("returns false when rect a is above rect b", () => {
    const a = createDOMRect(0, 0, 100, 50);
    const b = createDOMRect(0, 100, 100, 50);

    expect(rectsIntersect(a, b)).toBe(false);
  });

  it("returns false when rect a is below rect b", () => {
    const a = createDOMRect(0, 200, 100, 50);
    const b = createDOMRect(0, 0, 100, 50);

    expect(rectsIntersect(a, b)).toBe(false);
  });
});

describe("checkDeleteZoneIntersection", () => {
  function createMockRef<T>(current: T | null): RefObject<T | null> {
    return { current };
  }

  it("returns false when noteElement is null", () => {
    const noteRef = createMockRef<HTMLDivElement>(null);
    const trashRef = createMockRef<HTMLDivElement>(
      document.createElement("div"),
    );

    expect(checkDeleteZoneIntersection(noteRef, trashRef)).toBe(false);
  });

  it("returns false when trashElement is null", () => {
    const noteRef = createMockRef<HTMLDivElement>(
      document.createElement("div"),
    );
    const trashRef = createMockRef<HTMLDivElement>(null);

    expect(checkDeleteZoneIntersection(noteRef, trashRef)).toBe(false);
  });

  it("returns false when both elements are null", () => {
    const noteRef = createMockRef<HTMLDivElement>(null);
    const trashRef = createMockRef<HTMLDivElement>(null);

    expect(checkDeleteZoneIntersection(noteRef, trashRef)).toBe(false);
  });

  it("returns true when elements intersect", () => {
    const noteEl = document.createElement("div");
    const trashEl = document.createElement("div");

    noteEl.getBoundingClientRect = vi.fn(() => createDOMRect(50, 50, 100, 100));
    trashEl.getBoundingClientRect = vi.fn(() =>
      createDOMRect(100, 100, 100, 100),
    );

    const noteRef = createMockRef(noteEl);
    const trashRef = createMockRef(trashEl);

    expect(checkDeleteZoneIntersection(noteRef, trashRef)).toBe(true);
  });

  it("returns false when elements do not intersect", () => {
    const noteEl = document.createElement("div");
    const trashEl = document.createElement("div");

    noteEl.getBoundingClientRect = vi.fn(() => createDOMRect(0, 0, 50, 50));
    trashEl.getBoundingClientRect = vi.fn(() =>
      createDOMRect(200, 200, 100, 100),
    );

    const noteRef = createMockRef(noteEl);
    const trashRef = createMockRef(trashEl);

    expect(checkDeleteZoneIntersection(noteRef, trashRef)).toBe(false);
  });
});
