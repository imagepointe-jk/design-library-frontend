import { DesignGrid } from "./DesignGrid";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { DesignModal } from "./DesignModal";
import { useState, useEffect } from "react";
import { DesignType, TempDesignWithImages } from "../sharedTypes";
import { getDesigns } from "../fetch";
import styles from "./styles/DesignLibrary.module.css";
import { FilterModal } from "./FilterModal";
import { useApp } from "./AppProvider";
import { buildDesignQueryParams } from "../utility";
import { DesignQueryParams } from "../types";

export function DesignLibrary() {
  const { designNumber: designNumberStr } = useParams();
  const [designs, setDesigns] = useState<TempDesignWithImages[] | undefined>(
    undefined
  );
  const [showFilterModal, setShowFilterModal] = useState(false);
  const { designQueryParams, setDesignQueryParams } = useApp();
  const [_, setSearchParams] = useSearchParams();

  const designId = designNumberStr !== undefined ? +designNumberStr : 0;
  const selectedCategory = designQueryParams?.category;
  const selectedSubcategory = designQueryParams?.subcategory;
  const selectedDesignType = designQueryParams?.designType;

  async function getDesignsToDisplay() {
    if (!designQueryParams) return;

    try {
      console.log("getting results for", designQueryParams);
      const fetchedDesigns = await getDesigns(
        buildDesignQueryParams(designQueryParams)
      );
      console.log("setting new results");
      setDesigns(fetchedDesigns);
    } catch (error) {
      console.error(error);
    }
  }

  function changeQueryAndReload(newQuery: DesignQueryParams) {}

  function clickQuickFilterButton(
    e: React.ChangeEvent<HTMLInputElement>,
    filterName: string
  ) {
    if (!designQueryParams || !setDesignQueryParams) return;
    const isChecked = e.target.checked;

    if (filterName === "Featured") {
      const newParams = {
        ...designQueryParams,
        category: undefined,
        subcategory: undefined,
        featuredOnly: isChecked,
      };
      setDesignQueryParams(newParams);
      setSearchParams(buildDesignQueryParams(newParams));
    } else {
      const newParams = {
        ...designQueryParams,
        category: isChecked ? "Quick Search" : undefined,
        subcategory: isChecked ? filterName : undefined,
        featuredOnly: false,
      };
      setDesignQueryParams(newParams);
      setSearchParams(buildDesignQueryParams(newParams));
    }
  }

  useEffect(() => {
    getDesignsToDisplay();
  }, [designQueryParams]);

  const buttonIdPrefix = "library-page-filter-button-";
  const checkboxButtons = ["New Designs", "Best Sellers", "Featured"];

  return (
    <>
      <div className={styles["bg"]}>
        <div className="inner-body">
          <p className={styles["library-text"]}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
            unde, provident omnis libero corporis minus, voluptas perspiciatis
            deserunt, natus eos eligendi. Impedit veritatis placeat dignissimos
            perferendis possimus distinctio, eos eum!
          </p>
          <div className={styles["search-container"]}>
            <div className={styles["settings-container"]}>
              <div className={styles["settings-subcontainer"]}>
                <label htmlFor="screen-print">
                  <input
                    type="radio"
                    name="design-type"
                    id="screen-print"
                    checked={selectedDesignType === "Screen Print"}
                    onChange={(e) => {
                      if (setDesignQueryParams && designQueryParams) {
                        const designType: DesignType = e.target.checked
                          ? "Screen Print"
                          : "Embroidery";
                        const newParams = {
                          ...designQueryParams,
                          designType,
                        };
                        setDesignQueryParams(newParams);
                        setSearchParams(buildDesignQueryParams(newParams));
                      }
                    }}
                  />
                  Screen Print
                </label>
                <label htmlFor="embroidery">
                  <input
                    type="radio"
                    name="design-type"
                    id="embroidery"
                    checked={selectedDesignType === "Embroidery"}
                    onChange={(e) => {
                      if (setDesignQueryParams && designQueryParams) {
                        const designType: DesignType = e.target.checked
                          ? "Embroidery"
                          : "Screen Print";
                        const newParams = {
                          ...designQueryParams,
                          designType,
                        };
                        setDesignQueryParams(newParams);
                        setSearchParams(buildDesignQueryParams(newParams));
                      }
                    }}
                  />
                  Embroidery
                </label>
              </div>
              <div className={styles["settings-subcontainer"]}>
                {checkboxButtons.map((button) => (
                  <>
                    <input
                      className="button-styled-checkbox"
                      type="checkbox"
                      name={button}
                      id={`${buttonIdPrefix}${button}`}
                      checked={
                        (button === "Featured" &&
                          designQueryParams?.featuredOnly) ||
                        button === selectedSubcategory
                      }
                      onChange={(e) => clickQuickFilterButton(e, button)}
                    />
                    <label htmlFor={`${buttonIdPrefix}${button}`}>
                      {button}
                    </label>
                  </>
                ))}
                <button
                  className={styles["settings-button"]}
                  onClick={() => {
                    setShowFilterModal(true);
                  }}
                >
                  <i className="fa-solid fa-sliders"></i>
                  Filters
                </button>
                <button className={styles["settings-button"]}>
                  <i className="fa-solid fa-magnifying-glass"></i>
                  Search
                </button>
              </div>
            </div>
            {designs && <DesignGrid designs={designs} />}
            {designId !== undefined && designId > 0 && (
              <DesignModal designId={designId} />
            )}
          </div>
        </div>
      </div>
      {showFilterModal && (
        <FilterModal clickAwayFunction={() => setShowFilterModal(false)} />
      )}
    </>
  );
}
