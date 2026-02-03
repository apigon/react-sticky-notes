import { render, screen, fireEvent } from '@testing-library/react';
import { Note } from './Note';
import { NotesProvider } from '../../context/NotesProvider';
import { Canvas } from '../Canvas/Canvas';
import type { Note as NoteType } from '../../types';

const mockNote: NoteType = {
  id: 'test-note-1',
  content: 'Test content',
  position: { x: 100, y: 200 },
  size: { width: 200, height: 150 },
};

const renderNote = (note: NoteType = mockNote) => {
  return render(
    <NotesProvider>
      <Note note={note} />
    </NotesProvider>
  );
};

describe('Note', () => {
  it('renders with content', () => {
    renderNote();
    const textarea = screen.getByTestId('note-content');
    expect(textarea).toHaveValue('Test content');
  });

  it('renders at correct position and size', () => {
    renderNote();
    const note = screen.getByTestId('note');
    expect(note).toHaveStyle({
      left: '100px',
      top: '200px',
      width: '200px',
      height: '150px',
    });
  });

  it('is draggable', () => {
    renderNote();
    const note = screen.getByTestId('note');
    expect(note).toHaveAttribute('draggable', 'true');
  });

  it('updates content when changed', () => {
    // Test with full integration through Canvas
    render(
      <NotesProvider>
        <Canvas />
      </NotesProvider>
    );
    const canvas = screen.getByTestId('canvas');

    // Create a note by clicking on canvas
    fireEvent.click(canvas, { clientX: 100, clientY: 200 });

    const textarea = screen.getByTestId('note-content');
    fireEvent.change(textarea, { target: { value: 'New content' } });

    expect(textarea).toHaveValue('New content');
  });

  it('sets drag data on drag start', () => {
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      left: 100,
      top: 200,
      right: 300,
      bottom: 350,
      width: 200,
      height: 150,
      x: 100,
      y: 200,
      toJSON: () => ({}),
    }));

    renderNote();
    const note = screen.getByTestId('note');
    const setData = vi.fn();

    const dragStartEvent = new Event('dragstart', { bubbles: true });
    Object.defineProperty(dragStartEvent, 'clientX', { value: 120 });
    Object.defineProperty(dragStartEvent, 'clientY', { value: 220 });
    Object.defineProperty(dragStartEvent, 'dataTransfer', {
      value: { setData, effectAllowed: 'move' },
    });

    note.dispatchEvent(dragStartEvent);

    expect(setData).toHaveBeenCalledWith('text/plain', 'test-note-1');
    expect(setData).toHaveBeenCalledWith('offsetX', '20');
    expect(setData).toHaveBeenCalledWith('offsetY', '20');

    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
  });

  it('renders with placeholder when content is empty', () => {
    const emptyNote = { ...mockNote, content: '' };
    renderNote(emptyNote);
    const textarea = screen.getByTestId('note-content');
    expect(textarea).toHaveAttribute('placeholder', 'Type your note...');
  });
});
