import { useEffect, useState } from "react";
import { getDesignsRelatedToId } from "../fetch";
import { TempDesignWithImages } from "../sharedTypes";
import styles from "./styles/DesignPage.module.css";
import { DesignScrollView } from "./DesignScrollView";
import { clamp } from "../utility";

type DesignPageProps = {
  designId: number;
};

export function DesignPage({ designId }: DesignPageProps) {
  const [relatedDesigns, setRelatedDesigns] = useState<
    TempDesignWithImages[] | null
  >(null);
  const [viewedIndex, setViewedIndex] = useState(0);
  const [bgColor, setBgColor] = useState<string | undefined>(undefined);

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
  }

  useEffect(() => {
    getDesignsToDisplay();
  }, []);

  // const bgColorToUse = bgColor ? bgColor : design?.DefaultBackgroundColor;
  const viewedDesign = relatedDesigns && relatedDesigns[viewedIndex];
  const filters = [
    viewedDesign?.Subcategory1,
    viewedDesign?.Subcategory2,
    viewedDesign?.Subcategory3,
    viewedDesign?.Subcategory4,
    viewedDesign?.Subcategory5,
  ].filter((sub) => sub !== undefined);
  const tags = [
    viewedDesign?.Tag1,
    viewedDesign?.Tag2,
    viewedDesign?.Tag3,
    viewedDesign?.Tag4,
    viewedDesign?.Tag5,
  ].filter((sub) => sub !== undefined);
  const images = relatedDesigns
    ? relatedDesigns.map((design) => design.ImageURLs[0] || "")
    : [];

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
              <div className={styles["bg-color-container"]}>
                <div>Change Background</div>
                <button className={styles["bg-color-button"]}>
                  <input
                    className={styles["color-picker"]}
                    type="color"
                    onChange={(e) => setBgColor(e.target.value)}
                  />
                  <img src="/colorwheel.png" alt="color wheel" />
                  <div>Choose a Color</div>
                </button>
              </div>
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
