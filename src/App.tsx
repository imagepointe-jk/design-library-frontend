import { useEffect } from "react";
import "./App.css";
import { useApp } from "./components/AppProvider";
import { DesignLibrary } from "./components/DesignLibrary";
import { DesignPage } from "./components/DesignPage";
import { FilterModal } from "./components/FilterModal";
import { Home } from "./components/Home";
import { SearchArea } from "./components/SearchArea";
import { ErrorPage } from "./components/ErrorScreen";
import { LoadingIndicator } from "./components/LoadingIndicator";

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
    parentWindowLocation?.pathname === "/design-library-new-designs/";
  const designIdToUse = ownDesignId ? ownDesignId : parentDesignId;
  const showSearch = ownPathname === "search";
  const showFilters = ownPathname === "filters";

  if (showHome) return <Home />;
  else if (showSearch) return <SearchArea />;
  else if (showFilters) return <FilterModal />;
  else if (designIdToUse) return <DesignPage designId={designIdToUse} />;
  else if (showLibrary) return <DesignLibrary />;
  else if (waitingForParent) return <LoadingIndicator />;
  else return <ErrorPage />;
}

export default App;
