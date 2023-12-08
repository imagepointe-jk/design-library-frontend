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
};

const AppContext = createContext(null as AppContextType | null);

export function useApp() {
  const context = useContext(AppContext);
  return {
    subcategoriesData: context?.subcategoriesData,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [subcategoriesData, setSubcategoriesData] = useState(
    null as SubcategoryData[] | null
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
        subcategoriesData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
