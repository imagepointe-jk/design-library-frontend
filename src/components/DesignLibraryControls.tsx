import { useSearchParams } from "react-router-dom";
import { DesignType, designTypes } from "../sharedTypes";
import { DesignQueryParams } from "../types";
import { useApp } from "./AppProvider";
import styles from "./styles/DesignLibrary.module.css";
import { parseSearchParams } from "../validations";
import { buildDesignQueryParams } from "../utility";

type DesignLibraryControlsProps = {
  setShowFilterModal: (b: boolean) => void;
  setShowSearchModal: (b: boolean) => void;
};

export function DesignLibraryControls({
  setShowFilterModal,
  setShowSearchModal,
}: DesignLibraryControlsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const designQueryParams = parseSearchParams(searchParams);
  const buttonIdPrefix = "library-page-filter-button-";
  const checkboxButtons = ["New Designs", "Best Sellers", "Featured"];
  const selectedSubcategory = designQueryParams.subcategory;
  const selectedDesignType = designQueryParams.designType;

  function changeDesignType(newType: DesignType) {
    const newParams: DesignQueryParams = {
      ...designQueryParams,
      designType: newType,
    };
    setSearchParams(buildDesignQueryParams(newParams));
  }

  function clickQuickFilterButton(
    e: React.ChangeEvent<HTMLInputElement>,
    filterName: string
  ) {
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

    setSearchParams(buildDesignQueryParams(newParams));
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
