import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCategories, getColors, getSubcategories } from "../fetch";
import { CategoryHierarchy, CompareModeData } from "../types";
import { DesignModalDisplay } from "./Modal";
import { LightboxData } from "./Lightbox";
import { validateCompareModeData } from "../validations";
import { maxComparisonDesigns } from "../constants";

type ModalDisplay = "search" | "filters" | DesignModalDisplay | null;

type AppContextType = {
  colors: string[] | null;
  categories: CategoryHierarchy[] | null;
  categoriesLoading: boolean;
  modalDisplay: ModalDisplay;
  setModalDisplay: (newDisplay: ModalDisplay) => void;
  lightboxData: LightboxData | null;
  setLightboxData: (data: LightboxData | null) => void;
  compareModeData: CompareModeData;
  tryAddComparisonId: (id: number) => void;
  removeComparisonId: (id: number) => void;
  setCompareModeActive: (state: boolean) => void;
  setCompareModeExpanded: (state: boolean) => void;
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
    compareModeData: context?.compareModeData,
    tryAddComparisonId: context?.tryAddComparisonId,
    removeComparisonId: context?.removeComparisonId,
    setCompareModeActive: context?.setCompareModeActive,
    setCompareModeExpanded: context?.setCompareModeExpanded,
  };
}

function getInitialCompareModeData() {
  try {
    const fromLocalStorage = localStorage.getItem(
      "design-library-compare-data"
    );
    const parsed = validateCompareModeData(`${fromLocalStorage}`);
    return parsed;
  } catch (_) {
    const initialCompareModeData: CompareModeData = {
      active: false,
      expanded: true,
      selectedIds: [],
    };
    return initialCompareModeData;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState(
    null as CategoryHierarchy[] | null
  );
  const [colors, setColors] = useState(null as string[] | null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [modalDisplay, setModalDisplay] = useState(null as ModalDisplay);
  const [lightboxData, setLightboxData] = useState(null as LightboxData | null);
  const [compareModeData, scmd] = useState(getInitialCompareModeData()); //scmd = setCompareModeData. it should ONLY be used in one place.

  function updateCompareModeData(data: CompareModeData) {
    localStorage.setItem("design-library-compare-data", JSON.stringify(data));
    scmd(data);
  }

  function tryAddComparisonId(id: number) {
    if (compareModeData.selectedIds.length === maxComparisonDesigns)
      return false;
    const newCompareModeData: CompareModeData = {
      ...compareModeData,
      selectedIds: [...compareModeData.selectedIds, id],
    };
    updateCompareModeData(newCompareModeData);
  }

  function removeComparisonId(id: number) {
    const newCompareModeData: CompareModeData = {
      ...compareModeData,
      selectedIds: compareModeData.selectedIds.filter(
        (thisId) => thisId !== id
      ),
    };
    updateCompareModeData(newCompareModeData);
  }

  function setCompareModeActive(state: boolean) {
    const newCompareModeData = {
      ...compareModeData,
      active: state,
    };
    updateCompareModeData(newCompareModeData);
  }

  function setCompareModeExpanded(state: boolean) {
    const newCompareModeData = {
      ...compareModeData,
      expanded: state,
    };
    updateCompareModeData(newCompareModeData);
  }

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
        compareModeData,
        tryAddComparisonId,
        removeComparisonId,
        setCompareModeActive,
        setCompareModeExpanded,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
