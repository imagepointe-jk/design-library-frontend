import "./App.css";
import { Routes, Route } from "react-router";
import { DesignLibrary } from "./components/DesignLibrary";

function App() {
  return (
    <>
      <Routes>
        <Route path="/designs/:designId?" element={<DesignLibrary />} />
        <Route path="/designs" element={<DesignLibrary />} />
      </Routes>
    </>
  );
}

export default App;
