import { useEffect, useState } from "react";
import { Color, Design } from "../dbSchema";
// import { getDesignsRelatedToId } from "../fetch";
import { createNavigationUrl } from "../query";
import {
  clamp,
  getDesignDefaultBackgroundColor,
  // isDesignTransparent,
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
      <a
        className={`${styles["to-library"]} ${styles["mobile-only"]}`}
        href={createNavigationUrl("home")}
      >
        <i className={"fa-solid fa-arrow-left"}></i>To Design Library
      </a>
      <div className={styles["heading-container"]}>
        <a
          className={`${styles["to-library"]} ${styles["desktop-only"]}`}
          href={createNavigationUrl("home")}
        >
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
  const [relatedDesigns, setRelatedDesigns] = useState(null as Design[] | null);
  const [loadingStatus, setLoadingStatus] = useState(
    "loading" as "loading" | "error" | "success"
  );
  const [viewedIndex, setViewedIndex] = useState(0);
  const [selectedBgColor, setSelectedBgColor] = useState(null as Color | null);
  const {
    cartData,
    addDesignsToCart,
    removeComparisonId,
    removeDesignFromCart,
  } = useApp();

  const viewedDesign = relatedDesigns && relatedDesigns[viewedIndex];
  const multipleDesigns = relatedDesigns ? relatedDesigns.length > 1 : false;

  useEffect(() => {
    getDesignsToDisplay();
  }, []);

  if (!viewedDesign)
    return (
      <div>
        {loadingStatus === "error" && (
          <div>
            <p>Error.</p>
            <button
              onClick={() => {
                if (removeComparisonId) removeComparisonId(designId);
              }}
            >
              Remove
            </button>
          </div>
        )}
        {loadingStatus === "loading" && <LoadingIndicator />}
      </div>
    );

  const showColorChanger = isDesignTransparent(viewedDesign);
  const isInCart = !!cartData?.designs.find(
    (item) => item.id === viewedDesign.id
  );
  const defaultBgColor = getDesignDefaultBackgroundColor(viewedDesign);
  let bgColorToUse = selectedBgColor
    ? `#${selectedBgColor.hexCode}`
    : undefined;
  if (!bgColorToUse) bgColorToUse = defaultBgColor;
  if (!bgColorToUse) bgColorToUse = "#000000";

  async function getDesignsToDisplay() {
    setLoadingStatus("loading");
    try {
      const related = await getDesignsRelatedToId(designId);
      related.sort((a) => (a.id === designId ? -1 : 1));
      setRelatedDesigns(related);
      setLoadingStatus("success");
    } catch (error) {
      console.error("Error getting related designs: ", error);
      setLoadingStatus("error");
    }
  }

  function clickAddToCart() {
    if (!addDesignsToCart || !viewedDesign) return;

    addDesignsToCart([
      {
        id: viewedDesign.id,
        designNumber: `${viewedDesign.designNumber}`,
        garmentColor: selectedBgColor
          ? `#${selectedBgColor.hexCode}`
          : defaultBgColor,
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
          (design) => design.imageUrl || "no image"
        )}
        backgroundColor={bgColorToUse}
        onScrollFn={onScrollFn}
        viewedIndex={viewedIndex}
        showArrowButtons={multipleDesigns}
        showNavGallery={false}
        mainImgContainerClassName={styles["scroll-view-container"]}
      />
      <h3>#{viewedDesign.designNumber}</h3>
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
            <button
              className={styles["remove-from-cart"]}
              onClick={() => {
                if (removeDesignFromCart) removeDesignFromCart(viewedDesign.id);
              }}
            >
              Remove
            </button>
          </div>
        )}
      </div>
      <button
        className={styles["remove-x"]}
        onClick={() => {
          if (removeComparisonId) removeComparisonId(viewedDesign.id);
        }}
      >
        X
      </button>
    </div>
  );
}
