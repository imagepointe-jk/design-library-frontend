import "./App.css";
import { useApp } from "./components/AppProvider";
import { DesignLibrary } from "./components/DesignLibrary";
import { DesignPage } from "./components/DesignPage";
import { FilterModal } from "./components/FilterModal";
import { Home } from "./components/Home";
import { SearchArea } from "./components/SearchArea";

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
  const showSearch = ownPathname === "search";
  const showFilters = ownPathname === "filters";

  if (showHome) return <Home />;
  if (showSearch) return <SearchArea />;
  if (showFilters) return <FilterModal />;
  if (showLibrary) return <DesignLibrary />;
  if (designNumberToUse) return <DesignPage designId={designNumberToUse} />;
}

export default App;
