import { useEffect, useState } from "react";
import { getDesignById } from "../fetch";
import { TempDesignWithImages } from "../sharedTypes";
import styles from "./styles/DesignPage.module.css";
import { DesignScrollView } from "./DesignScrollView";

type DesignPageProps = {
  designId: number;
};

export function DesignPage({ designId }: DesignPageProps) {
  const [design, setDesign] = useState<TempDesignWithImages | undefined>(
    undefined
  );
  const [bgColor, setBgColor] = useState<string | undefined>(undefined);

  async function getDesignToDisplay() {
    try {
      const fetchedDesign = await getDesignById(designId);
      setDesign(fetchedDesign);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getDesignToDisplay();
  }, []);

  const bgColorToUse = bgColor ? bgColor : design?.DefaultBackgroundColor;
  const filters = [
    design?.Subcategory1,
    design?.Subcategory2,
    design?.Subcategory3,
    design?.Subcategory4,
    design?.Subcategory5,
  ].filter((sub) => sub !== undefined);
  const tags = [
    design?.Tag1,
    design?.Tag2,
    design?.Tag3,
    design?.Tag4,
    design?.Tag5,
  ].filter((sub) => sub !== undefined);

  return (
    <>
      {design && (
        <div className={styles["main-flex"]}>
          <div className={styles["gallery-container"]}>
            <DesignScrollView
              overrideImages={design.ImageURLs}
              scrollDistance={520}
            />
          </div>
          <div className={styles["details-area"]}>
            <div>
              <h2 className={styles["heading"]}>{`#${design.DesignNumber}`}</h2>
              <p className={styles["subheading"]}>
                Design details and description here
              </p>
              <p>{design.Description}</p>
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
