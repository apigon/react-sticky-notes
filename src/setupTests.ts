import "@testing-library/jest-dom";

// Mock pointer capture APIs not supported by JSDOM
Element.prototype.setPointerCapture = vi.fn();
Element.prototype.releasePointerCapture = vi.fn();

// Clear localStorage before each test to ensure clean state
beforeEach(() => {
  localStorage.clear();
});
