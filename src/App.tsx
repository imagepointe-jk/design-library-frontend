import "./App.css";
// import { Routes, Route } from "react-router";
import { DesignLibrary } from "./components/DesignLibrary";
import { Home } from "./components/Home";
import { AppProvider, useApp } from "./components/AppProvider";
import { useEffect } from "react";

function App() {
  const { parentWindowLocation } = useApp();
  console.log("pathname is " + parentWindowLocation?.pathname);
  return (
    <>
      {parentWindowLocation?.pathname === "/design-library-new/" && <Home />}
      {parentWindowLocation?.pathname === "/design-library-new-designs/" && (
        <DesignLibrary />
      )}
    </>
  );
  // return (
  //   <AppProvider>
  //     <Home />
  //     <Routes>
  //       <Route path="/" element={<Home />} />
  //       <Route path="/designs/:designNumber?" element={<DesignLibrary />} />
  //       <Route path="/designs" element={<DesignLibrary />} />
  //     </Routes>
  //   </AppProvider>
  // );
}

export default App;
