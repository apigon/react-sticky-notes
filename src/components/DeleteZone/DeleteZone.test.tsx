import { render, screen, fireEvent } from "@testing-library/react";
import { Canvas } from "../Canvas/Canvas";
import { NotesProvider } from "../../context/NotesProvider";

describe("TrashZone", () => {
  it("renders trash zone", () => {
    render(
      <NotesProvider>
        <Canvas />
      </NotesProvider>,
    );
    expect(screen.getByTestId("trash-zone")).toBeInTheDocument();
    expect(screen.getByText("Drop to delete")).toBeInTheDocument();
  });

  it("deletes note when dropped on trash zone", () => {
    render(
      <NotesProvider>
        <Canvas />
      </NotesProvider>,
    );

    // Create a note
    const canvas = screen.getByTestId("canvas");
    fireEvent.click(canvas, { clientX: 100, clientY: 100 });
    expect(screen.getByTestId("note")).toBeInTheDocument();

    // Mock getBoundingClientRect for the trash zone
    const trashZone = screen.getByTestId("trash-zone");
    const originalGetBoundingClientRect =
      Element.prototype.getBoundingClientRect;
    trashZone.getBoundingClientRect = vi.fn(() => ({
      left: 500,
      top: 500,
      right: 600,
      bottom: 600,
      width: 100,
      height: 100,
      x: 500,
      y: 500,
      toJSON: () => ({}),
    }));

    // Mock getBoundingClientRect for the note to overlap with trash zone
    const note = screen.getByTestId("note");
    note.getBoundingClientRect = vi.fn(() => ({
      left: 520,
      top: 520,
      right: 720,
      bottom: 670,
      width: 200,
      height: 150,
      x: 520,
      y: 520,
      toJSON: () => ({}),
    }));

    // Drag note to trash zone
    const dragHandle = screen.getByTestId("note-header");
    fireEvent.pointerDown(dragHandle, {
      clientX: 100,
      clientY: 100,
      pointerId: 1,
    });
    fireEvent.pointerMove(dragHandle, {
      clientX: 550,
      clientY: 550,
      pointerId: 1,
    });
    fireEvent.pointerUp(dragHandle, {
      clientX: 550,
      clientY: 550,
      pointerId: 1,
    });

    // Note should be deleted
    expect(screen.queryByTestId("note")).not.toBeInTheDocument();

    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });
});
