import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns initial value when localStorage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    expect(result.current[0]).toBe("default");
  });

  it("returns stored value from localStorage", () => {
    localStorage.setItem("test-key", JSON.stringify("stored"));
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    expect(result.current[0]).toBe("stored");
  });

  it("saves value to localStorage on update", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    act(() => {
      result.current[1]("new-value");
    });
    expect(JSON.parse(localStorage.getItem("test-key")!)).toBe("new-value");
  });

  it("supports functional updates", () => {
    const { result } = renderHook(() =>
      useLocalStorage<number[]>("test-key", [1]),
    );
    act(() => {
      result.current[1]((prev) => [...prev, 2]);
    });
    expect(result.current[0]).toEqual([1, 2]);
  });

  it("handles invalid JSON in localStorage gracefully", () => {
    localStorage.setItem("test-key", "invalid-json");
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    expect(result.current[0]).toBe("default");
  });

  it("syncs with storage events from other tabs", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    // Simulate storage event from another tab
    act(() => {
      const event = new StorageEvent("storage", {
        key: "test-key",
        newValue: JSON.stringify("from-other-tab"),
      });
      window.dispatchEvent(event);
    });

    expect(result.current[0]).toBe("from-other-tab");
  });

  it("ignores storage events for different keys", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));

    act(() => {
      const event = new StorageEvent("storage", {
        key: "different-key",
        newValue: JSON.stringify("other-value"),
      });
      window.dispatchEvent(event);
    });

    expect(result.current[0]).toBe("default");
  });
});
