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
  parentWindowUrl: string;
  parentWindowPathname: string;
  parentWindowSearch: string;
};

const AppContext = createContext(null as AppContextType | null);

export function useApp() {
  const context = useContext(AppContext);
  return {
    subcategoriesData: context?.subcategoriesData,
    parentWindowUrl: context?.parentWindowUrl,
    parentWindowPathname: context?.parentWindowPathname,
    parentWindowSearch: context?.parentWindowSearch,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [subcategoriesData, setSubcategoriesData] = useState(
    null as SubcategoryData[] | null
  );
  const [parentWindowUrl, setParentWindowUrl] = useState("");
  const [parentWindowPathname, setParentWindowPathname] = useState("");
  const [parentWindowSearch, setParentWindowSearch] = useState("");

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
      setParentWindowUrl(e.data.url);
    }
  }

  useEffect(() => {
    fetchSubcategories();
    window.addEventListener("message", handleMessage);
    console.log("Requesting url");
    window.parent.postMessage(
      { type: "design-library-url-retrieve-request" },
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
        parentWindowPathname,
        parentWindowSearch,
        parentWindowUrl,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
