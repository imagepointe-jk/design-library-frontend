import { deduplicateStrings } from "../utility";
import { useApp } from "./AppProvider";
import { Modal } from "./Modal";
import styles from "./styles/FilterModal.module.css";

type FilterModalProps = {
  clickAwayFunction: () => void;
};

export function FilterModal({ clickAwayFunction }: FilterModalProps) {
  const { subcategoriesData, selectedCategory, setSelectedCategory } = useApp();

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

  function clickCategory(e: React.ChangeEvent<HTMLInputElement>) {
    if (!setSelectedCategory) return;

    if (!e.target.checked) setSelectedCategory(null);
    else {
      setSelectedCategory(e.target.id);
    }
  }

  return (
    <Modal clickAwayFunction={clickAwayFunction}>
      {parentCategories && subcategoriesToShow && (
        <>
          <h2>Screen Print Design Library Filters</h2>
          <p>Select a main category on the left and a subcategory below</p>
          <div className={styles["main-flex"]}>
            <div className={styles["parent-category-column"]}>
              <input
                className="button-styled-checkbox"
                type="checkbox"
                name="parent-category"
                id="Featured"
                onChange={clickCategory}
                checked={selectedCategory === "Featured"}
              />
              <label htmlFor="Featured">Featured</label>
              {parentCategories.map((category) => (
                <>
                  <input
                    className="button-styled-checkbox"
                    type="checkbox"
                    name="parent-category"
                    id={category}
                    onChange={clickCategory}
                    checked={category === selectedCategory}
                  />
                  <label htmlFor={category}>{category}</label>
                </>
              ))}
              <button>Apply Filters</button>
              <button>Clear Selection</button>
            </div>
            <div>
              {subcategoriesToShow.map((subcategory) => (
                <div>{subcategory.Name}</div>
              ))}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
