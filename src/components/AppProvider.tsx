import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCategories, getColors, getSubcategories } from "../fetch";
import { CategoryHierarchy } from "../types";
import { DesignModalDisplay } from "./Modal";
import { LightboxData } from "./Lightbox";

type ModalDisplay = "search" | "filters" | DesignModalDisplay | null;

type AppContextType = {
  colors: string[] | null;
  categories: CategoryHierarchy[] | null;
  categoriesLoading: boolean;
  modalDisplay: ModalDisplay;
  setModalDisplay: (newDisplay: ModalDisplay) => void;
  lightboxData: LightboxData | null;
  setLightboxData: (data: LightboxData | null) => void;
};

const AppContext = createContext(null as AppContextType | null);

export function useApp() {
  const context = useContext(AppContext);
  return {
    colors: context?.colors,
    categories: context?.categories,
    categoriesLoading: context?.categoriesLoading,
    modalDisplay: context?.modalDisplay,
    setModalDisplay: context?.setModalDisplay,
    lightboxData: context?.lightboxData,
    setLightboxData: context?.setLightboxData,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState(
    null as CategoryHierarchy[] | null
  );
  const [colors, setColors] = useState(null as string[] | null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [modalDisplay, setModalDisplay] = useState(null as ModalDisplay);
  const [lightboxData, setLightboxData] = useState(null as LightboxData | null);

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
  }, []);

  return (
    <AppContext.Provider
      value={{
        colors,
        categories,
        categoriesLoading,
        modalDisplay,
        setModalDisplay,
        lightboxData: lightboxData,
        setLightboxData: setLightboxData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
