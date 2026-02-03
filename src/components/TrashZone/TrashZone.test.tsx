import { render, screen, fireEvent } from '@testing-library/react';
import { TrashZone } from './TrashZone';

describe('TrashZone', () => {
  it('renders trash zone', () => {
    render(<TrashZone onDelete={vi.fn()} />);
    expect(screen.getByTestId('trash-zone')).toBeInTheDocument();
    expect(screen.getByText('Drop to delete')).toBeInTheDocument();
  });

  it('shows active state on drag over', () => {
    render(<TrashZone onDelete={vi.fn()} />);
    const trashZone = screen.getByTestId('trash-zone');

    fireEvent.dragOver(trashZone);

    expect(trashZone.className).toMatch(/active/);
  });

  it('removes active state on drag leave', () => {
    render(<TrashZone onDelete={vi.fn()} />);
    const trashZone = screen.getByTestId('trash-zone');

    fireEvent.dragOver(trashZone);
    expect(trashZone.className).toMatch(/active/);

    fireEvent.dragLeave(trashZone);
    expect(trashZone.className).not.toMatch(/active/);
  });

  it('calls onDelete when note is dropped', () => {
    const onDelete = vi.fn();
    render(<TrashZone onDelete={onDelete} />);
    const trashZone = screen.getByTestId('trash-zone');

    fireEvent.drop(trashZone, {
      dataTransfer: { getData: () => 'note-123' },
    });

    expect(onDelete).toHaveBeenCalledWith('note-123');
  });

  it('removes active state after drop', () => {
    render(<TrashZone onDelete={vi.fn()} />);
    const trashZone = screen.getByTestId('trash-zone');

    fireEvent.dragOver(trashZone);
    expect(trashZone.className).toMatch(/active/);

    fireEvent.drop(trashZone, {
      dataTransfer: { getData: () => 'note-123' },
    });

    expect(trashZone.className).not.toMatch(/active/);
  });
});
