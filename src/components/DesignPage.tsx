import { useEffect, useState } from "react";
import { getDesignsRelatedToId } from "../fetch";
import { TempDesignWithImages } from "../sharedTypes";
import styles from "./styles/DesignPage.module.css";
import { DesignScrollView } from "./DesignScrollView";
import {
  clamp,
  getDesignDefaultBackgroundColor,
  getDesignTags,
  getFirstHexCodeInString,
} from "../utility";
import { useApp } from "./AppProvider";

type DesignPageProps = {
  designId: number;
};

export function DesignPage({ designId }: DesignPageProps) {
  const [relatedDesigns, setRelatedDesigns] = useState<
    TempDesignWithImages[] | null
  >(null);
  const [viewedIndex, setViewedIndex] = useState(0);
  const [selectedBgColor, setSelectedBgColor] = useState(null as string | null); //the color the user has selected to override design's default color

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

  useEffect(() => {
    getDesignsToDisplay();
  }, []);

  const viewedDesign = relatedDesigns && relatedDesigns[viewedIndex];
  const viewedDesignBgColor =
    (viewedDesign && getDesignDefaultBackgroundColor(viewedDesign)) || "white";
  const selectedHexCode =
    selectedBgColor && getFirstHexCodeInString(selectedBgColor);
  const bgColorToUse = selectedHexCode ? selectedHexCode : viewedDesignBgColor;
  const filters = [
    viewedDesign?.Subcategory1,
    viewedDesign?.Subcategory2,
    viewedDesign?.Subcategory3,
    viewedDesign?.Subcategory4,
    viewedDesign?.Subcategory5,
  ].filter((sub) => sub !== undefined);
  const tags = viewedDesign
    ? getDesignTags(viewedDesign).filter((sub) => sub !== undefined)
    : [];
  const images = relatedDesigns
    ? relatedDesigns.map((design) => design.ImageURLs[0] || "")
    : [];
  const showColorChangeSection =
    relatedDesigns && relatedDesigns[0].DesignType === "Screen Print";

  return (
    <>
      {viewedDesign && (
        <div className={styles["main-flex"]}>
          <h2
            className={`${styles["heading"]} ${styles["mobile-only"]}`}
          >{`#${viewedDesign.DesignNumber}`}</h2>
          <div className={styles["gallery-container"]}>
            <DesignScrollView
              images={images}
              onScrollFn={onScrollFn}
              viewedIndex={viewedIndex}
              setViewedIndex={setViewedIndex}
              backgroundColor={bgColorToUse}
            />
          </div>
          <div className={styles["details-area"]}>
            <div>
              <h2
                className={`${styles["heading"]} ${styles["desktop-only"]}`}
              >{`#${viewedDesign.DesignNumber}`}</h2>
              <p className={styles["description"]}>
                {viewedDesign.Description}
              </p>
              <a className={styles["try-design-button"]} href="#">
                TRY THIS DESIGN
              </a>
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
            </div>
          </div>
        </div>
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
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { colors } = useApp();

  // const selectedColorName = selectedColor?.split(" - ")[1];

  //code for showing selected color name is commented out
  //until the feature is requested
  return (
    <div className={styles["bg-color-container"]}>
      <div>
        <div>Change Background</div>
        {/* {selectedColorName && (
          <div>
            {"("}Viewing:{" "}
            <span className={styles["selected-color-name"]}>
              {selectedColorName}
            </span>
            {")"}
          </div>
        )} */}
      </div>
      <button
        className={styles["bg-color-button"]}
        onClick={() => setShowColorPicker(!showColorPicker)}
      >
        <img src="/colorwheel.png" alt="color wheel" />
        <div>Choose a Color</div>
        {showColorPicker && (
          <div
            className={styles["color-picker"]}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles["color-picker-swatches-container"]}>
              {colors &&
                colors.map((color) => (
                  <div
                    className={`${styles["color-picker-swatch"]} ${
                      color === selectedColor ? styles["selected-swatch"] : ""
                    }`}
                    style={{
                      backgroundColor:
                        getFirstHexCodeInString(color) || "white",
                    }}
                    onClick={() => onClickColor(color)}
                  ></div>
                ))}
            </div>
          </div>
        )}
      </button>
    </div>
  );
}
