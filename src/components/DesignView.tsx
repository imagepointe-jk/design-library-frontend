import { useEffect, useState } from "react";
import { getDesignsRelatedToId } from "../fetch";
import {
  clamp,
  // createNavigationUrl,
  // getDesignCategoryHierarchies,
  getDesignDefaultBackgroundColor,
  getDesignTags,
  // getFirstHexCodeInString,
  isDesignTransparent,
} from "../utility";
import { useApp } from "./AppProvider";
import { DesignScrollView } from "./DesignScrollView";
import { ShareButton } from "./ShareButton";
import styles from "./styles/DesignView.module.css";
// import { TempDesign } from "../sharedTypes";
// import { DesignQueryParams } from "../types";
import { Color, Design } from "../dbSchema";
import {
  createNavigationUrl,
  getDefaultQueryParams,
  getModifiedQueryParams,
} from "../query";

type DesignViewProps = {
  designId: number;
};

export function DesignView({ designId }: DesignViewProps) {
  const [relatedDesigns, setRelatedDesigns] = useState<Design[] | null>(null);
  const [viewedIndex, setViewedIndex] = useState(0);
  const [selectedBgColor, setSelectedBgColor] = useState(null as Color | null); //the color the user has selected to override design's default color
  const { setLightboxData, cartData, addDesignsToCart } = useApp();

  async function getDesignsToDisplay() {
    try {
      const related = await getDesignsRelatedToId(designId);
      related.sort((a) => (a.id === designId ? -1 : 1));
      setRelatedDesigns(related);
    } catch (error) {
      console.error("Error getting related designs: ", error);
    }
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

  function onClickColor(clickedColor: Color) {
    setSelectedBgColor(clickedColor);
  }

  function clickQuoteButton() {
    if (!addDesignsToCart || !relatedDesigns) return;

    if (!isDesignInCart) {
      const viewedDesign = relatedDesigns[viewedIndex];
      //if they actually clicked a non-default color, use that.
      //if not, check if the viewed design has transparency (and therefore had color picking options).
      //if it didn't, don't assume the user wanted the background color that was displayed to them. Assign a message accordingly.
      //if it did, assume the user was fine with the default background color, and assign that.
      // const colorToAddToCart =
      //   selectedBgColor ||
      //   (viewedDesignHasTransparency
      //     ? viewedDesign.defaultBackgroundColor.hexCode
      //     : "Color picking unavailable for this design.");
      const colorToAddToCart = selectedBgColor
        ? `#${selectedBgColor.hexCode}`
        : viewedDesignHasTransparency
        ? `#${viewedDesign.defaultBackgroundColor.hexCode}`
        : "Color picking unavailable for this design.";
      addDesignsToCart([
        {
          id: viewedDesign.id,
          designNumber: `${viewedDesign.designNumber}`,
          garmentColor: colorToAddToCart,
        },
      ]);
      window.location.href = createNavigationUrl("cart");
    } else console.log("go to cart");
  }

  useEffect(() => {
    getDesignsToDisplay();
  }, []);

  const singleDesign = relatedDesigns && relatedDesigns.length === 1;
  const viewedDesign = relatedDesigns && relatedDesigns[viewedIndex];
  const viewedDesignBgColor =
    (viewedDesign && getDesignDefaultBackgroundColor(viewedDesign)) || "white";
  const selectedHexCode = selectedBgColor
    ? `#${selectedBgColor.hexCode}`
    : null;
  // selectedBgColor && getFirstHexCodeInString(selectedBgColor);
  const bgColorToUse = selectedHexCode ? selectedHexCode : viewedDesignBgColor;
  // const fullColorStringToUse =
  //   selectedBgColor ||
  //   viewedDesign?.defaultBackgroundColor ||
  //   "(no color selected)";
  // const filters = viewedDesign
  //   ? getDesignCategoryHierarchies(viewedDesign).filter(
  //       (sub) => sub !== undefined
  //     )
  //   : [];
  const filters = viewedDesign
    ? viewedDesign.designSubcategories.map((sub) => sub.name)
    : [];
  const tags = viewedDesign
    ? getDesignTags(viewedDesign).filter((sub) => sub !== undefined)
    : [];
  const images = relatedDesigns
    ? relatedDesigns.map((design) => design.imageUrl || "")
    : [];
  const viewedDesignHasTransparency = viewedDesign
    ? isDesignTransparent(viewedDesign)
    : false;
  const showColorChangeSection =
    relatedDesigns &&
    relatedDesigns[0].designType.name === "Screen Print" &&
    viewedDesignHasTransparency;
  //!
  //!
  //!
  //!
  // const TEMP_FORCED_DESIGN_TYPE =
  //   relatedDesigns && relatedDesigns[0].designType.name === "Embroidery"
  //     ? "Embroidery"
  //     : "Screen Print";
  // const similarDesignsParams: DesignQueryParams | undefined = relatedDesigns
  //   ? {
  //       designType: TEMP_FORCED_DESIGN_TYPE,
  //       featuredOnly: false,
  //       pageNumber: 1,
  //       similarTo: designId,
  //     }
  //   : undefined;
  const defaultQueryParams = getDefaultQueryParams().stringified;
  // const similarDesignsUrl = similarDesignsParams
  //   ? createNavigationUrl(similarDesignsParams)
  //   : undefined;
  const similarDesignsParams = getModifiedQueryParams(
    defaultQueryParams,
    "similarTo",
    `${designId}`
  ).stringified;
  const similarDesignsUrl = `${window.location.origin}${window.location.pathname}?${similarDesignsParams}`;
  const isDesignInCart = cartData?.designs.find(
    (design) => viewedDesign?.id === design.id
  );

  return (
    <>
      {viewedDesign && (
        <>
          <h3 className={styles["customize-notice"]}>
            This design is customizable to your union and local.
          </h3>
          <div className={styles["main-flex"]}>
            <h2
              className={`${styles["heading"]} ${styles["mobile-only"]}`}
            >{`#${viewedDesign.designNumber}`}</h2>
            <div className={styles["gallery-container"]}>
              <div className={styles["gizmos-container"]}>
                <ShareButton designId={viewedDesign.id} />
                <button
                  className={styles["zoom-button"]}
                  onClick={() => {
                    if (setLightboxData) {
                      setLightboxData({
                        images: relatedDesigns.map((design) => ({
                          url: design.imageUrl || "",
                          backgroundColor: `#${design.defaultBackgroundColor.hexCode}`,
                        })),
                        initialIndex: viewedIndex,
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
                viewedIndex={viewedIndex}
                setViewedIndex={setViewedIndex}
                backgroundColor={bgColorToUse}
                showArrowButtons={!singleDesign}
                showNavGallery={!singleDesign}
              />
            </div>
            <div className={styles["details-area"]}>
              <div>
                <h2
                  className={`${styles["heading"]} ${styles["desktop-only"]}`}
                >{`#${viewedDesign.designNumber}`}</h2>
                <p className={styles["description"]}>
                  {viewedDesign.description}
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
