// import { useSearchParams } from "react-router-dom";
import { DesignType, designTypes } from "../sharedTypes";
import { DesignQueryParams } from "../types";
import { useApp } from "./AppProvider";
import styles from "./styles/DesignLibrary.module.css";
import { parseSearchParams } from "../validations";
import { requestParentWindowQueryChange } from "../utility";

type DesignLibraryControlsProps = {
  setShowFilterModal: (b: boolean) => void;
  setShowSearchModal: (b: boolean) => void;
};

export function DesignLibraryControls({
  setShowFilterModal,
  setShowSearchModal,
}: DesignLibraryControlsProps) {
  const { parentWindowLocation } = useApp();
  const designQueryParams = parseSearchParams(
    new URLSearchParams(parentWindowLocation?.search)
  );
  const buttonIdPrefix = "library-page-filter-button-";
  const checkboxButtons = ["New Designs", "Best Sellers", "Featured"];
  const selectedSubcategory = designQueryParams.subcategory;
  const selectedDesignType = designQueryParams.designType;

  function changeDesignType(newType: DesignType) {
    if (!parentWindowLocation) return;
    const newParams: DesignQueryParams = {
      ...designQueryParams,
      designType: newType,
    };
    requestParentWindowQueryChange(parentWindowLocation.url, newParams);
  }

  function clickQuickFilterButton(
    e: React.ChangeEvent<HTMLInputElement>,
    filterName: string
  ) {
    if (!parentWindowLocation) return;
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
    requestParentWindowQueryChange(parentWindowLocation.url, newParams);
  }

  return (
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
                (button === "Featured" && designQueryParams?.featuredOnly) ||
                button === selectedSubcategory
              }
              onChange={(e) => clickQuickFilterButton(e, button)}
            />
            <label htmlFor={`${buttonIdPrefix}${button}`}>{button}</label>
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
  );
}
