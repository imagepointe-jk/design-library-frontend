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

type AppContextType = {
  colors: string[] | null;
  categories: CategoryHierarchy[] | null;
  categoriesLoading: boolean;
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
    colors: context?.colors,
    categories: context?.categories,
    categoriesLoading: context?.categoriesLoading,
    parentWindowLocation: context?.parentWindowLocation,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState(
    null as CategoryHierarchy[] | null
  );
  const [colors, setColors] = useState(null as string[] | null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
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

  function handleMessage(e: MessageEvent) {
    const allowed = true; //TODO: Actually add allowed origins
    if (!allowed) {
      console.log("Received a message from disallowed origin " + e.origin);
      return;
    }

    if (e.data.type === "design-library-url-retrieve-response") {
      const ready =
        e.origin !== "" &&
        e.data.pathname !== "" &&
        e.data.search !== "" &&
        e.data.url !== "";
      console.log(
        `Received URL retrieval response; is origin empty? origin = ${
          e.origin
        }, ${e.origin === ""}; is pathname empty? pathname = ${
          e.data.pathname
        }, ${e.data.pathname === ""}; is search empty? search = ${
          e.data.search
        }, ${e.data.search === ""}; is url empty? url = ${e.data.url}, ${
          e.data.url === ""
        }`
      );
      if (ready) {
        setParentWindowLocation({
          origin: e.origin,
          pathname: e.data.pathname,
          search: e.data.search,
          url: e.data.url,
        });
      } else {
        setTimeout(() => {
          requestParentWindowURL();
        }, 1000);
      }
    }
  }

  useEffect(() => {
    fetchColors();
    fetchCategories();
    window.addEventListener("message", handleMessage);
    console.log("requesting parent window url");
    requestParentWindowURL();

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    console.log("Parent window location changed to", parentWindowLocation);
  }, [parentWindowLocation]);

  return (
    <AppContext.Provider
      value={{
        colors,
        categories,
        categoriesLoading,
        parentWindowLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
