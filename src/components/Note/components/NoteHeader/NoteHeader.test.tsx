import { render, screen, fireEvent } from '@testing-library/react';
import { NoteHeader } from './NoteHeader';

describe('NoteHeader', () => {
  const defaultProps = {
    color: 'yellow' as const,
    onDragStart: vi.fn(),
    onColorChange: vi.fn(),
    onDelete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders color button and delete button', () => {
    render(<NoteHeader {...defaultProps} />);
    expect(screen.getByTestId('color-button')).toBeInTheDocument();
    expect(screen.getByTestId('delete-button')).toBeInTheDocument();
  });

  it('calls onColorChange with next color when color button clicked', () => {
    render(<NoteHeader {...defaultProps} />);
    fireEvent.click(screen.getByTestId('color-button'));
    expect(defaultProps.onColorChange).toHaveBeenCalledWith('red');
  });

  it('cycles back to yellow after gray', () => {
    render(<NoteHeader {...defaultProps} color="gray" />);
    fireEvent.click(screen.getByTestId('color-button'));
    expect(defaultProps.onColorChange).toHaveBeenCalledWith('yellow');
  });

  it('calls onDelete when delete button clicked', () => {
    render(<NoteHeader {...defaultProps} />);
    fireEvent.click(screen.getByTestId('delete-button'));
    expect(defaultProps.onDelete).toHaveBeenCalled();
  });

  it('calls onDragStart when header mousedown', () => {
    render(<NoteHeader {...defaultProps} />);
    fireEvent.mouseDown(screen.getByTestId('note-header'));
    expect(defaultProps.onDragStart).toHaveBeenCalled();
  });

  it('displays color button with correct background color', () => {
    render(<NoteHeader {...defaultProps} color="blue" />);
    const colorButton = screen.getByTestId('color-button');
    expect(colorButton).toHaveStyle({ backgroundColor: '#64b5f6' });
  });
});
