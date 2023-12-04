import { Modal } from "./Modal";
import styles from "./styles/FilterModal.module.css";

type FilterModalProps = {
  clickAwayFunction: () => void;
};

export function FilterModal({ clickAwayFunction }: FilterModalProps) {
  const mainCategories = [
    {
      label: "Quick Search",
      name: "quick-search",
    },
    {
      label: "Event/Awareness",
      name: "event-awareness",
    },
    {
      label: "Union Specific",
      name: "union-specific",
    },
    {
      label: "Holidays",
      name: "holidays",
    },
    {
      label: "Location Specific",
      name: "location-specific",
    },
  ];

  const subcategories = [
    {
      label: "New Designs",
      name: "new-designs",
    },
    {
      label: "Best Sellers",
      name: "best-sellers",
    },
    {
      label: "Staff Favorites",
      name: "staff-favorites",
    },
    {
      label: "Classics",
      name: "classics",
    },
    {
      label: "Patriotic",
      name: "patriotic",
    },
    {
      label: "Solidarity",
      name: "solidarity",
    },
    {
      label: "Economy",
      name: "economy",
    },
    {
      label: "Ladies",
      name: "ladies",
    },
    {
      label: "All Designs",
      name: "all-designs",
    },
  ];

  return (
    <Modal clickAwayFunction={clickAwayFunction}>
      <h2>Screen Print Design Library Filters</h2>
      <p>Select a main category on the left and a subcategory below</p>
      <div className={styles["main-flex"]}>
        <div>
          {mainCategories.map((category) => (
            <div>
              <input
                className="button-styled-checkbox"
                type="checkbox"
                name={category.name}
                id={category.name}
              />
              <label htmlFor={category.name}>{category.label}</label>
            </div>
          ))}
          <button>Apply Filters</button>
          <button>Clear Selection</button>
        </div>
      </div>
    </Modal>
  );
}
