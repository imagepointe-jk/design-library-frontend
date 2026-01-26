import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCategories, getColors } from "../fetch";
import { CartData, CartItem, CompareModeData } from "../types";
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
  addItemsToCart: (designs: CartItem[]) => void;
  removeItemFromCart: (designId: number, variationId?: number) => void;
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
    addDesignsToCart: context?.addItemsToCart,
    removeDesignFromCart: context?.removeItemFromCart,
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
      items: [],
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
      selectedItems: compareModeData.selectedItems.filter(
        (thisItem) =>
          !(
            thisItem.designId === designId &&
            thisItem.variationId === variationId
          )
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

  function addItemsToCart(designs: CartItem[]) {
    const itemsNotInCart = designs.filter(
      (incomingItem) =>
        !cartData.items.find(
          (item) =>
            item.designId === incomingItem.designId &&
            item.variationId === incomingItem.variationId
        )
    );
    const newArr = [...cartData.items, ...itemsNotInCart];
    const newCartData = {
      ...cartData,
      items: newArr,
    };
    updateCartData(newCartData);
  }

  function removeItemFromCart(designId: number, variationId?: number) {
    const newCartData = {
      ...cartData,
      items: cartData.items.filter(
        (item) =>
          !(item.designId === designId && item.variationId === variationId)
      ),
    };
    updateCartData(newCartData);
  }

  function emptyCart() {
    const newCartData: CartData = {
      ...cartData,
      items: [],
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
        addItemsToCart,
        removeItemFromCart,
        emptyCart,
        windowWidth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
