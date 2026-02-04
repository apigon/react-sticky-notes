import { renderHook, act } from '@testing-library/react';
import { useNotes } from './useNotes';
import { NotesProvider } from '../../context/NotesProvider';
import type { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <NotesProvider>{children}</NotesProvider>
);

describe('useNotes', () => {
  it('throws error when used outside NotesProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useNotes());
    }).toThrow('useNotes must be used within a NotesProvider');

    consoleSpy.mockRestore();
  });

  it('returns notes context value', () => {
    const { result } = renderHook(() => useNotes(), { wrapper });

    expect(result.current.notes).toEqual([]);
    expect(typeof result.current.addNote).toBe('function');
    expect(typeof result.current.updateNote).toBe('function');
    expect(typeof result.current.deleteNote).toBe('function');
  });

  it('addNote creates a new note', () => {
    const { result } = renderHook(() => useNotes(), { wrapper });

    act(() => {
      result.current.addNote({ x: 100, y: 200 });
    });

    expect(result.current.notes).toHaveLength(1);
    expect(result.current.notes[0].position).toEqual({ x: 100, y: 200 });
    expect(result.current.notes[0].content).toBe('');
    expect(result.current.notes[0].size).toEqual({ width: 200, height: 150 });
  });

  it('updateNote updates an existing note', () => {
    const { result } = renderHook(() => useNotes(), { wrapper });

    act(() => {
      result.current.addNote({ x: 100, y: 200 });
    });

    const noteId = result.current.notes[0].id;

    act(() => {
      result.current.updateNote(noteId, { content: 'Updated content' });
    });

    expect(result.current.notes[0].content).toBe('Updated content');
  });

  it('deleteNote removes a note', () => {
    const { result } = renderHook(() => useNotes(), { wrapper });

    act(() => {
      result.current.addNote({ x: 100, y: 200 });
    });

    const noteId = result.current.notes[0].id;

    act(() => {
      result.current.deleteNote(noteId);
    });

    expect(result.current.notes).toHaveLength(0);
  });
});
