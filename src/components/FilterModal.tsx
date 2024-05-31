import { useEffect, useState } from "react";
import { getDesigns } from "../fetch";
import { CategoryData, DesignQueryParams, SubcategoryData } from "../types";
import {
  createNavigationUrl,
  buildDesignQueryParams,
  getDesignDefaultBackgroundColor,
} from "../utility";
import { parseSearchParams } from "../validations";
import { useApp } from "./AppProvider";
import { ErrorPage } from "./ErrorScreen";
import { ImageWithFallback } from "./ImageWithFallback";
import { LoadingIndicator } from "./LoadingIndicator";
import { Modal } from "./Modal";
import { NodeScrollView } from "./NodeScrollView";
import styles from "./styles/FilterModal.module.css";
import { TempDesign } from "../sharedTypes";

const maxSubcategoriesBeforeScrollable = 15;
const buttonIdPrefix = "filter-modal-filter-button-";

export function FilterModal() {
  const { categories, categoriesLoading } = useApp();
  const designQueryParams = parseSearchParams(
    new URLSearchParams(window.location.search)
  );
  //the pending query params are the query the user has started building
  //after they started clicking filter buttons.
  //won't be submitted until apply filters is clicked.
  const [pendingQueryParams, setPendingQueryParams] = useState(
    null as DesignQueryParams | null
  );
  const [previewDesigns, setPreviewDesigns] = useState(
    null as TempDesign[] | null
  );
  const [previewDesignsLoading, setPreviewDesignsLoading] = useState(true);
  const queryParamsToUse = pendingQueryParams
    ? pendingQueryParams
    : designQueryParams;
  const selectedCategoryInParams = queryParamsToUse.category;
  const selectedSubcategoryInParams = queryParamsToUse.subcategory;

  const selectedCategory = categories?.find(
    (category) => category.Name === queryParamsToUse.category
  );
  const categoriesToShow = categories
    ? categories.filter(
        (category) => category.DesignType === queryParamsToUse.designType
      )
    : [];
  const subcategoriesToShow = selectedCategory
    ? selectedCategory.Subcategories
    : [];

  const previewDesignImages = previewDesigns
    ? previewDesigns.map((design) => (
        <div
          className={styles["design-container"]}
          style={{
            backgroundColor:
              getDesignDefaultBackgroundColor(design) || "#000000",
          }}
        >
          <ImageWithFallback src={design.ImageURL} />
        </div>
      ))
    : undefined;
  const previewDesignUrls = previewDesigns
    ? previewDesigns.map((design) => design.ImageURL)
    : undefined;
  const scrollViewKey = btoa(JSON.stringify(previewDesignUrls));

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
    newParams.pageNumber = 1;

    setPendingQueryParams(newParams);
  }

  function applyFilters() {
    if (!pendingQueryParams) return;
    window.location.href = createNavigationUrl(pendingQueryParams);
  }

  async function getPreviewDesigns() {
    if (
      queryParamsToUse.category === undefined &&
      queryParamsToUse.subcategory === undefined
    ) {
      setPreviewDesigns(null);
      setPreviewDesignsLoading(false);
      return;
    }

    const previewDesignsQueryParams: DesignQueryParams = {
      ...queryParamsToUse,
      pageNumber: 1,
      countPerPage: 5,
    };
    const previewDesignsQueryString = buildDesignQueryParams(
      previewDesignsQueryParams
    );
    try {
      setPreviewDesignsLoading(true);
      const results = await getDesigns(previewDesignsQueryString);
      if (!results)
        throw new Error("No design found for the filter selection.");
      setPreviewDesigns(results.designs);
      setPreviewDesignsLoading(false);
    } catch (error) {
      console.error("Couldn't get preview designs: ", error);
      setPreviewDesigns(null);
      setPreviewDesignsLoading(false);
    }
  }

  useEffect(() => {
    getPreviewDesigns();
  }, [pendingQueryParams]);

  if (categoriesLoading) return <LoadingIndicator />;
  if (!categories) return <ErrorPage />;

  return (
    <Modal windowClassName={styles["window"]}>
      <h2>{designQueryParams.designType} Design Library Filters</h2>
      <p className={styles["instructions"]}>
        Select a main category on the left and a subcategory below
      </p>
      <div className={styles["main-flex"]}>
        <ParentCategories
          categoriesToShow={categoriesToShow}
          selectedCategory={selectedCategoryInParams}
          onClickFilterButton={clickFilterButton}
        />
        <Subcategories
          subcategories={subcategoriesToShow}
          selectedSubcategory={selectedSubcategoryInParams}
          onClickFilterButton={clickFilterButton}
        />
        <div className={styles["preview-designs-area"]}>
          <h4>Preview</h4>
          <NodeScrollView
            key={scrollViewKey}
            nodes={previewDesignImages}
            noNodesText="No Designs"
            isLoading={previewDesignsLoading}
          />
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
    </Modal>
  );
}

type ParentCategoriesProps = {
  categoriesToShow: CategoryData[] | null;
  selectedCategory: string | undefined;
  onClickFilterButton: (
    buttonType: "Category" | "Subcategory",
    value: string | null
  ) => void;
};

function ParentCategories({
  categoriesToShow,
  selectedCategory,
  onClickFilterButton,
}: ParentCategoriesProps) {
  return (
    <div className={styles["parent-category-column"]}>
      {categoriesToShow?.map((category) => (
        <>
          <input
            className="button-styled-checkbox"
            type="checkbox"
            name="parent-category"
            id={`${buttonIdPrefix}${category.Name}`}
            onChange={(e) =>
              onClickFilterButton(
                "Category",
                e.target.checked ? category.Name : null
              )
            }
            checked={category.Name === selectedCategory}
          />
          <label htmlFor={`${buttonIdPrefix}${category.Name}`}>
            {category.Name}
          </label>
        </>
      ))}
    </div>
  );
}

type SubcategoriesProps = {
  subcategories: SubcategoryData[];
  selectedSubcategory: string | undefined;
  onClickFilterButton: (
    buttonType: "Category" | "Subcategory",
    value: string | null
  ) => void;
};

function Subcategories({
  subcategories,
  selectedSubcategory,
  onClickFilterButton,
}: SubcategoriesProps) {
  return (
    <div>
      <h3>Subcategories</h3>
      <div
        className={styles["subcategories-container"]}
        style={{
          overflowY:
            subcategories.length > maxSubcategoriesBeforeScrollable
              ? "scroll"
              : undefined,
        }}
      >
        {subcategories.map((subcategory) => (
          <>
            <label htmlFor={`${buttonIdPrefix}${subcategory.Name}`}>
              <input
                type="checkbox"
                name="subcategory"
                id={`${buttonIdPrefix}${subcategory.Name}`}
                onChange={(e) =>
                  onClickFilterButton(
                    "Subcategory",
                    e.target.checked ? subcategory.Name : null
                  )
                }
                checked={subcategory.Name === selectedSubcategory}
              />
              {subcategory.Name}
            </label>
          </>
        ))}
      </div>
    </div>
  );
}
