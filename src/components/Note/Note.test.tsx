import { render, screen, fireEvent } from "@testing-library/react";
import { Note } from "./Note";
import { NotesProvider } from "../../context/NotesProvider";
import { Canvas } from "../Canvas/Canvas";
import type { Note as NoteType } from "../../types";

const mockNote: NoteType = {
  id: "test-note-1",
  content: "Test content",
  position: { x: 100, y: 200 },
  size: { width: 200, height: 150 },
  zIndex: 1,
  color: 'yellow',
};

const renderNote = (note: NoteType = mockNote) => {
  return render(
    <NotesProvider>
      <Note note={note} />
    </NotesProvider>,
  );
};

describe("Note", () => {
  it("renders with content", () => {
    renderNote();
    const textarea = screen.getByTestId("note-content");
    expect(textarea).toHaveValue("Test content");
  });

  it("renders at correct position and size", () => {
    renderNote();
    const note = screen.getByTestId("note");
    expect(note).toHaveStyle({
      left: "100px",
      top: "200px",
      width: "200px",
      height: "150px",
    });
  });

  it("updates content when changed", () => {
    // Test with full integration through Canvas
    render(
      <NotesProvider>
        <Canvas />
      </NotesProvider>,
    );
    const canvas = screen.getByTestId("canvas");

    // Create a note by clicking on canvas
    fireEvent.click(canvas, { clientX: 100, clientY: 200 });

    const textarea = screen.getByTestId("note-content");
    fireEvent.change(textarea, { target: { value: "New content" } });

    expect(textarea).toHaveValue("New content");
  });

  it("moves note on mouse drag", () => {
    render(
      <NotesProvider>
        <Canvas />
      </NotesProvider>,
    );
    const canvas = screen.getByTestId("canvas");
    fireEvent.click(canvas, { clientX: 100, clientY: 100 });

    const note = screen.getByTestId("note");
    const dragHandle = screen.getByTestId("note-header");
    const initialLeft = parseInt(note.style.left);
    const initialTop = parseInt(note.style.top);

    fireEvent.mouseDown(dragHandle, { clientX: 120, clientY: 120 });
    fireEvent.mouseMove(document, { clientX: 170, clientY: 170 });
    fireEvent.mouseUp(document);

    const newLeft = parseInt(note.style.left);
    const newTop = parseInt(note.style.top);
    expect(newLeft).toBe(initialLeft + 50);
    expect(newTop).toBe(initialTop + 50);
  });

  it("renders with placeholder when content is empty", () => {
    const emptyNote = { ...mockNote, content: "" };
    renderNote(emptyNote);
    const textarea = screen.getByTestId("note-content");
    expect(textarea).toHaveAttribute("placeholder", "Type your note...");
  });

  describe("resize zones", () => {
    it("renders all 8 resize zones", () => {
      const { container } = renderNote();

      const resizeClasses = [
        "resizeN",
        "resizeS",
        "resizeE",
        "resizeW",
        "resizeNE",
        "resizeNW",
        "resizeSE",
        "resizeSW",
      ];

      resizeClasses.forEach((className) => {
        const element = container.querySelector(`[class*="${className}"]`);
        expect(element).toBeInTheDocument();
      });
    });

    it("when resizing it updates note dimension", () => {
      render(
        <NotesProvider>
          <Canvas />
        </NotesProvider>,
      );

      const canvas = screen.getByTestId("canvas");
      fireEvent.click(canvas, { clientX: 100, clientY: 100 });

      const note = screen.getByTestId("note");
      const initialWidth = parseInt(note.style.width);

      const resizeHandle = screen.getByTestId("resize-handle");
      fireEvent.mouseDown(resizeHandle, { clientX: 300, clientY: 200 });
      fireEvent.mouseMove(document, { clientX: 350, clientY: 200 });
      fireEvent.mouseUp(document);

      const newWidth = parseInt(note.style.width);
      expect(newWidth).toBeGreaterThan(initialWidth);
    });
  });
});
