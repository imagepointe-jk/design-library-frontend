import { useState } from "react";
import { DesignQueryParams } from "../types";
import { deduplicateStrings, requestParentWindowQueryChange } from "../utility";
import { parseSearchParams } from "../validations";
import { useApp } from "./AppProvider";
import { ErrorPage } from "./ErrorScreen";
import styles from "./styles/FilterModal.module.css";

export function FilterModal() {
  const { subcategoriesData, parentWindowLocation } = useApp();
  const designQueryParams = parseSearchParams(
    new URLSearchParams(parentWindowLocation?.search)
  );
  //the pending query params are the query the user has started building
  //after they started clicking filter buttons.
  //won't be submitted until apply filters is clicked.
  const [pendingQueryParams, setPendingQueryParams] = useState(
    null as DesignQueryParams | null
  );
  const queryParamsToUse = pendingQueryParams
    ? pendingQueryParams
    : designQueryParams;
  const selectedCategory = queryParamsToUse.category;
  const selectedSubcategory = queryParamsToUse.subcategory;

  const parentCategories =
    subcategoriesData &&
    deduplicateStrings(
      subcategoriesData.map((subcategoryData) => subcategoryData.ParentCategory)
    );

  const subcategoriesToShow =
    subcategoriesData &&
    subcategoriesData.filter(
      (subcategory) => subcategory.ParentCategory === queryParamsToUse?.category
    );

  const buttonIdPrefix = "filter-modal-filter-button-";

  function clickFilterButton(
    buttonType: "Featured" | "Category" | "Subcategory",
    value: string | null
  ) {
    const newParams: DesignQueryParams = { ...queryParamsToUse };

    if (buttonType === "Featured") {
      newParams.category = undefined;
      newParams.subcategory = undefined;
      newParams.featuredOnly = value !== null;
    } else if (buttonType === "Category") {
      newParams.category = value || undefined;
      newParams.subcategory = undefined;
      newParams.featuredOnly = false;
    } else {
      newParams.subcategory = value || undefined;
      newParams.featuredOnly = false;
    }

    setPendingQueryParams(newParams);
  }

  function applyFilters() {
    if (!parentWindowLocation || !pendingQueryParams) return;
    requestParentWindowQueryChange(
      parentWindowLocation.url,
      pendingQueryParams
    );
  }

  if (!parentCategories || !subcategoriesToShow) return <ErrorPage />;

  return (
    <>
      <h2>Screen Print Design Library Filters</h2>
      <p>Select a main category on the left and a subcategory below</p>
      <div className={styles["main-flex"]}>
        <div className={styles["parent-category-column"]}>
          {["Featured", ...parentCategories].map((buttonName) => (
            <>
              <input
                className="button-styled-checkbox"
                type="checkbox"
                name="parent-category"
                id={`${buttonIdPrefix}${buttonName}`}
                onChange={(e) =>
                  clickFilterButton(
                    buttonName === "Featured" ? "Featured" : "Category",
                    e.target.checked ? buttonName : null
                  )
                }
                checked={
                  (buttonName === "Featured" &&
                    queryParamsToUse.featuredOnly) ||
                  buttonName === selectedCategory
                }
              />
              <label htmlFor={`${buttonIdPrefix}${buttonName}`}>
                {buttonName}
              </label>
            </>
          ))}
          <button disabled={pendingQueryParams === null} onClick={applyFilters}>
            Apply Filters
          </button>
          <button
            disabled={pendingQueryParams === null}
            onClick={() => setPendingQueryParams(null)}
          >
            Clear Selection
          </button>
        </div>
        <div>
          {subcategoriesToShow.map((subcategory) => (
            <>
              <input
                className="text-styled-checkbox"
                type="checkbox"
                name="subcategory"
                id={`${buttonIdPrefix}${subcategory.Name}`}
                onChange={(e) =>
                  clickFilterButton(
                    "Subcategory",
                    e.target.checked ? subcategory.Name : null
                  )
                }
                checked={subcategory.Name === selectedSubcategory}
              />
              <label htmlFor={`${buttonIdPrefix}${subcategory.Name}`}>
                {subcategory.Name}
              </label>
            </>
          ))}
        </div>
      </div>
    </>
  );
}
