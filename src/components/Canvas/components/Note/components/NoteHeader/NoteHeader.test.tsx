import { render, screen, fireEvent } from "@testing-library/react";
import { NotesProvider } from "../../../../../../context/NotesProvider";
import { Canvas } from "../../../../Canvas";

describe("NoteHeader", () => {
  const renderWithNote = () => {
    render(
      <NotesProvider>
        <Canvas />
      </NotesProvider>,
    );
    const canvas = screen.getByTestId("canvas");
    fireEvent.click(canvas, { clientX: 100, clientY: 100 });
  };

  it("renders color button and delete button", () => {
    renderWithNote();
    expect(screen.getByTestId("color-button")).toBeInTheDocument();
    expect(screen.getByTestId("delete-button")).toBeInTheDocument();
  });

  it("changes note color when color button clicked", () => {
    renderWithNote();
    const note = screen.getByTestId("note");
    const initialBgColor = note.style.backgroundColor;

    fireEvent.click(screen.getByTestId("color-button"));

    expect(note.style.backgroundColor).not.toBe(initialBgColor);
  });

  it("cycles through all colors and back to yellow", () => {
    renderWithNote();
    const colorButton = screen.getByTestId("color-button");

    // Click through all 5 colors (yellow -> red -> blue -> green -> gray -> yellow)
    for (let i = 0; i < 5; i++) {
      fireEvent.click(colorButton);
    }

    const note = screen.getByTestId("note");
    // Should be back to yellow (rgb(255, 249, 196))
    expect(note.style.backgroundColor).toBe("rgb(255, 249, 196)");
  });

  it("deletes note when delete button clicked", () => {
    renderWithNote();
    expect(screen.getByTestId("note")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("delete-button"));

    expect(screen.queryByTestId("note")).not.toBeInTheDocument();
  });

  it("initiates drag when header mousedown", () => {
    renderWithNote();
    const note = screen.getByTestId("note");
    const header = screen.getByTestId("note-header");
    const initialLeft = parseInt(note.style.left);

    fireEvent.mouseDown(header, { clientX: 120, clientY: 120 });
    fireEvent.mouseMove(document, { clientX: 170, clientY: 120 });
    fireEvent.mouseUp(document);

    expect(parseInt(note.style.left)).toBe(initialLeft + 50);
  });

  it("displays color button with correct background color", () => {
    renderWithNote();
    const colorButton = screen.getByTestId("color-button");
    // Yellow border color is #f9a825
    expect(colorButton).toHaveStyle({ backgroundColor: "#f9a825" });
  });
});
