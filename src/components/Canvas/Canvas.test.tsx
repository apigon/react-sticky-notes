import { render, screen, fireEvent } from '@testing-library/react';
import { Canvas } from './Canvas';

describe('Canvas', () => {
  it('renders empty canvas', () => {
    render(<Canvas />);
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
  });

  it('creates note on click', () => {
    render(<Canvas />);
    const canvas = screen.getByTestId('canvas');

    fireEvent.click(canvas, { clientX: 100, clientY: 200 });

    expect(screen.getByTestId('note')).toBeInTheDocument();
  });

  it('creates multiple notes on multiple clicks', () => {
    render(<Canvas />);
    const canvas = screen.getByTestId('canvas');

    fireEvent.click(canvas, { clientX: 100, clientY: 100 });
    fireEvent.click(canvas, { clientX: 300, clientY: 300 });

    expect(screen.getAllByTestId('note')).toHaveLength(2);
  });

  it('does not create note when clicking on existing note', () => {
    render(<Canvas />);
    const canvas = screen.getByTestId('canvas');

    fireEvent.click(canvas, { clientX: 100, clientY: 100 });
    const note = screen.getByTestId('note');
    fireEvent.click(note);

    expect(screen.getAllByTestId('note')).toHaveLength(1);
  });

  it('renders trash zone', () => {
    render(<Canvas />);
    expect(screen.getByTestId('trash-zone')).toBeInTheDocument();
  });
});
