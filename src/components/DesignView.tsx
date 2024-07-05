import { useEffect, useState } from "react";
import { Color, Design } from "../dbSchema";
import { getDesignById } from "../fetch";
import {
  createNavigationUrl,
  getDefaultQueryParams,
  getModifiedQueryParams,
} from "../query";
import { clamp, isImageTransparent } from "../utility";
import { useApp } from "./AppProvider";
import { DesignScrollView } from "./DesignScrollView";
import { ShareButton } from "./ShareButton";
import styles from "./styles/DesignView.module.css";

type DesignViewProps = {
  designId: number;
  variationId?: number;
};

export function DesignView({ designId, variationId }: DesignViewProps) {
  // const [relatedDesigns, setRelatedDesigns] = useState<Design[] | null>(null);
  const [parentDesign, setParentDesign] = useState<Design | null>(null);
  const [viewedIndex, setViewedIndex] = useState(-1); //view the parent design when index is -1
  const [selectedBgColor, setSelectedBgColor] = useState(null as Color | null); //the color the user has selected to override design's default color
  const { setLightboxData, cartData, addDesignsToCart } = useApp();

  const singleDesign = parentDesign && parentDesign.variations.length === 0;
  // const viewedDesign = relatedDesigns && relatedDesigns[viewedIndex];
  const viewedVariation = parentDesign
    ? parentDesign.variations[viewedIndex]
    : null;
  const viewedBgColor = viewedVariation
    ? `#${viewedVariation.color.hexCode}`
    : parentDesign
    ? `#${parentDesign.defaultBackgroundColor.hexCode}`
    : "white";
  // (viewedDesign && getDesignDefaultBackgroundColor(viewedDesign)) || "white";
  const selectedHexCode = selectedBgColor
    ? `#${selectedBgColor.hexCode}`
    : null;
  const bgColorToUse = selectedHexCode ? selectedHexCode : viewedBgColor;
  // const filters = viewedDesign
  //   ? viewedDesign.designSubcategories.map((sub) => sub.name)
  //   : [];
  const filters = viewedVariation
    ? viewedVariation.designSubcategories.map((sub) => sub.name)
    : parentDesign
    ? parentDesign.designSubcategories.map((sub) => sub.name)
    : [];
  const tags = viewedVariation
    ? viewedVariation.designTags.map((tag) => tag.name)
    : parentDesign
    ? parentDesign.designTags.map((tag) => tag.name)
    : [];
  // const tags = viewedDesign
  //   ? getDesignTags(viewedDesign).filter((sub) => sub !== undefined)
  //   : [];
  const images = parentDesign
    ? [
        parentDesign.imageUrl,
        ...parentDesign.variations.map((variation) => variation.imageUrl),
      ]
    : [];
  const viewedDesignHasTransparency = viewedVariation
    ? isImageTransparent(viewedVariation.imageUrl)
    : parentDesign
    ? isImageTransparent(parentDesign.imageUrl)
    : false;
  // const viewedDesignHasTransparency = viewedDesign
  //   ? isDesignTransparent(viewedDesign)
  //   : false;
  const showColorChangeSection =
    parentDesign &&
    parentDesign.designType.name === "Screen Print" &&
    viewedDesignHasTransparency;
  // const showColorChangeSection =
  //   relatedDesigns &&
  //   relatedDesigns[0].designType.name === "Screen Print" &&
  //   viewedDesignHasTransparency;
  const defaultQueryParams = getDefaultQueryParams().stringified;
  const similarDesignsParams = getModifiedQueryParams(
    defaultQueryParams,
    "similarTo",
    `${designId}`
  ).stringified;
  const similarDesignsUrl = `${window.location.origin}${window.location.pathname}?${similarDesignsParams}`;
  const isDesignInCart = cartData?.items.find(
    (item) =>
      item.designId === parentDesign?.id &&
      item.variationId === viewedVariation?.id
  );
  // const isDesignInCart = cartData?.designs.find(
  //   (design) => viewedDesign?.id === design.id
  // );

  async function getDesignWithVariations() {
    try {
      // const related = await getDesignsRelatedToId(designId);
      // related.sort((a) => (a.id === designId ? -1 : 1));
      // setRelatedDesigns(related);
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
      setParentDesign(design);
    } catch (error) {
      console.error("Error getting design: ", error);
    }
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

  function onClickColor(clickedColor: Color) {
    setSelectedBgColor(clickedColor);
  }

  function clickQuoteButton() {
    if (!addDesignsToCart || !parentDesign) return;

    if (!isDesignInCart) {
      // const viewedDesign = relatedDesigns[viewedIndex];
      //if they actually clicked a non-default color, use that.
      //if not, check if the viewed design has transparency (and therefore had color picking options).
      //if it didn't, don't assume the user wanted the background color that was displayed to them. Assign a message accordingly.
      //if it did, assume the user was fine with the default background color, and assign that.

      const colorToAddToCart = selectedBgColor
        ? `#${selectedBgColor.hexCode}`
        : viewedDesignHasTransparency && viewedVariation
        ? `#${viewedVariation.color.hexCode}`
        : viewedDesignHasTransparency
        ? `#${parentDesign.defaultBackgroundColor.hexCode}`
        : "Color picking unavailable for this design.";
      addDesignsToCart([
        {
          designId: parentDesign.id,
          designNumber: `${parentDesign.designNumber}`,
          garmentColor: colorToAddToCart,
          variationId: viewedVariation ? viewedVariation.id : undefined,
        },
      ]);
      window.location.href = createNavigationUrl("cart");
    } else console.log("go to cart");
  }

  useEffect(() => {
    getDesignWithVariations();
  }, []);

  return (
    <>
      {parentDesign && (
        <>
          <h3 className={styles["customize-notice"]}>
            This design is customizable to your union and local.
          </h3>
          <div className={styles["main-flex"]}>
            <h2
              className={`${styles["heading"]} ${styles["mobile-only"]}`}
            >{`#${parentDesign.designNumber}`}</h2>
            <div className={styles["gallery-container"]}>
              <div className={styles["gizmos-container"]}>
                {/* temp share button id */}
                <ShareButton
                  designId={parentDesign.id}
                  variationId={viewedVariation?.id}
                />
                <button
                  className={styles["zoom-button"]}
                  onClick={() => {
                    if (setLightboxData) {
                      setLightboxData({
                        images: [
                          {
                            url: parentDesign.imageUrl,
                            backgroundColor: `#${parentDesign.defaultBackgroundColor.hexCode}`,
                          },
                          ...parentDesign.variations.map((variation) => ({
                            url: variation.imageUrl,
                            backgroundColor: `#${variation.color.hexCode}`,
                          })),
                        ],
                        initialIndex: viewedIndex + 1,
                      });
                    }
                  }}
                >
                  <span>Enlarge</span>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
              <DesignScrollView
                imageUrls={images}
                onScrollFn={onScrollFn}
                viewedIndex={viewedIndex + 1}
                setViewedIndex={(i) => setViewedIndex(i - 1)}
                backgroundColor={bgColorToUse}
                showArrowButtons={!singleDesign}
                showNavGallery={!singleDesign}
              />
            </div>
            <div className={styles["details-area"]}>
              <div>
                <h2
                  className={`${styles["heading"]} ${styles["desktop-only"]}`}
                >{`#${parentDesign.designNumber}`}</h2>
                <p className={styles["description"]}>
                  {parentDesign.description}
                </p>
              </div>
              <div>
                {showColorChangeSection && (
                  <BackgroundColorChanger
                    selectedColor={selectedBgColor}
                    onClickColor={onClickColor}
                  />
                )}
                <p className={styles["quote-info"]}>
                  Request a quote to see this design customized for your union!
                </p>
                <div className={styles["buttons-container"]}>
                  {!isDesignInCart && (
                    <button
                      className={styles["add-to-quote-button"]}
                      onClick={clickQuoteButton}
                    >
                      ADD TO QUOTE
                    </button>
                  )}
                  {isDesignInCart && (
                    <a
                      href={createNavigationUrl("cart")}
                      className={styles["request-quote-button"]}
                    >
                      REQUEST QUOTE
                    </a>
                  )}
                  <a
                    href={similarDesignsUrl}
                    className={styles["similar-designs-button"]}
                  >
                    Similar Designs<i className={"fa-solid fa-arrow-right"}></i>
                  </a>
                </div>
                <div className={styles["filters-tags-container"]}>
                  <div>
                    <p className="bold">Filters</p>
                    <p>
                      {filters.length > 0 &&
                        filters.map((sub, i, array) => {
                          const comma = i < array.length - 1;
                          return `${sub}${comma ? ", " : ""}`;
                        })}
                      {filters.length === 0 && "No filters"}
                    </p>
                  </div>
                  <div>
                    <p className="bold">Search Tags</p>
                    <p>
                      {tags.length > 0 &&
                        tags.map((sub, i, array) => {
                          const comma = i < array.length - 1;
                          return `${sub}${comma ? ", " : ""}`;
                        })}
                      {tags.length === 0 && "No tags"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

type BackgroundColorChangerProps = {
  selectedColor: Color | null;
  onClickColor: (clickedColor: Color) => void;
};

export function BackgroundColorChanger({
  onClickColor,
  selectedColor,
}: BackgroundColorChangerProps) {
  const { colors } = useApp();

  // const selectedColorName = selectedColor?.split(" - ")[1];
  const selectedColorName = selectedColor?.name;

  return (
    <div className={styles["bg-color-container"]}>
      <div>Change Background</div>
      <div className={styles["selected-color-name"]}>{selectedColorName}</div>
      <div className={styles["color-picker-swatches-container"]}>
        {colors &&
          colors.map((color) => (
            <div
              className={`${styles["color-picker-swatch"]} ${
                color.name === selectedColor?.name
                  ? styles["selected-swatch"]
                  : ""
              }`}
              style={{
                // backgroundColor: getFirstHexCodeInString(color) || "white",
                backgroundColor: `#${color.hexCode}`,
              }}
              onClick={() => onClickColor(color)}
            ></div>
          ))}
      </div>
    </div>
  );
}
