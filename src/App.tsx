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
  const pathNameSplit = ownPathname.split("/");
  const ownDesignId =
    pathNameSplit[0] && !isNaN(+pathNameSplit[0])
      ? +pathNameSplit[0]
      : undefined;
  const searchParams = new URLSearchParams(parentWindowLocation?.search);
  const parentDesignIdStr = searchParams.get("designId");
  const parentDesignId =
    parentDesignIdStr && !isNaN(+parentDesignIdStr)
      ? +parentDesignIdStr
      : undefined;

  const showHome = parentWindowLocation?.pathname === "/design-library-new/";
  const showLibrary =
    parentWindowLocation?.pathname === "/design-library-new-designs/";
  const designIdToUse = ownDesignId ? ownDesignId : parentDesignId;
  const showSearch = ownPathname === "search";
  const showFilters = ownPathname === "filters";

  if (showHome) return <Home />;
  if (showSearch) return <SearchArea />;
  if (showFilters) return <FilterModal />;
  if (designIdToUse) return <DesignPage designId={designIdToUse} />;
  if (showLibrary) return <DesignLibrary />;
}

export default App;
