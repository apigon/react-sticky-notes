## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Vitest** - Unit testing
- **CSS Modules** - Scoped styling

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev


# Run tests
npm test

# Run linter
npm run lint
```

## Architecture

This application follows a component-based architecture with React Context for global state management. The `NotesProvider` wraps the application and exposes note operations (add, update, delete, reorder) through a custom `useNotes` hook. Notes are persisted to localStorage using a reusable `useLocalStorage` hook, ensuring data survives page refreshes and syncs across browser tabs via the storage event API.

The component structure is hierarchical: `Canvas` serves as the main container and handles note creation on click, while individual `Note` components manage their own content editing and resize behavior. The `NoteHeader` component encapsulates drag-and-drop logic along with color cycling and deletion, accessing the notes context directly to perform these operations. This separation keeps each component focused on a single responsibility while maintaining clean data flow through the context.

Styling uses CSS Modules for scoped, collision-free class names. The resize functionality supports all 8 directions (4 edges + 4 corners) through invisible hit zones positioned around each note. Drag-and-drop deletion works by detecting intersection between a dragged note and a trash zone at the bottom of the screen, providing visual feedback when hovering. A first-time tutorial modal guides new users through the available features, shown only once via localStorage persistence.
