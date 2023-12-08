import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import { getSubcategories as getSubcategoriesData } from "../fetch";
import { DesignQueryParams, SubcategoryData } from "../types";
import { buildDesignQueryParams } from "../utility";
import { parseSearchParams } from "../validations";

type AppContextType = {
  subcategoriesData: SubcategoryData[] | null;
  designQueryParams: DesignQueryParams;
  updateDesignQueryParams: (
    newParams: DesignQueryParams,
    alsoChangeURL?: boolean
  ) => void;
};

const AppContext = createContext(null as AppContextType | null);

export function useApp() {
  const context = useContext(AppContext);
  return {
    subcategoriesData: context?.subcategoriesData,
    designQueryParams: context?.designQueryParams,
    updateDesignQueryParams: context?.updateDesignQueryParams,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
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

  function updateDesignQueryParams(
    newParams: DesignQueryParams,
    alsoChangeURL: boolean = true
  ) {
    setDesignQueryParams(newParams);
    if (alsoChangeURL) setSearchParams(buildDesignQueryParams(newParams));
  }

  useEffect(() => {
    fetchSubcategories();
  }, []);

  return (
    <AppContext.Provider
      value={{
        subcategoriesData,
        designQueryParams,
        updateDesignQueryParams,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
