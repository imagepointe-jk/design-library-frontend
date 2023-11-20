import "./App.css";
import { Routes, Route } from "react-router";
import { DesignLibrary } from "./components/DesignLibrary";

function App() {
  return (
    <>
      <Routes>
        <Route path="/:designId?" element={<DesignLibrary />} />
      </Routes>
    </>
  );
}

export default App;
