import "./App.css";
import { useApp } from "./components/AppProvider";
import { DesignLibrary } from "./components/DesignLibrary";
import { DesignPage } from "./components/DesignPage";
import { ErrorPage } from "./components/ErrorScreen";
import { FilterModal } from "./components/FilterModal";
import { TopSection } from "./components/TopSection";
import { LoadingIndicator } from "./components/LoadingIndicator";
import { SearchArea } from "./components/SearchArea";

function App() {
  const { parentWindowLocation, waitingForParent } = useApp();

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
    parentWindowLocation?.pathname === "/design-library-new-designs/" ||
    parentWindowLocation?.pathname === "/design-library-development/";
  const designIdToUse =
    ownDesignId !== undefined ? ownDesignId : parentDesignId;
  const showSearch = ownPathname === "search";
  const showFilters = ownPathname === "filters";

  if (showHome) return <TopSection />;
  else if (showSearch) return <SearchArea />;
  else if (showFilters) return <FilterModal />;
  else if (designIdToUse !== undefined)
    return <DesignPage designId={designIdToUse} />;
  else if (showLibrary) return <DesignLibrary />;
  else if (waitingForParent) return <LoadingIndicator />;
  else return <ErrorPage />;
}

export default App;
