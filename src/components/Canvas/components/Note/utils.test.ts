import { describe, it, expect } from "vitest";
import {
  calculateResize,
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
