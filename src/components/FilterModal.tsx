import { deduplicateStrings } from "../utility";
import { useApp } from "./AppProvider";
import { ErrorPage } from "./ErrorScreen";
import { Modal } from "./Modal";
import styles from "./styles/FilterModal.module.css";

type FilterModalProps = {
  clickAwayFunction: () => void;
};

export function FilterModal({ clickAwayFunction }: FilterModalProps) {
  const {
    subcategoriesData,
    selectedCategory,
    selectedSubcategory,
    clickCategory,
    clickSubcategory,
  } = useApp();

  const parentCategories =
    subcategoriesData &&
    deduplicateStrings(
      subcategoriesData.map((subcategoryData) => subcategoryData.ParentCategory)
    );

  const subcategoriesToShow =
    subcategoriesData &&
    subcategoriesData.filter(
      (subcategory) => subcategory.ParentCategory === selectedCategory
    );

  const buttonIdPrefix = "filter-modal-filter-button-";

  if (
    !parentCategories ||
    !subcategoriesToShow ||
    !clickCategory ||
    !clickSubcategory
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
            <input
              className="button-styled-checkbox"
              type="checkbox"
              name="parent-category"
              id={`${buttonIdPrefix}Featured`}
              onChange={(e) => clickCategory(e, "Featured")}
              checked={selectedCategory === "Featured"}
            />
            <label htmlFor={`${buttonIdPrefix}Featured`}>Featured</label>
            {parentCategories.map((category) => (
              <>
                <input
                  className="button-styled-checkbox"
                  type="checkbox"
                  name="parent-category"
                  id={`${buttonIdPrefix}${category}`}
                  onChange={(e) => clickCategory(e, category)}
                  checked={category === selectedCategory}
                />
                <label htmlFor={`${buttonIdPrefix}${category}`}>
                  {category}
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
                  onChange={(e) => clickSubcategory(e, subcategory.Name)}
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
