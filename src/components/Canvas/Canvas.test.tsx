import { render, screen, fireEvent } from "@testing-library/react";
import { Canvas } from "./Canvas";
import { NotesProvider } from "../../context/NotesProvider";

const renderCanvas = () => {
  return render(
    <NotesProvider>
      <Canvas />
    </NotesProvider>,
  );
};

describe("Canvas", () => {
  it("renders empty canvas", () => {
    renderCanvas();
    expect(screen.getByTestId("canvas")).toBeInTheDocument();
  });

  it("creates note on click", () => {
    renderCanvas();
    const canvas = screen.getByTestId("canvas");

    fireEvent.click(canvas, { clientX: 100, clientY: 200 });

    expect(screen.getByTestId("note")).toBeInTheDocument();
  });

  it("creates multiple notes on multiple clicks", () => {
    renderCanvas();
    const canvas = screen.getByTestId("canvas");

    fireEvent.click(canvas, { clientX: 100, clientY: 100 });
    // First click outside blurs without creating note
    fireEvent.click(canvas, { clientX: 300, clientY: 300 });
    // Second click creates the new note
    fireEvent.click(canvas, { clientX: 300, clientY: 300 });

    expect(screen.getAllByTestId("note")).toHaveLength(2);
  });

  it("does not create note when clicking on existing note", () => {
    renderCanvas();
    const canvas = screen.getByTestId("canvas");

    fireEvent.click(canvas, { clientX: 100, clientY: 100 });
    const note = screen.getByTestId("note");
    fireEvent.click(note);

    expect(screen.getAllByTestId("note")).toHaveLength(1);
  });

  it("renders trash zone", () => {
    renderCanvas();
    expect(screen.getByTestId("trash-zone")).toBeInTheDocument();
  });

  it("clicking outside newly created note blurs without creating new note", () => {
    renderCanvas();
    const canvas = screen.getByTestId("canvas");

    // Create first note
    fireEvent.click(canvas, { clientX: 100, clientY: 100 });
    expect(screen.getAllByTestId("note")).toHaveLength(1);

    // Click outside - should NOT create a new note (just blur)
    fireEvent.click(canvas, { clientX: 300, clientY: 300 });
    expect(screen.getAllByTestId("note")).toHaveLength(1);

    // Click again - NOW should create a new note
    fireEvent.click(canvas, { clientX: 300, clientY: 300 });
    expect(screen.getAllByTestId("note")).toHaveLength(2);
  });
});
