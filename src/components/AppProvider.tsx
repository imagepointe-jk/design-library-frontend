import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { SubcategoryData } from "../types";
import { getSubcategories as getSubcategoriesData } from "../fetch";

type AppContextType = {
  subcategoriesData: SubcategoryData[] | null;
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  setSelectedCategory: (newCategory: string | null) => void;
  setSelectedSubcategory: (newSubcategory: string | null) => void;
  clickCategory: (
    e: React.ChangeEvent<HTMLInputElement>,
    buttonAssociatedCategory: string
  ) => void;
  clickSubcategory: (
    e: React.ChangeEvent<HTMLInputElement>,
    buttonAssociatedSubcategory: string
  ) => void;
};

const AppContext = createContext(null as AppContextType | null);

export function useApp() {
  const context = useContext(AppContext);
  return {
    subcategoriesData: context?.subcategoriesData,
    selectedCategory: context?.selectedCategory,
    setSelectedCategory: context?.setSelectedCategory,
    selectedSubcategory: context?.selectedSubcategory,
    setSelectedSubcategory: context?.setSelectedSubcategory,
    clickCategory: context?.clickCategory,
    clickSubcategory: context?.clickSubcategory,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [subcategoriesData, setSubcategoriesData] = useState(
    null as SubcategoryData[] | null
  );
  const [selectedCategory, setSelectedCategory] = useState(
    null as string | null
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    null as string | null
  );

  async function fetchSubcategories() {
    try {
      const fetchedSubcategoriesData = await getSubcategoriesData();
      setSubcategoriesData(fetchedSubcategoriesData);
    } catch (error) {
      console.error(error);
    }
  }

  function clickCategory(
    e: React.ChangeEvent<HTMLInputElement>,
    buttonAssociatedCategory: string
  ) {
    if (!setSelectedCategory || !setSelectedSubcategory) return;

    if (!e.target.checked) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(buttonAssociatedCategory);
    }

    setSelectedSubcategory(null);
  }

  function clickSubcategory(
    e: React.ChangeEvent<HTMLInputElement>,
    buttonAssociatedSubcategory: string
  ) {
    if (!setSelectedSubcategory) return;

    if (!e.target.checked) {
      setSelectedSubcategory(null);
    } else {
      setSelectedSubcategory(buttonAssociatedSubcategory);
    }
  }

  useEffect(() => {
    fetchSubcategories();
  }, []);

  return (
    <AppContext.Provider
      value={{
        subcategoriesData,
        selectedCategory,
        setSelectedCategory,
        selectedSubcategory,
        setSelectedSubcategory,
        clickCategory,
        clickSubcategory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
