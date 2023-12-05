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
  setSelectedCategory: (newSubcategory: string | null) => void;
};

const AppContext = createContext(null as AppContextType | null);

export function useApp() {
  const context = useContext(AppContext);
  return {
    subcategoriesData: context?.subcategoriesData,
    selectedCategory: context?.selectedCategory,
    setSelectedCategory: context?.setSelectedCategory,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [subcategoriesData, setSubcategoriesData] = useState(
    null as SubcategoryData[] | null
  );
  const [selectedCategory, setSelectedCategory] = useState(
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

  useEffect(() => {
    fetchSubcategories();
  }, []);

  return (
    <AppContext.Provider
      value={{
        subcategoriesData: subcategoriesData,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
