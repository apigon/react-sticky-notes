import { Canvas } from "./components/Canvas/Canvas";
import { NotesProvider } from "./context/NotesProvider";
import "./App.css";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Tutorial } from "./components/Tutorial";

function App() {
  const [tutorialSeen, setTutorialSeen] = useLocalStorage(
    "tutorialSeen",
    false,
  );

  return (
    <NotesProvider>
      <div className="app">
        <Canvas />
        {!tutorialSeen && <Tutorial onDismiss={() => setTutorialSeen(true)} />}
      </div>
    </NotesProvider>
  );
}

export default App;
