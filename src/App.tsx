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

  const ownPathname = window.location.pathname.replace("/", "");
  const ownDesignNumber = !isNaN(+ownPathname) ? +ownPathname : undefined;
  const searchParams = new URLSearchParams(parentWindowLocation?.search);
  const parentDesignNumberStr = searchParams.get("designId");
  const parentDesignNumber =
    parentDesignNumberStr && !isNaN(+parentDesignNumberStr)
      ? +parentDesignNumberStr
      : undefined;

  const showHome = parentWindowLocation?.pathname === "/design-library-new/";
  const showLibrary =
    parentWindowLocation?.pathname === "/design-library-new-designs/";
  const designNumberToUse = ownDesignNumber
    ? ownDesignNumber
    : parentDesignNumber;

  return (
    <>
      {showHome && <Home />}
      {!designNumberToUse && showLibrary && <DesignLibrary />}
      {designNumberToUse && <DesignPage designId={designNumberToUse} />}
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
