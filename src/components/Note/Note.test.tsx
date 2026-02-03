import { render, screen, fireEvent } from '@testing-library/react';
import { Note } from './Note';
import type { Note as NoteType } from '../../types';

describe('Note', () => {
  const mockNote: NoteType = {
    id: 'test-note-1',
    content: 'Test content',
    position: { x: 100, y: 200 },
    size: { width: 200, height: 150 },
  };

  it('renders with content', () => {
    render(<Note note={mockNote} onUpdate={vi.fn()} />);
    const textarea = screen.getByTestId('note-content');
    expect(textarea).toHaveValue('Test content');
  });

  it('renders at correct position and size', () => {
    render(<Note note={mockNote} onUpdate={vi.fn()} />);
    const note = screen.getByTestId('note');
    expect(note).toHaveStyle({
      left: '100px',
      top: '200px',
      width: '200px',
      height: '150px',
    });
  });

  it('is draggable', () => {
    render(<Note note={mockNote} onUpdate={vi.fn()} />);
    const note = screen.getByTestId('note');
    expect(note).toHaveAttribute('draggable', 'true');
  });

  it('calls onUpdate when content changes', () => {
    const onUpdate = vi.fn();
    render(<Note note={mockNote} onUpdate={onUpdate} />);

    const textarea = screen.getByTestId('note-content');
    fireEvent.change(textarea, { target: { value: 'New content' } });

    expect(onUpdate).toHaveBeenCalledWith('test-note-1', {
      content: 'New content',
    });
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

    render(<Note note={mockNote} onUpdate={vi.fn()} />);
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
    render(<Note note={emptyNote} onUpdate={vi.fn()} />);
    const textarea = screen.getByTestId('note-content');
    expect(textarea).toHaveAttribute('placeholder', 'Type your note...');
  });
});
