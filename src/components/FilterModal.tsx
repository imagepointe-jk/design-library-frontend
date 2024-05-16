import { useEffect, useState } from "react";
import { getDesigns } from "../fetch";
import { CategoryData, /*DesignQueryParams,*/ SubcategoryData } from "../types";
import {
  // createNavigationUrl,
  // buildDesignQueryParams,
  getDesignDefaultBackgroundColor,
} from "../utility";
// import { parseSearchParams } from "../validations";
import { useApp } from "./AppProvider";
import { ErrorPage } from "./ErrorScreen";
import { ImageWithFallback } from "./ImageWithFallback";
import { LoadingIndicator } from "./LoadingIndicator";
import { Modal } from "./Modal";
import { NodeScrollView } from "./NodeScrollView";
import styles from "./styles/FilterModal.module.css";
import { Design, DesignCategory, DesignSubcategory } from "../dbSchema";
import {
  getDefaultQueryParams,
  getModifiedQueryParams,
  parseDesignQueryParams,
} from "../query";
// import { TempDesign } from "../sharedTypes";

const maxSubcategoriesBeforeScrollable = 15;
const buttonIdPrefix = "filter-modal-filter-button-";

export function FilterModal() {
  const { categories, categoriesLoading } = useApp();
  const designQueryParams = parseDesignQueryParams(
    new URLSearchParams(window.location.search)
  );
  //the pending query params are the query the user has started building
  //after they started clicking filter buttons.
  //won't be submitted until apply filters is clicked.
  // const [pendingQueryParams, setPendingQueryParams] = useState(
  //   null as DesignQueryParams | null
  // );
  const selectedCategoryInParams = categories
    ? categories.find(
        (cat) =>
          !!cat.designSubcategories.find(
            (sub) =>
              sub.name ===
              decodeURIComponent(designQueryParams.subcategory || "")
          )
      )
    : undefined;
  const selectedSubcategoryIndexInParams = selectedCategoryInParams
    ? selectedCategoryInParams.designSubcategories.findIndex(
        (sub) => sub.name === designQueryParams.subcategory
      )
    : -1;
  const [selectedCategory, setSelectedCategory] = useState(
    selectedCategoryInParams
  );
  const [selectedSubcategoryIndex, setSelectedSubcategoryIndex] = useState(
    selectedSubcategoryIndexInParams
  );
  const [previewDesigns, setPreviewDesigns] = useState(null as Design[] | null);
  const [previewDesignsLoading, setPreviewDesignsLoading] = useState(true);
  // const queryParamsToUse = pendingQueryParams
  //   ? pendingQueryParams
  //   : designQueryParams;
  // const selectedCategoryInParams = queryParamsToUse.category;
  // const selectedSubcategoryInParams = queryParamsToUse.subcategory;
  const selectedSubcategoryInParams = designQueryParams.subcategory;

  const categoriesToShow = categories
    ? categories.filter(
        (category) => category.designType.name === designQueryParams.designType
      )
    : undefined;
  // const selectedCategory = categories?.find(
  //   (category) => category.Name === queryParamsToUse.category
  // );
  // const categoriesToShow = categories
  //   ? categories.filter(
  //       (category) => category.DesignType === queryParamsToUse.designType
  //     )
  //   : [];
  // const subcategoriesToShow = selectedCategory
  //   ? selectedCategory.Subcategories
  //   : [];
  const subcategoriesToShow = selectedCategory?.designSubcategories;

  const previewDesignImages = previewDesigns
    ? previewDesigns.map((design) => (
        <div
          className={styles["design-container"]}
          style={{
            backgroundColor:
              getDesignDefaultBackgroundColor(design) || "#000000",
          }}
        >
          <ImageWithFallback src={design.imageUrl} />
        </div>
      ))
    : undefined;
  const previewDesignUrls = previewDesigns
    ? previewDesigns.map((design) => design.imageUrl)
    : undefined;
  const scrollViewKey = btoa(JSON.stringify(previewDesignUrls));

  function clickFilterButton(
    buttonType: "Category" | "Subcategory",
    clickedIndex: number
  ) {
    if (!categories) return;

    if (buttonType === "Category") {
      setSelectedCategory(categories[clickedIndex]);
      setSelectedSubcategoryIndex(0);
    } else {
      setSelectedSubcategoryIndex(clickedIndex);
    }

    // const newParams: DesignQueryParams = { ...queryParamsToUse };
    // if (buttonType === "Category") {
    //   newParams.category = value || undefined;
    //   newParams.subcategory = undefined;
    // } else {
    //   newParams.subcategory = value || undefined;
    // }
    // newParams.featuredOnly = false;
    // newParams.pageNumber = 1;
    // setPendingQueryParams(newParams);
  }

  function applyFilters() {
    // if (!pendingQueryParams) return;
    // window.location.href = createNavigationUrl(pendingQueryParams);
  }

  async function getPreviewDesigns() {
    if (!selectedCategory || selectedSubcategoryIndex === -1 || !categories) {
      setPreviewDesigns(null);
      setPreviewDesignsLoading(false);
      return;
    }
    const selectedSubcategory =
      selectedCategory.designSubcategories[selectedSubcategoryIndex];
    console.log(selectedSubcategory);

    let params = getDefaultQueryParams().stringified;
    params = getModifiedQueryParams(params, "perPage", "5").stringified;
    if (selectedSubcategory.name === "New Designs") {
      params = getModifiedQueryParams(params, "age", "new").stringified;
    } else if (selectedSubcategory.name === "Classics") {
      params = getModifiedQueryParams(params, "age", "old").stringified;
    } else {
      params = getModifiedQueryParams(
        params,
        "subcategory",
        selectedSubcategory.name
      ).stringified;
      console.log(params);
    }

    try {
      setPreviewDesignsLoading(true);
      const results = await getDesigns(params);
      if (!results)
        throw new Error("No design found for the filter selection.");
      setPreviewDesigns(results.designs);
    } catch (error) {
      console.log("Couldn't get preview designs: ", error);
      setPreviewDesigns(null);
    }
    setPreviewDesignsLoading(false);
    // if (
    //   queryParamsToUse.category === undefined &&
    //   queryParamsToUse.subcategory === undefined
    // ) {
    //   setPreviewDesigns(null);
    //   setPreviewDesignsLoading(false);
    //   return;
    // }
    // const previewDesignsQueryParams: DesignQueryParams = {
    //   ...queryParamsToUse,
    //   pageNumber: 1,
    //   perPage: 5,
    // };
    // const previewDesignsQueryString = buildDesignQueryParams(
    //   previewDesignsQueryParams
    // );
    // try {
    //   setPreviewDesignsLoading(true);
    //   const results = await getDesigns(previewDesignsQueryString);
    //   if (!results)
    //     throw new Error("No design found for the filter selection.");
    //   setPreviewDesigns(results.designs);
    //   setPreviewDesignsLoading(false);
    // } catch (error) {
    //   console.error("Couldn't get preview designs: ", error);
    //   setPreviewDesigns(null);
    //   setPreviewDesignsLoading(false);
    // }
  }

  useEffect(() => {
    getPreviewDesigns();
  }, [selectedCategory, selectedSubcategoryIndex]);

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
          // selectedCategory={selectedCategoryInParams}
          selectedCategory={selectedCategory?.name}
          onClickFilterButton={clickFilterButton}
        />
        <Subcategories
          subcategories={subcategoriesToShow}
          selectedIndex={selectedSubcategoryIndex}
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
      {/* <div className={styles["filter-action-button-row"]}>
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
      </div> */}
    </Modal>
  );
}

type ParentCategoriesProps = {
  // categoriesToShow: CategoryData[] | null;
  categoriesToShow: DesignCategory[] | undefined;
  selectedCategory: string | undefined;
  onClickFilterButton: (
    buttonType: "Category" | "Subcategory",
    clickedIndex: number
  ) => void;
};

function ParentCategories({
  categoriesToShow,
  selectedCategory,
  onClickFilterButton,
}: ParentCategoriesProps) {
  return (
    <div className={styles["parent-category-column"]}>
      {categoriesToShow?.map((category, i) => (
        <>
          <input
            className="button-styled-checkbox"
            type="checkbox"
            name="parent-category"
            id={`${buttonIdPrefix}${category.name}`}
            onChange={(e) => onClickFilterButton("Category", i)}
            checked={category.name === selectedCategory}
          />
          <label htmlFor={`${buttonIdPrefix}${category.name}`}>
            {category.name}
          </label>
        </>
      ))}
    </div>
  );
}

type SubcategoriesProps = {
  subcategories: DesignSubcategory[] | undefined;
  selectedIndex: number;
  onClickFilterButton: (
    buttonType: "Category" | "Subcategory",
    clickedIndex: number
  ) => void;
};

function Subcategories({
  subcategories,
  selectedIndex,
  onClickFilterButton,
}: SubcategoriesProps) {
  return (
    <>
      <div>
        <h3>Subcategories</h3>
        <div
          className={styles["subcategories-container"]}
          style={{
            overflowY:
              subcategories &&
              subcategories.length > maxSubcategoriesBeforeScrollable
                ? "scroll"
                : undefined,
          }}
        >
          {subcategories &&
            subcategories.map((subcategory, i) => (
              <>
                <label htmlFor={`${buttonIdPrefix}${subcategory.name}`}>
                  <input
                    type="checkbox"
                    name="subcategory"
                    id={`${buttonIdPrefix}${subcategory.name}`}
                    onChange={(e) => onClickFilterButton("Subcategory", i)}
                    checked={i === selectedIndex}
                  />
                  {subcategory.name}
                </label>
              </>
            ))}
        </div>
      </div>
    </>
  );
}
