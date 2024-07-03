import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCategories, getColors } from "../fetch";
import { CartData, CartDesign, CompareModeData } from "../types";
import { DesignModalDisplay } from "./Modal";
import { LightboxData } from "./Lightbox";
import { validateCartData, validateCompareModeData } from "../validations";
import { maxComparisonDesigns } from "../constants";
import { Color, DesignCategory } from "../dbSchema";

type ModalDisplay =
  | "search"
  | "filters"
  | "comparison"
  | DesignModalDisplay
  | null;

type AppContextType = {
  colors: Color[] | null;
  categories: DesignCategory[] | null;
  categoriesLoading: boolean;
  modalDisplay: ModalDisplay;
  setModalDisplay: (newDisplay: ModalDisplay) => void;
  lightboxData: LightboxData | null;
  setLightboxData: (data: LightboxData | null) => void;
  compareModeData: CompareModeData;
  tryAddComparisonId: (designId: number, variationId?: number) => boolean;
  removeComparisonId: (designId: number, variationId?: number) => void;
  setCompareModeActive: (state: boolean) => void;
  setCompareModeExpanded: (state: boolean) => void;
  cartData: CartData;
  addDesignsToCart: (designs: CartDesign[]) => void;
  removeDesignFromCart: (designId: number) => void;
  emptyCart: () => void;
  windowWidth: number;
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
    cartData: context?.cartData,
    addDesignsToCart: context?.addDesignsToCart,
    removeDesignFromCart: context?.removeDesignFromCart,
    emptyCart: context?.emptyCart,
    windowWidth: context?.windowWidth,
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
      selectedItems: [],
    };
    return initialCompareModeData;
  }
}

function getInitialCartData() {
  try {
    const fromLocalStorage = localStorage.getItem("design-library-cart-data");
    const parsed = validateCartData(`${fromLocalStorage}`);
    return parsed;
  } catch (_) {
    const initialCartData: CartData = {
      designs: [],
    };
    return initialCartData;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState(null as DesignCategory[] | null);
  const [colors, setColors] = useState(null as Color[] | null);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [modalDisplay, setModalDisplay] = useState(null as ModalDisplay);
  const [lightboxData, setLightboxData] = useState(null as LightboxData | null);
  const [compareModeData, scmd] = useState(getInitialCompareModeData()); //scmd = setCompareModeData. it should ONLY be used in one place.
  const [cartData, scd] = useState(getInitialCartData()); //scd = setCartData. it should ONLY be used in one place.
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  function updateCartData(data: CartData) {
    localStorage.setItem("design-library-cart-data", JSON.stringify(data));
    scd(data);
  }

  function updateCompareModeData(data: CompareModeData) {
    localStorage.setItem("design-library-compare-data", JSON.stringify(data));
    scmd(data);
  }

  function tryAddComparisonId(designId: number, variationId?: number) {
    if (compareModeData.selectedItems.length >= maxComparisonDesigns)
      return false;
    const newCompareModeData: CompareModeData = {
      ...compareModeData,
      selectedItems: [
        ...compareModeData.selectedItems,
        { designId, variationId },
      ],
    };
    updateCompareModeData(newCompareModeData);
    return true;
  }

  function removeComparisonId(designId: number, variationId?: number) {
    const newCompareModeData: CompareModeData = {
      ...compareModeData,
      selectedItems: compareModeData.selectedItems.filter((thisItem) =>
        variationId === undefined
          ? thisItem.designId !== designId
          : thisItem.variationId !== variationId
      ),
    };
    updateCompareModeData(newCompareModeData);
  }

  function setCompareModeActive(state: boolean) {
    const newCompareModeData = {
      ...compareModeData,
      active: state,
    };
    if (state) newCompareModeData.expanded = true;
    updateCompareModeData(newCompareModeData);
  }

  function setCompareModeExpanded(state: boolean) {
    const newCompareModeData = {
      ...compareModeData,
      expanded: state,
    };
    updateCompareModeData(newCompareModeData);
  }

  function addDesignsToCart(designs: CartDesign[]) {
    const designsNotInCart = designs.filter(
      (incomingDesign) =>
        !cartData.designs.find(
          (designInCart) => designInCart.id === incomingDesign.id
        )
    );
    const newArr = [...cartData.designs, ...designsNotInCart];
    const newCartData = {
      ...cartData,
      designs: newArr,
    };
    updateCartData(newCartData);
  }

  function removeDesignFromCart(designId: number) {
    const newCartData = {
      ...cartData,
      designs: cartData.designs.filter((design) => design.id !== designId),
    };
    updateCartData(newCartData);
  }

  function emptyCart() {
    const newCartData: CartData = {
      ...cartData,
      designs: [],
    };
    updateCartData(newCartData);
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
      setCategories(categories);
      setCategoriesLoading(false);
    } catch (error) {
      console.error(error);
      setCategoriesLoading(false);
    }
  }

  function handleResize() {
    setWindowWidth(window.innerWidth);
  }

  useEffect(() => {
    fetchColors();
    fetchCategories();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
        cartData,
        addDesignsToCart,
        removeDesignFromCart,
        emptyCart,
        windowWidth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
