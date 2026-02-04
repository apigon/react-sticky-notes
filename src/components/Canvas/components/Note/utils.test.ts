import { describe, it, expect, vi } from "vitest";
import type { RefObject } from "react";
import {
  calculateResize,
  rectsIntersect,
  checkTrashIntersection,
  MIN_WIDTH,
  MIN_HEIGHT,
  type ResizeState,
} from "./utils";

function createResizeState(overrides: Partial<ResizeState> = {}): ResizeState {
  return {
    startX: 100,
    startY: 100,
    startWidth: 200,
    startHeight: 150,
    startPosX: 50,
    startPosY: 50,
    resizesNorth: false,
    resizesSouth: false,
    resizesEast: false,
    resizesWest: false,
    ...overrides,
  };
}

describe("calculateResize", () => {
  describe("east resize", () => {
    it("increases width when dragging right", () => {
      const state = createResizeState({ resizesEast: true });
      const result = calculateResize(state, 150, 100);

      expect(result.size.width).toBe(250);
      expect(result.size.height).toBe(150);
      expect(result.position.x).toBe(50);
      expect(result.position.y).toBe(50);
    });

    it("decreases width when dragging left", () => {
      const state = createResizeState({ resizesEast: true });
      const result = calculateResize(state, 50, 100);

      expect(result.size.width).toBe(150);
    });

    it("enforces minimum width", () => {
      const state = createResizeState({ resizesEast: true });
      const result = calculateResize(state, -100, 100);

      expect(result.size.width).toBe(MIN_WIDTH);
    });
  });

  describe("west resize", () => {
    it("increases width and adjusts position when dragging left", () => {
      const state = createResizeState({ resizesWest: true });
      const result = calculateResize(state, 50, 100);

      expect(result.size.width).toBe(250);
      expect(result.position.x).toBe(0);
    });

    it("decreases width and adjusts position when dragging right", () => {
      const state = createResizeState({ resizesWest: true });
      const result = calculateResize(state, 150, 100);

      expect(result.size.width).toBe(150);
      expect(result.position.x).toBe(100);
    });

    it("enforces minimum width and clamps position", () => {
      const state = createResizeState({ resizesWest: true });
      const result = calculateResize(state, 300, 100);

      expect(result.size.width).toBe(MIN_WIDTH);
      expect(result.position.x).toBe(150);
    });
  });

  describe("south resize", () => {
    it("increases height when dragging down", () => {
      const state = createResizeState({ resizesSouth: true });
      const result = calculateResize(state, 100, 150);

      expect(result.size.height).toBe(200);
      expect(result.position.y).toBe(50);
    });

    it("decreases height when dragging up", () => {
      const state = createResizeState({ resizesSouth: true });
      const result = calculateResize(state, 100, 50);

      expect(result.size.height).toBe(100);
    });

    it("enforces minimum height", () => {
      const state = createResizeState({ resizesSouth: true });
      const result = calculateResize(state, 100, -100);

      expect(result.size.height).toBe(MIN_HEIGHT);
    });
  });

  describe("north resize", () => {
    it("increases height and adjusts position when dragging up", () => {
      const state = createResizeState({ resizesNorth: true });
      const result = calculateResize(state, 100, 50);

      expect(result.size.height).toBe(200);
      expect(result.position.y).toBe(0);
    });

    it("decreases height and adjusts position when dragging down", () => {
      const state = createResizeState({ resizesNorth: true });
      const result = calculateResize(state, 100, 150);

      expect(result.size.height).toBe(100);
      expect(result.position.y).toBe(100);
    });

    it("enforces minimum height and clamps position", () => {
      const state = createResizeState({ resizesNorth: true });
      const result = calculateResize(state, 100, 200);

      expect(result.size.height).toBe(MIN_HEIGHT);
      expect(result.position.y).toBe(120);
    });
  });

  describe("corner resize (se)", () => {
    it("resizes both width and height", () => {
      const state = createResizeState({
        resizesSouth: true,
        resizesEast: true,
      });
      const result = calculateResize(state, 150, 150);

      expect(result.size.width).toBe(250);
      expect(result.size.height).toBe(200);
      expect(result.position.x).toBe(50);
      expect(result.position.y).toBe(50);
    });
  });

  describe("corner resize (nw)", () => {
    it("resizes both dimensions and adjusts position", () => {
      const state = createResizeState({
        resizesNorth: true,
        resizesWest: true,
      });
      const result = calculateResize(state, 50, 50);

      expect(result.size.width).toBe(250);
      expect(result.size.height).toBe(200);
      expect(result.position.x).toBe(0);
      expect(result.position.y).toBe(0);
    });
  });

  describe("corner resize (ne)", () => {
    it("resizes width right and height up", () => {
      const state = createResizeState({
        resizesNorth: true,
        resizesEast: true,
      });
      const result = calculateResize(state, 150, 50);

      expect(result.size.width).toBe(250);
      expect(result.size.height).toBe(200);
      expect(result.position.x).toBe(50);
      expect(result.position.y).toBe(0);
    });
  });

  describe("corner resize (sw)", () => {
    it("resizes width left and height down", () => {
      const state = createResizeState({
        resizesSouth: true,
        resizesWest: true,
      });
      const result = calculateResize(state, 50, 150);

      expect(result.size.width).toBe(250);
      expect(result.size.height).toBe(200);
      expect(result.position.x).toBe(0);
      expect(result.position.y).toBe(50);
    });
  });

  describe("no resize direction", () => {
    it("returns original dimensions when no direction set", () => {
      const state = createResizeState();
      const result = calculateResize(state, 200, 200);

      expect(result.size.width).toBe(200);
      expect(result.size.height).toBe(150);
      expect(result.position.x).toBe(50);
      expect(result.position.y).toBe(50);
    });
  });
});

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

describe("checkTrashIntersection", () => {
  function createMockRef<T>(current: T | null): RefObject<T | null> {
    return { current };
  }

  it("returns false when noteElement is null", () => {
    const noteRef = createMockRef<HTMLDivElement>(null);
    const trashRef = createMockRef<HTMLDivElement>(
      document.createElement("div"),
    );

    expect(checkTrashIntersection(noteRef, trashRef)).toBe(false);
  });

  it("returns false when trashElement is null", () => {
    const noteRef = createMockRef<HTMLDivElement>(
      document.createElement("div"),
    );
    const trashRef = createMockRef<HTMLDivElement>(null);

    expect(checkTrashIntersection(noteRef, trashRef)).toBe(false);
  });

  it("returns false when both elements are null", () => {
    const noteRef = createMockRef<HTMLDivElement>(null);
    const trashRef = createMockRef<HTMLDivElement>(null);

    expect(checkTrashIntersection(noteRef, trashRef)).toBe(false);
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

    expect(checkTrashIntersection(noteRef, trashRef)).toBe(true);
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

    expect(checkTrashIntersection(noteRef, trashRef)).toBe(false);
  });
});
