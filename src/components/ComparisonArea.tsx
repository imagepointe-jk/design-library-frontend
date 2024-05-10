import { useEffect, useState } from "react";
import { getDesignsRelatedToId } from "../fetch";
import { TempDesign } from "../sharedTypes";
import {
  clamp,
  createNavigationUrl,
  getDesignDefaultBackgroundColor,
  getFirstHexCodeInString,
  isDesignTransparent,
} from "../utility";
import { useApp } from "./AppProvider";
import { DesignScrollView } from "./DesignScrollView";
import { BackgroundColorChanger } from "./DesignView";
import { LoadingIndicator } from "./LoadingIndicator";
import styles from "./styles/ComparisonArea.module.css";

export function ComparisonArea() {
  const { compareModeData } = useApp();
  const designIds = compareModeData?.selectedIds;

  return (
    <div className={styles["main"]}>
      <div className={styles["heading-container"]}>
        <a className={styles["to-library"]} href={createNavigationUrl("home")}>
          <i className={"fa-solid fa-arrow-left"}></i>To Design Library
        </a>
        <h2>Design Comparison</h2>
      </div>
      <div className={styles["cards-container"]}>
        {designIds &&
          designIds.map((id) => (
            <ComparisonDesignContainer key={id} designId={id} />
          ))}
        {designIds && designIds.length === 0 && (
          <div className={styles["no-designs"]}>No Designs</div>
        )}
      </div>
      <div className={styles["cart-link-container"]}>
        <a href={createNavigationUrl("cart")}>REQUEST QUOTE</a>
      </div>
    </div>
  );
}

type ComparisonDesignContainerProps = {
  designId: number;
};
function ComparisonDesignContainer({
  designId,
}: ComparisonDesignContainerProps) {
  const [relatedDesigns, setRelatedDesigns] = useState(
    null as TempDesign[] | null
  );
  const [loadingStatus, setLoadingStatus] = useState(
    "loading" as "loading" | "error" | "success"
  );
  const [viewedIndex, setViewedIndex] = useState(0);
  const [selectedBgColor, setSelectedBgColor] = useState(null as string | null);
  const { cartData, addDesignsToCart, removeComparisonId } = useApp();

  const viewedDesign = relatedDesigns && relatedDesigns[viewedIndex];
  const multipleDesigns = relatedDesigns ? relatedDesigns.length > 1 : false;

  useEffect(() => {
    getDesignsToDisplay();
  }, []);

  if (!viewedDesign)
    return (
      <div>
        {loadingStatus === "error" && "Error"}
        {loadingStatus === "loading" && <LoadingIndicator />}
      </div>
    );

  const showColorChanger = isDesignTransparent(viewedDesign);
  const isInCart = !!cartData?.designs.find(
    (item) => item.id === viewedDesign.Id
  );
  const defaultBgColor = getDesignDefaultBackgroundColor(viewedDesign);
  let bgColorToUse = getFirstHexCodeInString(selectedBgColor || "");
  if (!bgColorToUse) bgColorToUse = getFirstHexCodeInString(defaultBgColor);
  if (!bgColorToUse) bgColorToUse = "#000000";

  async function getDesignsToDisplay() {
    setLoadingStatus("loading");
    try {
      const related = await getDesignsRelatedToId(designId);
      related.sort((a) => (a.Id === designId ? -1 : 1));
      setRelatedDesigns(related);
      setLoadingStatus("success");
      console.log("success");
    } catch (error) {
      console.error("Error getting related designs: ", error);
      setLoadingStatus("error");
    }
  }

  function clickAddToCart() {
    if (!addDesignsToCart || !viewedDesign) return;

    addDesignsToCart([
      {
        id: viewedDesign.Id,
        designNumber: viewedDesign.DesignNumber,
        garmentColor: selectedBgColor ? selectedBgColor : defaultBgColor,
      },
    ]);
  }

  function onScrollFn(direction: "left" | "right", maxScrollIndex: number) {
    const increment = direction === "left" ? -1 : 1;
    const clampedViewedIndex = clamp(
      viewedIndex + increment,
      0,
      maxScrollIndex
    );
    setViewedIndex(clampedViewedIndex);
    setSelectedBgColor(null);
  }

  return (
    <div className={styles["card"]}>
      <DesignScrollView
        imageUrls={relatedDesigns.map(
          (design) => design.ImageURL || "no image"
        )}
        backgroundColor={bgColorToUse}
        onScrollFn={onScrollFn}
        viewedIndex={viewedIndex}
        showArrowButtons={multipleDesigns}
        showNavGallery={false}
        mainImgContainerClassName={styles["scroll-view-container"]}
      />
      <h3>#{viewedDesign.DesignNumber}</h3>
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
      <button
        className={styles["remove-x"]}
        onClick={() => {
          if (removeComparisonId) removeComparisonId(viewedDesign.Id);
        }}
      >
        X
      </button>
    </div>
  );
}
