import { useEffect, useState } from "react";
import { useApp } from "./AppProvider";
import styles from "./styles/ComparisonArea.module.css";
import { LoadingIndicator } from "./LoadingIndicator";
import { getDesignById } from "../fetch";
import { TempDesign } from "../sharedTypes";
import { ImageWithFallback } from "./ImageWithFallback";
import {
  createNavigationUrl,
  getDesignDefaultBackgroundColor,
  getFirstHexCodeInString,
  isDesignTransparent,
} from "../utility";
import { BackgroundColorChanger } from "./DesignView";

export function ComparisonArea() {
  const { compareModeData } = useApp();
  const [designs, setDesigns] = useState(null as TempDesign[] | null);
  const [loadingStatus, setLoadingStatus] = useState(
    "loading" as "loading" | "error" | "success"
  );

  async function getDesignsToView() {
    if (!compareModeData) return;
    try {
      const designs = await Promise.all(
        compareModeData.selectedIds.map((id) => getDesignById(id))
      );
      setDesigns(designs);
      setLoadingStatus("success");
    } catch (error) {
      console.error(error);
      setLoadingStatus("error");
    }
  }

  useEffect(() => {
    getDesignsToView();
  }, []);

  return (
    <div className={styles["main"]}>
      <div className={styles["heading-container"]}>
        <a className={styles["to-library"]} href={createNavigationUrl("home")}>
          <i className={"fa-solid fa-arrow-left"}></i>To Design Library
        </a>
        <h2>Design Comparison</h2>
      </div>
      <div className={styles["cards-container"]}>
        {designs &&
          designs.map((design) => (
            <ComparisonDesignContainer design={design} />
          ))}
      </div>
      <div className={styles["cart-link-container"]}>
        <a href={createNavigationUrl("cart")}>REQUEST QUOTE</a>
      </div>
      {loadingStatus === "loading" && <LoadingIndicator />}
    </div>
  );
}

type ComparisonDesignContainerProps = {
  design: TempDesign;
};
function ComparisonDesignContainer({ design }: ComparisonDesignContainerProps) {
  const [selectedBgColor, setSelectedBgColor] = useState(null as string | null);
  const { cartData, addDesignsToCart, removeComparisonId } = useApp();

  const defaultBgColor = getDesignDefaultBackgroundColor(design);
  let bgColorToUse = getFirstHexCodeInString(selectedBgColor || "");
  if (!bgColorToUse) bgColorToUse = getFirstHexCodeInString(defaultBgColor);
  if (!bgColorToUse) bgColorToUse = "#000000";
  const showColorChanger = isDesignTransparent(design);
  const isInCart = !!cartData?.designs.find((item) => item.id === design.Id);

  function clickAddToCart() {
    if (!addDesignsToCart) return;

    addDesignsToCart([
      {
        id: design.Id,
        designNumber: design.DesignNumber,
        garmentColor: selectedBgColor ? selectedBgColor : defaultBgColor,
      },
    ]);
  }

  return (
    <div className={styles["card"]}>
      <ImageWithFallback
        src={design.ImageURL}
        style={{ backgroundColor: bgColorToUse }}
      />
      <h3>#{design.DesignNumber}</h3>
      {showColorChanger && (
        <BackgroundColorChanger
          onClickColor={(color) => setSelectedBgColor(color)}
          selectedColor={selectedBgColor}
        />
      )}
      <div className={styles["cart-button-container"]}>
        {!isInCart && <button onClick={clickAddToCart}>Add to Quote</button>}
        {isInCart && (
          <div>
            <i className="fa-solid fa-check"></i>Added to quote
          </div>
        )}
      </div>
    </div>
  );
}
