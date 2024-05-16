// import { DesignQueryParams } from "../types";
// import { createNavigationUrl, getTimeStampYearsAgo } from "../utility";
// import { parseSearchParams } from "../validations";
import {
  createNavigationUrl,
  getDefaultQueryParams,
  getModifiedQueryParams,
  parseDesignQueryParams,
  updateWindowSearchParams,
} from "../query";
import { useApp } from "./AppProvider";
import { submitSearch } from "./SearchArea";
import styles from "./styles/DesignLibrary.module.css";

export function DesignLibraryControls() {
  const { setModalDisplay, compareModeData, setCompareModeActive } = useApp();
  // const designQueryParams = parseSearchParams(
  //   new URLSearchParams(window.location.search)
  // );
  const designQueryParams = parseDesignQueryParams(
    new URLSearchParams(window.location.search)
  );
  const buttonIdPrefix = "library-page-filter-button-";
  const checkboxButtons = ["All Designs", "New Designs", "Best Sellers"];
  const selectedSubcategory = designQueryParams.subcategory
    ? decodeURIComponent(designQueryParams.subcategory)
    : undefined;
  console.log("selected", selectedSubcategory);

  function clickQuickFilterButton(
    e: React.ChangeEvent<HTMLInputElement>,
    filterName: string
  ) {
    const isChecked = e.target.checked;
    // const newParams: DesignQueryParams = {
    //   ...designQueryParams,
    //   pageNumber: 1,
    // };

    // if (filterName === "All Designs") {
    //   newParams.category = undefined;
    //   newParams.subcategory = undefined;
    //   newParams.after = undefined;
    //   newParams.before = undefined;
    //   newParams.featuredOnly = !isChecked;
    // } else if (filterName === "New Designs") {
    //   newParams.category = undefined;
    //   newParams.subcategory = undefined;
    //   newParams.featuredOnly = !isChecked;
    //   newParams.after = getTimeStampYearsAgo(2);
    // } else {
    //   newParams.category = isChecked ? "Quick Search" : undefined;
    //   newParams.subcategory = isChecked ? filterName : undefined;
    //   newParams.featuredOnly = !isChecked;
    // }

    // window.location.href = createNavigationUrl(newParams);

    let params = getDefaultQueryParams().stringified;
    if (filterName === "All Designs") {
      if (!isChecked) {
        params = getModifiedQueryParams(params, "featured", "true").stringified;
      }
    } else if (filterName === "New Designs") {
      if (isChecked) {
        params = getModifiedQueryParams(params, "age", "new").stringified;
      } else {
        params = getModifiedQueryParams(params, "age", null).stringified;
      }
    } else if (filterName === "Best Sellers") {
      if (isChecked) {
        params = getModifiedQueryParams(
          params,
          "subcategory",
          encodeURIComponent("Best Sellers")
        ).stringified;
      } else {
        params = getModifiedQueryParams(
          params,
          "subcategory",
          null
        ).stringified;
      }
    }

    updateWindowSearchParams(params);
  }

  function clickCompareButton() {
    if (!compareModeData || !setCompareModeActive) return;
    setCompareModeActive(!compareModeData.active);
  }

  const allDesignsButtonChecked =
    designQueryParams &&
    !designQueryParams.featuredOnly &&
    !designQueryParams.category &&
    !designQueryParams.subcategory &&
    !designQueryParams.before &&
    !designQueryParams.after;
  //assume for now that the "after" param will only be set to a value corresponding to "new" designs
  const newDesignsButtonChecked = designQueryParams.after !== undefined;

  return (
    <>
      <div className={styles["mobile-search-container"]}>
        <form onSubmit={submitSearch}>
          <input type="search" name="search" placeholder="Search designs..." />
          <button type="submit" className={styles["mobile-search-button"]}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </form>
      </div>
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
                  (button === "New Designs" && newDesignsButtonChecked) ||
                  button === selectedSubcategory
                }
                onChange={(e) => clickQuickFilterButton(e, button)}
              />
              <label htmlFor={`${buttonIdPrefix}${button}`}>{button}</label>
            </>
          ))}
        </div>
        <div className={styles["settings-subcontainer"]}>
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
            className={`${styles["control-button"]} ${
              compareModeData?.active ? styles["stop"] : ""
            }`}
            onClick={clickCompareButton}
          >
            <i className="fa-solid fa-grip"></i>
            Compare
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
    </>
  );
}
