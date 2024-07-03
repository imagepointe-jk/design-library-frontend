import { useEffect, useState } from "react";
import { Color, Design } from "../dbSchema";
import { createNavigationUrl } from "../query";
import { clamp, isImageTransparent } from "../utility";
import { useApp } from "./AppProvider";
import { DesignScrollView } from "./DesignScrollView";
import { BackgroundColorChanger } from "./DesignView";
import { LoadingIndicator } from "./LoadingIndicator";
import styles from "./styles/ComparisonArea.module.css";
import { getDesignById } from "../fetch";

export function ComparisonArea() {
  const { compareModeData } = useApp();
  const items = compareModeData?.selectedItems;

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
        {items &&
          items.map((item) => (
            <ComparisonDesignContainer
              key={`design-${item.designId}-variation-${item.variationId}`}
              designId={item.designId}
              variationId={item.variationId}
            />
          ))}
        {items && items.length === 0 && (
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
  variationId?: number;
};
function ComparisonDesignContainer({
  designId,
  variationId,
}: ComparisonDesignContainerProps) {
  const [design, setDesign] = useState(null as Design | null);
  const [loadingStatus, setLoadingStatus] = useState(
    "loading" as "loading" | "error" | "success"
  );
  const [viewedIndex, setViewedIndex] = useState(-1); //index of -1 means view the parent design
  const [selectedBgColor, setSelectedBgColor] = useState(null as Color | null);
  const {
    cartData,
    addDesignsToCart,
    removeComparisonId,
    removeDesignFromCart,
  } = useApp();

  const viewedVariation = design ? design.variations[viewedIndex] : undefined;
  const multipleDesigns = design ? design.variations.length > 0 : false;

  useEffect(() => {
    getDesignsToDisplay();
  }, []);

  if (!design)
    return (
      <div>
        {loadingStatus !== "loading" && (
          <div>
            <p>Error.</p>
            <button
              onClick={() => {
                if (removeComparisonId)
                  removeComparisonId(designId, variationId);
              }}
            >
              Remove
            </button>
          </div>
        )}
        {loadingStatus === "loading" && <LoadingIndicator />}
      </div>
    );

  const showColorChanger = isImageTransparent(
    viewedVariation ? viewedVariation.imageUrl : design.imageUrl
  );
  const isInCart = !!cartData?.items.find((item) =>
    viewedVariation
      ? item.variationId === viewedVariation.id
      : item.designId === design.id
  );
  const defaultBgColor = viewedVariation
    ? `#${viewedVariation.color.hexCode}`
    : `#${design.defaultBackgroundColor.hexCode}`;
  let bgColorToUse = selectedBgColor
    ? `#${selectedBgColor.hexCode}`
    : defaultBgColor;

  async function getDesignsToDisplay() {
    setLoadingStatus("loading");
    try {
      const design = await getDesignById(designId);
      const variationsSorted = [...design.variations];
      variationsSorted.sort((a, b) => a.id - b.id);
      design.variations = variationsSorted;
      const indexOfVariation = design.variations.findIndex(
        (variation) => variation.id === variationId
      );
      if (variationId !== undefined && indexOfVariation === -1)
        throw new Error(
          `Variation id ${variationId} not found for design ${designId}.`
        );

      setViewedIndex(indexOfVariation);
      setDesign(design);
      setLoadingStatus("success");
    } catch (error) {
      console.error("Error getting design: ", error);
      setLoadingStatus("error");
    }
  }

  function clickAddToCart() {
    if (!addDesignsToCart || !design) return;

    addDesignsToCart([
      {
        designId: design.id,
        designNumber: `${design.designNumber}`,
        garmentColor: selectedBgColor
          ? `#${selectedBgColor.hexCode}`
          : defaultBgColor,
        variationId: viewedVariation?.id,
      },
    ]);
  }

  function onScrollFn(direction: "left" | "right", maxScrollIndex: number) {
    const increment = direction === "left" ? -1 : 1;
    const clampedViewedIndex = clamp(
      viewedIndex + increment,
      -1,
      maxScrollIndex
    );
    setViewedIndex(clampedViewedIndex);
    setSelectedBgColor(null);
  }

  return (
    <div className={styles["card"]}>
      <DesignScrollView
        imageUrls={[
          design.imageUrl,
          ...design.variations.map((variation) => variation.imageUrl),
        ]}
        backgroundColor={bgColorToUse}
        onScrollFn={onScrollFn}
        viewedIndex={viewedIndex + 1}
        showArrowButtons={multipleDesigns}
        showNavGallery={false}
        mainImgContainerClassName={styles["scroll-view-container"]}
      />
      <h3>#{design.designNumber}</h3>
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
                if (removeDesignFromCart)
                  removeDesignFromCart(design.id, viewedVariation?.id);
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
          if (removeComparisonId) removeComparisonId(designId, variationId);
        }}
      >
        X
      </button>
    </div>
  );
}
