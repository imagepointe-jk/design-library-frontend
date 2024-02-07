import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCategories, getColors, getSubcategories } from "../fetch";
import { CategoryHierarchy } from "../types";
import { requestParentWindowURL } from "../utility";
import { waitForParentMs } from "../constants";

export type ParentWindowLocation = {
  origin: string;
  url: string;
  pathname: string;
  search: string;
};

type AppContextType = {
  colors: string[] | null;
  categories: CategoryHierarchy[] | null;
  categoriesLoading: boolean;
  waitingForParent: boolean;
  parentWindowLocation: ParentWindowLocation;
};

const AppContext = createContext(null as AppContextType | null);

export function useApp() {
  const context = useContext(AppContext);
  return {
    colors: context?.colors,
    categories: context?.categories,
    categoriesLoading: context?.categoriesLoading,
    waitingForParent: context?.waitingForParent,
    parentWindowLocation: context?.parentWindowLocation,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState(
    null as CategoryHierarchy[] | null
  );
  const [colors, setColors] = useState(null as string[] | null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [waitingForParent, setWaitingForParent] = useState(true);
  const [parentWindowLocation, setParentWindowLocation] = useState({
    origin: "",
    url: "",
    pathname: "",
    search: "",
  });

  async function fetchColors() {
    try {
      const colors = await getColors();
      setColors(colors);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchCategories() {
    try {
      const categories = await getCategories();
      const subcategories = await getSubcategories();
      const categoriesWithHierarchy: CategoryHierarchy[] = categories.map(
        (category) => {
          const categoryHierarchy: CategoryHierarchy = {
            DesignType: category.DesignType,
            Name: category.Name,
            Subcategories: subcategories.filter(
              (subcategory) => subcategory.ParentCategory === category.Name
            ),
          };
          return categoryHierarchy;
        }
      );
      setCategories(categoriesWithHierarchy);
      setCategoriesLoading(false);
    } catch (error) {
      console.error(error);
      setCategoriesLoading(false);
    }
  }

  useEffect(() => {
    fetchColors();
    fetchCategories();

    const handleResponse = (e: MessageEvent) => {
      const allowed = true; //TODO: Actually add allowed origins
      if (!allowed) {
        console.log("Received a message from disallowed origin " + e.origin);
        return;
      }
      if (e.data.type === "design-library-url-retrieve-response") {
        //the parent will sometimes respond to the url request with empty data; ignore when this happens
        const ready =
          e.origin !== "" && e.data.pathname !== "" && e.data.url !== "";
        if (ready) {
          setParentWindowLocation({
            origin: e.origin,
            pathname: e.data.pathname,
            search: e.data.search,
            url: e.data.url,
          });
          clearInterval(requestUrlInterval);
        }
      }
    };

    window.addEventListener("message", handleResponse);
    const requestUrlInterval = setInterval(() => {
      requestParentWindowURL();
    }, 1000);

    setTimeout(() => {
      setWaitingForParent(false);
    }, waitForParentMs);

    return () => {
      window.removeEventListener("message", handleResponse);
      clearInterval(requestUrlInterval);
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        colors,
        categories,
        categoriesLoading,
        waitingForParent,
        parentWindowLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
