import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDesigns } from "../fetch";
import { DesignType, TempDesignWithImages, designTypes } from "../sharedTypes";
import { DesignQueryParams } from "../types";
import { buildDesignQueryParams } from "../utility";
import { useApp } from "./AppProvider";
import { DesignGrid } from "./DesignGrid";
import { DesignModal } from "./DesignModal";
import { FilterModal } from "./FilterModal";
import styles from "./styles/DesignLibrary.module.css";
import { SearchModal } from "./SearchModal";

export function DesignLibrary() {
  const { designNumber: designNumberStr } = useParams();
  const [designs, setDesigns] = useState<TempDesignWithImages[] | undefined>(
    undefined
  );
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { designQueryParams, updateDesignQueryParams } = useApp();
  const [isFetchingResults, setIsFetchingResults] = useState(true);

  const designId = designNumberStr !== undefined ? +designNumberStr : 0;
  const selectedSubcategory = designQueryParams?.subcategory;
  const selectedDesignType = designQueryParams?.designType;

  async function getDesignsToDisplay() {
    if (!designQueryParams) return;

    try {
      setIsFetchingResults(true);
      const fetchedDesigns = await getDesigns(
        buildDesignQueryParams(designQueryParams)
      );
      setIsFetchingResults(false);
      setDesigns(fetchedDesigns);
    } catch (error) {
      console.error(error);
    }
  }

  function clickQuickFilterButton(
    e: React.ChangeEvent<HTMLInputElement>,
    filterName: string
  ) {
    if (!designQueryParams || !updateDesignQueryParams) return;
    const isChecked = e.target.checked;
    const newParams = { ...designQueryParams };

    if (filterName === "Featured") {
      newParams.category = undefined;
      newParams.subcategory = undefined;
      newParams.featuredOnly = isChecked;
    } else {
      newParams.category = isChecked ? "Quick Search" : undefined;
      newParams.subcategory = isChecked ? filterName : undefined;
      newParams.featuredOnly = false;
    }

    updateDesignQueryParams(newParams);
  }

  function changeDesignType(newType: DesignType) {
    if (!designQueryParams || !updateDesignQueryParams) return;

    const newParams: DesignQueryParams = {
      ...designQueryParams,
      designType: newType,
    };
    updateDesignQueryParams(newParams);
  }

  useEffect(() => {
    getDesignsToDisplay();
  }, [designQueryParams]);

  const buttonIdPrefix = "library-page-filter-button-";
  const checkboxButtons = ["New Designs", "Best Sellers", "Featured"];
  const keywordsAsString =
    designQueryParams?.keywords !== undefined
      ? designQueryParams.keywords.join(" ")
      : undefined;

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
          {keywordsAsString && (
            <h2>
              Searching for{" "}
              <span className={styles["searching-for-keywords"]}>
                "{keywordsAsString}"
              </span>
            </h2>
          )}
          <div className={styles["search-container"]}>
            <div className={styles["settings-container"]}>
              <div className={styles["settings-subcontainer"]}>
                {designTypes.map((type) => (
                  <label htmlFor={`${buttonIdPrefix}${type}`}>
                    <input
                      type="radio"
                      name="design-type"
                      id={`${buttonIdPrefix}${type}`}
                      checked={selectedDesignType === type}
                      onChange={(e) => changeDesignType(type)}
                    />
                    {type}
                  </label>
                ))}
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
                <button
                  className={styles["settings-button"]}
                  onClick={() => setShowSearchModal(true)}
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                  Search
                </button>
              </div>
            </div>
            {designs && designs.length === 0 && !isFetchingResults && (
              <h3>No results</h3>
            )}
            {designs && !isFetchingResults && <DesignGrid designs={designs} />}
            {designId !== undefined && designId > 0 && (
              <DesignModal designId={designId} />
            )}
          </div>
        </div>
      </div>
      {showFilterModal && (
        <FilterModal clickAwayFunction={() => setShowFilterModal(false)} />
      )}
      {showSearchModal && (
        <SearchModal clickAwayFunction={() => setShowSearchModal(false)} />
      )}
    </>
  );
}
