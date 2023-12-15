import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getSubcategories as getSubcategoriesData } from "../fetch";
import { SubcategoryData } from "../types";

type AppContextType = {
  subcategoriesData: SubcategoryData[] | null;
  parentWindowLocation: {
    origin: string;
    url: string;
    pathname: string;
    search: string;
  };
};

const AppContext = createContext(null as AppContextType | null);

export function useApp() {
  const context = useContext(AppContext);
  return {
    subcategoriesData: context?.subcategoriesData,
    parentWindowLocation: context?.parentWindowLocation,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [subcategoriesData, setSubcategoriesData] = useState(
    null as SubcategoryData[] | null
  );
  const [parentWindowLocation, setParentWindowLocation] = useState({
    origin: "",
    url: "",
    pathname: "",
    search: "",
  });

  async function fetchSubcategories() {
    try {
      const fetchedSubcategoriesData = await getSubcategoriesData();
      setSubcategoriesData(fetchedSubcategoriesData);
    } catch (error) {
      console.error(error);
    }
  }

  function handleMessage(e: MessageEvent) {
    const allowed = true;
    if (!allowed) {
      console.log("Received a message from disallowed origin " + e.origin);
      return;
    }

    if (e.data.type === "design-library-url-retrieve-response") {
      console.log("Provider received response", e.data.url);
      console.log(e.data.pathname);
      setParentWindowLocation({
        origin: e.origin,
        pathname: e.data.pathname,
        search: e.data.search,
        url: e.data.url,
      });
    }
  }

  useEffect(() => {
    fetchSubcategories();
    window.addEventListener("message", handleMessage);
    window.parent.postMessage(
      {
        type: "design-library-url-retrieve-request",
        originPathname: window.location.pathname,
      },
      "*"
    );

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        subcategoriesData,
        parentWindowLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
