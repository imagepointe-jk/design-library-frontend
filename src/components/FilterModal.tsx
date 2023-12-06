import { DesignQueryParams } from "../types";
import { deduplicateStrings } from "../utility";
import { useApp } from "./AppProvider";
import { ErrorPage } from "./ErrorScreen";
import { Modal } from "./Modal";
import styles from "./styles/FilterModal.module.css";

type FilterModalProps = {
  clickAwayFunction: () => void;
};

export function FilterModal({ clickAwayFunction }: FilterModalProps) {
  const { subcategoriesData, designQueryParams, updateDesignQueryParams } =
    useApp();
  const selectedCategory = designQueryParams?.category;
  const selectedSubcategory = designQueryParams?.subcategory;

  const parentCategories =
    subcategoriesData &&
    deduplicateStrings(
      subcategoriesData.map((subcategoryData) => subcategoryData.ParentCategory)
    );

  const subcategoriesToShow =
    subcategoriesData &&
    subcategoriesData.filter(
      (subcategory) =>
        subcategory.ParentCategory === designQueryParams?.category
    );

  const buttonIdPrefix = "filter-modal-filter-button-";

  function clickFilterButton(
    buttonType: "Featured" | "Category" | "Subcategory",
    value: string | null
  ) {
    if (!designQueryParams || !updateDesignQueryParams) return;
    const newParams: DesignQueryParams = { ...designQueryParams };

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

    updateDesignQueryParams(newParams);
  }

  if (
    !parentCategories ||
    !subcategoriesToShow ||
    !designQueryParams ||
    !updateDesignQueryParams
  )
    return (
      <Modal clickAwayFunction={clickAwayFunction}>
        <ErrorPage />
      </Modal>
    );

  return (
    <Modal clickAwayFunction={clickAwayFunction}>
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
                      designQueryParams.featuredOnly) ||
                    buttonName === selectedCategory
                  }
                />
                <label htmlFor={`${buttonIdPrefix}${buttonName}`}>
                  {buttonName}
                </label>
              </>
            ))}
            <button>Apply Filters</button>
            <button>Clear Selection</button>
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
    </Modal>
  );
}
