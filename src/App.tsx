import "./App.css";
// import { Routes, Route } from "react-router";
import { DesignLibrary } from "./components/DesignLibrary";
import { Home } from "./components/Home";
import { AppProvider, useApp } from "./components/AppProvider";
import { useEffect } from "react";
import { DesignModal } from "./components/DesignModal";
import { DesignPage } from "./components/DesignPage";

function App() {
  const { parentWindowLocation } = useApp();

  const searchParams = new URLSearchParams(parentWindowLocation?.search);
  const designNumberStr = searchParams.get("designId");
  console.log("got designId from params", designNumberStr);
  const designNumber =
    designNumberStr && !isNaN(+designNumberStr) ? +designNumberStr : undefined;
  // const urlSplit = parentWindowLocation?.url.split(
  //   parentWindowLocation.pathname
  // );
  // const designNumberStr = urlSplit?.length ? urlSplit[1] : undefined;
  // const designNumber =
  //   designNumberStr && !isNaN(+designNumberStr) ? +designNumberStr : undefined;

  const showHome = parentWindowLocation?.pathname === "/design-library-new/";
  const showLibrary =
    parentWindowLocation?.pathname === "/design-library-new-designs/";

  return (
    <>
      {showHome && <Home />}
      {showLibrary && <DesignLibrary />}
      {designNumber && <DesignPage designId={designNumber} />}
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
