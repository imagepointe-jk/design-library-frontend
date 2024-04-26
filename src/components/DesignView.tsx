import { useEffect, useState } from "react";
import { getDesignsRelatedToId } from "../fetch";
import {
  clamp,
  createNavigationUrl,
  getDesignCategoryHierarchies,
  getDesignDefaultBackgroundColor,
  getDesignTags,
  getFirstHexCodeInString,
} from "../utility";
import { useApp } from "./AppProvider";
import { DesignScrollView } from "./DesignScrollView";
import { QuoteForm } from "./QuoteForm";
import { ShareButton } from "./ShareButton";
import styles from "./styles/DesignView.module.css";
import { TempDesign } from "../sharedTypes";
import { DesignQueryParams } from "../types";

type DesignViewProps = {
  designId: number;
};

export function DesignView({ designId }: DesignViewProps) {
  const [relatedDesigns, setRelatedDesigns] = useState<TempDesign[] | null>(
    null
  );
  const [viewedIndex, setViewedIndex] = useState(0);
  const [selectedBgColor, setSelectedBgColor] = useState(null as string | null); //the color the user has selected to override design's default color
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const { setLightboxData, cartData, addDesignToCart } = useApp();

  async function getDesignsToDisplay() {
    try {
      const related = await getDesignsRelatedToId(designId);
      related.sort((a) => (a.Id === designId ? -1 : 1));
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

  function onClickColor(clickedColor: string) {
    setSelectedBgColor(clickedColor);
  }

  function clickQuoteButton() {
    if (!addDesignToCart || !relatedDesigns) return;

    if (!isDesignInCart) {
      const viewedDesign = relatedDesigns[viewedIndex];
      //if they actually clicked a non-default color, use that.
      //if not, check if the viewed design has transparency (and therefore had color picking options).
      //if it didn't, don't assume the user wanted the background color that was displayed to them. Assign a message accordingly.
      //if it did, assume the user was fine with the default background color, and assign that.
      const colorToAddToCart =
        selectedBgColor ||
        (viewedDesignHasTransparency
          ? viewedDesign.DefaultBackgroundColor
          : "Color picking unavailable for this design.");
      addDesignToCart({
        id: viewedDesign.Id,
        requestedBackgroundColor: colorToAddToCart,
      });
    } else console.log("go to cart");
  }

  useEffect(() => {
    getDesignsToDisplay();
  }, []);

  const singleDesign = relatedDesigns && relatedDesigns.length === 1;
  const viewedDesign = relatedDesigns && relatedDesigns[viewedIndex];
  const viewedDesignBgColor =
    (viewedDesign && getDesignDefaultBackgroundColor(viewedDesign)) || "white";
  const selectedHexCode =
    selectedBgColor && getFirstHexCodeInString(selectedBgColor);
  const bgColorToUse = selectedHexCode ? selectedHexCode : viewedDesignBgColor;
  const fullColorStringToUse =
    selectedBgColor ||
    viewedDesign?.DefaultBackgroundColor ||
    "(no color selected)";
  const filters = viewedDesign
    ? getDesignCategoryHierarchies(viewedDesign).filter(
        (sub) => sub !== undefined
      )
    : [];
  const tags = viewedDesign
    ? getDesignTags(viewedDesign).filter((sub) => sub !== undefined)
    : [];
  const images = relatedDesigns
    ? relatedDesigns.map((design) => design.ImageURL || "")
    : [];
  //assume for now that all .pngs are transparent
  const viewedDesignHasTransparency =
    viewedDesign?.ImageURL?.endsWith(".png") || false;
  const showColorChangeSection =
    relatedDesigns &&
    relatedDesigns[0].DesignType === "Screen Print" &&
    viewedDesignHasTransparency;
  const similarDesignsParams: DesignQueryParams | undefined = relatedDesigns
    ? {
        designType: relatedDesigns[0].DesignType,
        featuredOnly: false,
        pageNumber: 1,
        similarTo: designId,
      }
    : undefined;
  const similarDesignsUrl = similarDesignsParams
    ? createNavigationUrl(similarDesignsParams)
    : undefined;
  const isDesignInCart = cartData?.designs.find(
    (design) => viewedDesign?.Id === design.id
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
            >{`#${viewedDesign.DesignNumber}`}</h2>
            <div className={styles["gallery-container"]}>
              <div className={styles["gizmos-container"]}>
                <ShareButton designId={viewedDesign.Id} />
                <button
                  className={styles["zoom-button"]}
                  onClick={() => {
                    if (setLightboxData) {
                      setLightboxData({
                        images: relatedDesigns.map((design) => ({
                          url: design.ImageURL || "",
                          backgroundColor: design.DefaultBackgroundColor,
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
                showArrowButtons={!showQuoteForm && !singleDesign}
                showNavGallery={!showQuoteForm && !singleDesign}
              />
            </div>
            {!showQuoteForm && (
              <div className={styles["details-area"]}>
                <div>
                  <h2
                    className={`${styles["heading"]} ${styles["desktop-only"]}`}
                  >{`#${viewedDesign.DesignNumber}`}</h2>
                  <p className={styles["description"]}>
                    {viewedDesign.Description}
                  </p>
                </div>
                <div>
                  {showColorChangeSection && (
                    <BackgroundColorChanger
                      selectedColor={selectedBgColor}
                      onClickColor={onClickColor}
                    />
                  )}
                  <div className={styles["filters-tags-container"]}>
                    <div>
                      <p className="bold">Filters</p>
                      <p>
                        {filters.length > 0 &&
                          filters.map((sub, i, array) => {
                            const onlySubcategory = sub && sub.split(" > ")[1];
                            const comma = i < array.length - 1;
                            return `${onlySubcategory}${comma ? ", " : ""}`;
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
                  <p className={styles["quote-info"]}>
                    Get a quote to view more garment color options and see this
                    design customized for your union!
                  </p>
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
                      <span>REQUEST QUOTE</span>
                    </a>
                  )}
                  <a
                    href={similarDesignsUrl}
                    className={styles["similar-designs-button"]}
                  >
                    Similar Designs<i className={"fa-solid fa-arrow-right"}></i>
                  </a>
                </div>
              </div>
            )}
            {showQuoteForm && (
              <QuoteForm
                designId={viewedDesign.Id}
                designNumber={viewedDesign.DesignNumber}
                garmentColor={fullColorStringToUse}
                onClickBack={() => setShowQuoteForm(false)}
              />
            )}
          </div>
        </>
      )}
    </>
  );
}

type BackgroundColorChangerProps = {
  selectedColor: string | null;
  onClickColor: (clickedColor: string) => void;
};

function BackgroundColorChanger({
  onClickColor,
  selectedColor,
}: BackgroundColorChangerProps) {
  const { colors } = useApp();

  const selectedColorName = selectedColor?.split(" - ")[1];

  return (
    <div className={styles["bg-color-container"]}>
      <div>Change Background</div>
      <div className={styles["selected-color-name"]}>{selectedColorName}</div>
      <div className={styles["color-picker-swatches-container"]}>
        {colors &&
          colors.map((color) => (
            <div
              className={`${styles["color-picker-swatch"]} ${
                color === selectedColor ? styles["selected-swatch"] : ""
              }`}
              style={{
                backgroundColor: getFirstHexCodeInString(color) || "white",
              }}
              onClick={() => onClickColor(color)}
            ></div>
          ))}
      </div>
    </div>
  );
}
