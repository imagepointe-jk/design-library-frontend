import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCategories, getSubcategories } from "../fetch";
import { CategoryHierarchy } from "../types";

type AppContextType = {
  categories: CategoryHierarchy[] | null;
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
    categories: context?.categories,
    parentWindowLocation: context?.parentWindowLocation,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState(
    null as CategoryHierarchy[] | null
  );
  const [parentWindowLocation, setParentWindowLocation] = useState({
    origin: "",
    url: "",
    pathname: "",
    search: "",
  });

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
    } catch (error) {
      console.error(error);
    }
  }

  function handleMessage(e: MessageEvent) {
    const allowed = true; //TODO: Actually add allowed origins
    if (!allowed) {
      console.log("Received a message from disallowed origin " + e.origin);
      return;
    }

    if (e.data.type === "design-library-url-retrieve-response") {
      setParentWindowLocation({
        origin: e.origin,
        pathname: e.data.pathname,
        search: e.data.search,
        url: e.data.url,
      });
    }
  }

  useEffect(() => {
    fetchCategories();
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
        categories,
        parentWindowLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
