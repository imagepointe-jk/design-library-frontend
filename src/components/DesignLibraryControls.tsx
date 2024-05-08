import { DesignType, designTypes } from "../sharedTypes";
import { DesignQueryParams } from "../types";
import { createNavigationUrl } from "../utility";
import { parseSearchParams } from "../validations";
import { useApp } from "./AppProvider";
import styles from "./styles/DesignLibrary.module.css";

export function DesignLibraryControls() {
  const { setModalDisplay, compareModeData, setCompareModeActive } = useApp();
  const designQueryParams = parseSearchParams(
    new URLSearchParams(window.location.search)
  );
  const buttonIdPrefix = "library-page-filter-button-";
  const checkboxButtons = ["All Designs", "New Designs", "Best Sellers"];
  const selectedSubcategory = designQueryParams.subcategory;

  function clickQuickFilterButton(
    e: React.ChangeEvent<HTMLInputElement>,
    filterName: string
  ) {
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
      newParams.featuredOnly = !isChecked;
    }

    window.location.href = createNavigationUrl(newParams);
  }

  function clickCompareButton() {
    if (!compareModeData || !setCompareModeActive) return;
    setCompareModeActive(!compareModeData.active);
  }

  const allDesignsButtonChecked =
    designQueryParams &&
    !designQueryParams.featuredOnly &&
    !designQueryParams.category &&
    !designQueryParams.subcategory;

  return (
    <div className={styles["settings-container"]}>
      <div className={styles["settings-subcontainer"]}>
        {checkboxButtons.map((button) => (
          <>
            <input
              className="button-styled-checkbox"
              type="checkbox"
              name={button}
              id={`${buttonIdPrefix}${button}`}
              checked={
                (button === "All Designs" && allDesignsButtonChecked) ||
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
            if (setModalDisplay) setModalDisplay("filters");
          }}
        >
          <i className="fa-solid fa-sliders"></i>
          Filters
        </button>
        <button
          className={styles["settings-button"]}
          onClick={() => {
            if (setModalDisplay) setModalDisplay("search");
          }}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
          Search
        </button>
        <button
          className={`${styles["control-button"]} ${
            compareModeData?.active ? styles["stop"] : ""
          }`}
          onClick={clickCompareButton}
        >
          <i className="fa-solid fa-grip"></i>
          {compareModeData?.active ? "Stop Comparing" : "Compare"}
        </button>
        <a
          href={createNavigationUrl("cart")}
          className={styles["control-button"]}
        >
          <span>
            <i className="fa-solid fa-cart-shopping"></i>
            Quote Request
          </span>
        </a>
      </div>
    </div>
  );
}
