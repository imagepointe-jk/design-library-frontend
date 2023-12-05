import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { DesignQueryParams, SubcategoryData } from "../types";
import { getSubcategories as getSubcategoriesData } from "../fetch";
import { useSearchParams } from "react-router-dom";
import { parseSearchParams } from "../validations";

type AppContextType = {
  subcategoriesData: SubcategoryData[] | null;
  designQueryParams: DesignQueryParams;
  setDesignQueryParams: (newParams: DesignQueryParams) => void;
};

const AppContext = createContext(null as AppContextType | null);

export function useApp() {
  const context = useContext(AppContext);
  return {
    subcategoriesData: context?.subcategoriesData,
    designQueryParams: context?.designQueryParams,
    setDesignQueryParams: context?.setDesignQueryParams,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [searchParams] = useSearchParams();
  const initialQueryParams = parseSearchParams(searchParams);

  const [subcategoriesData, setSubcategoriesData] = useState(
    null as SubcategoryData[] | null
  );
  const [designQueryParams, setDesignQueryParams] =
    useState(initialQueryParams);

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
        designQueryParams,
        setDesignQueryParams,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
