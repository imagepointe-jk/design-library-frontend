import "./App.css";
import { Routes, Route } from "react-router";
import { DesignLibrary } from "./components/DesignLibrary";
import { Home } from "./components/Home";
import { AppProvider } from "./components/AppProvider";

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/designs/:designNumber?" element={<DesignLibrary />} />
        <Route path="/designs" element={<DesignLibrary />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
