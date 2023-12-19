import { useEffect, useState } from "react";
import { DesignQueryParams } from "../types";
import {
  buildDesignQueryParams,
  deduplicateStrings,
  requestParentWindowQueryChange,
} from "../utility";
import { parseSearchParams } from "../validations";
import { useApp } from "./AppProvider";
import { ErrorPage } from "./ErrorScreen";
import styles from "./styles/FilterModal.module.css";
import { DesignScrollView } from "./DesignScrollView";

const maxSubcategoriesBeforeScrollable = 15;

export function FilterModal() {
  const { categories, parentWindowLocation } = useApp();
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
  const selectedCategoryInParams = queryParamsToUse.category;
  const selectedSubcategoryInParams = queryParamsToUse.subcategory;

  const selectedCategory = categories?.find(
    (category) => category.Name === queryParamsToUse.category
  );
  const categoriesToShow = categories?.filter(
    (category) => category.DesignType === queryParamsToUse.designType
  );
  const subcategoriesToShow = selectedCategory
    ? selectedCategory.Subcategories
    : [];

  const buttonIdPrefix = "filter-modal-filter-button-";

  function clickFilterButton(
    buttonType: "Category" | "Subcategory",
    value: string | null
  ) {
    const newParams: DesignQueryParams = { ...queryParamsToUse };

    if (buttonType === "Category") {
      newParams.category = value || undefined;
      newParams.subcategory = undefined;
    } else {
      newParams.subcategory = value || undefined;
    }
    newParams.featuredOnly = false;

    setPendingQueryParams(newParams);
  }

  function applyFilters() {
    if (!parentWindowLocation || !pendingQueryParams) return;
    requestParentWindowQueryChange(
      parentWindowLocation.url,
      pendingQueryParams
    );
  }

  const previewDesignsQueryParams: DesignQueryParams = {
    ...queryParamsToUse,
    countPerPage: 5,
  };
  const previewDesignsQueryString = buildDesignQueryParams(
    previewDesignsQueryParams
  );

  if (!categories) return <ErrorPage />;

  return (
    <>
      <h2>Screen Print Design Library Filters</h2>
      <p className={styles["instructions"]}>
        Select a main category on the left and a subcategory below
      </p>
      <div className={styles["main-flex"]}>
        <div className={styles["parent-category-column"]}>
          {categoriesToShow?.map((category) => (
            <>
              <input
                className="button-styled-checkbox"
                type="checkbox"
                name="parent-category"
                id={`${buttonIdPrefix}${category.Name}`}
                onChange={(e) =>
                  clickFilterButton(
                    "Category",
                    e.target.checked ? category.Name : null
                  )
                }
                checked={category.Name === selectedCategoryInParams}
              />
              <label htmlFor={`${buttonIdPrefix}${category.Name}`}>
                {category.Name}
              </label>
            </>
          ))}
        </div>
        <div
          className={styles["subcategories-container"]}
          style={{
            overflowY:
              subcategoriesToShow.length > maxSubcategoriesBeforeScrollable
                ? "scroll"
                : undefined,
          }}
        >
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
                checked={subcategory.Name === selectedSubcategoryInParams}
              />
              <label htmlFor={`${buttonIdPrefix}${subcategory.Name}`}>
                {subcategory.Name}
              </label>
            </>
          ))}
        </div>
        <div className={styles["preview-designs-area"]}>
          <h4>Preview</h4>
          <DesignScrollView queryString={previewDesignsQueryString} />
        </div>
      </div>
      <div className={styles["filter-action-button-row"]}>
        <button
          className={styles["filter-action-button"]}
          disabled={pendingQueryParams === null}
          onClick={applyFilters}
        >
          Apply Filters
        </button>
        <button
          className={`${styles["filter-action-button"]} ${styles["clear-selection-button"]}`}
          disabled={pendingQueryParams === null}
          onClick={() => setPendingQueryParams(null)}
        >
          Clear Selection
        </button>
      </div>
    </>
  );
}
