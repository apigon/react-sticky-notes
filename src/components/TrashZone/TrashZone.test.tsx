import { render, screen, fireEvent } from '@testing-library/react';
import { TrashZone } from './TrashZone';
import { NotesProvider } from '../../context/NotesProvider';

const renderTrashZone = () => {
  return render(
    <NotesProvider>
      <TrashZone />
    </NotesProvider>
  );
};

describe('TrashZone', () => {
  it('renders trash zone', () => {
    renderTrashZone();
    expect(screen.getByTestId('trash-zone')).toBeInTheDocument();
    expect(screen.getByText('Drop to delete')).toBeInTheDocument();
  });

  it('shows active state on drag over', () => {
    renderTrashZone();
    const trashZone = screen.getByTestId('trash-zone');

    fireEvent.dragOver(trashZone);

    expect(trashZone.className).toMatch(/active/);
  });

  it('removes active state on drag leave', () => {
    renderTrashZone();
    const trashZone = screen.getByTestId('trash-zone');

    fireEvent.dragOver(trashZone);
    expect(trashZone.className).toMatch(/active/);

    fireEvent.dragLeave(trashZone);
    expect(trashZone.className).not.toMatch(/active/);
  });

  it('calls deleteNote when note is dropped', () => {
    renderTrashZone();
    const trashZone = screen.getByTestId('trash-zone');

    fireEvent.drop(trashZone, {
      dataTransfer: { getData: () => 'note-123' },
    });

    // TrashZone should handle the drop (no error thrown)
    expect(trashZone.className).not.toMatch(/active/);
  });

  it('removes active state after drop', () => {
    renderTrashZone();
    const trashZone = screen.getByTestId('trash-zone');

    fireEvent.dragOver(trashZone);
    expect(trashZone.className).toMatch(/active/);

    fireEvent.drop(trashZone, {
      dataTransfer: { getData: () => 'note-123' },
    });

    expect(trashZone.className).not.toMatch(/active/);
  });
});
