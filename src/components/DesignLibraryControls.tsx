import { defaultModalHeight } from "../constants";
import { DesignType, designTypes } from "../sharedTypes";
import { DesignQueryParams } from "../types";
import {
  requestParentWindowModalOpen,
  requestParentWindowQueryChange,
} from "../utility";
import { parseSearchParams } from "../validations";
import { useApp } from "./AppProvider";
import styles from "./styles/DesignLibrary.module.css";

const searchModalHeight = 300;

export function DesignLibraryControls() {
  const { parentWindowLocation } = useApp();
  const designQueryParams = parseSearchParams(
    new URLSearchParams(parentWindowLocation?.search)
  );
  const buttonIdPrefix = "library-page-filter-button-";
  const checkboxButtons = ["New Designs", "Best Sellers", "All Designs"];
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
    const newParams: DesignQueryParams = {
      ...designQueryParams,
      pageNumber: 1,
    };

    if (filterName === "All Designs") {
      newParams.category = undefined;
      newParams.subcategory = undefined;
      newParams.featuredOnly = !isChecked;
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
                (button === "All Designs" &&
                  !designQueryParams?.featuredOnly) ||
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
            requestParentWindowModalOpen("filters", {
              height: defaultModalHeight,
            });
          }}
        >
          <i className="fa-solid fa-sliders"></i>
          Filters
        </button>
        <button
          className={styles["settings-button"]}
          onClick={() =>
            requestParentWindowModalOpen("search", {
              height: searchModalHeight,
            })
          }
        >
          <i className="fa-solid fa-magnifying-glass"></i>
          Search
        </button>
      </div>
    </div>
  );
}
