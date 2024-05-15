import {
  getModifiedQueryParams,
  parseDesignQueryParams,
  updateWindowSearchParams,
} from "../query";
import { DesignType } from "../sharedTypes";
// import { DesignQueryParams } from "../types";
// import { createNavigationUrl } from "../utility";
// import { parseSearchParams } from "../validations";
import { useApp } from "./AppProvider";
import { HierarchyItem, HierarchyList } from "./HierarchyList";
import { submitSearch } from "./SearchArea";
import { ToggleSwitch } from "./ToggleSwitch";
import "./styles/Sidebar.css";
import styles from "./styles/Sidebar.module.css";

type SidebarProps = {
  onClickSidebarSubcategory: (clicked: string) => void;
};

export function Sidebar({ onClickSidebarSubcategory }: SidebarProps) {
  const { categories } = useApp();
  const designQueryParams = parseDesignQueryParams(
    new URLSearchParams(window.location.search)
  );
  const filterSidebarHierarchy: HierarchyItem[] = categories
    ? categories
        .filter(
          (category) =>
            category.designType.name.toLocaleLowerCase() ===
            designQueryParams.designType.toLocaleLowerCase()
        )
        .map((category) => ({
          parentName:
            category.name === "Event/Awareness"
              ? "Event / Awareness"
              : category.name,
          selected: designQueryParams.category === category.name,
          children: category.designSubcategories.map((subcategory) => ({
            childName: subcategory.name,
            selected: subcategory.name === designQueryParams.subcategory,
            onClickChild: () => onClickSidebarSubcategory(subcategory.name),
          })),
        }))
    : [];

  const filtersActive =
    designQueryParams.category !== undefined ||
    designQueryParams.subcategory !== undefined;

  function handleClearFilters() {
    // const newParams: DesignQueryParams = {
    //   ...designQueryParams,
    //   category: undefined,
    //   subcategory: undefined,
    //   pageNumber: 1,
    // };

    // window.location.href = createNavigationUrl(newParams);
    const withoutCategory = getModifiedQueryParams(
      window.location.search,
      "category",
      null
    ).stringified;
    const withoutSubcategory = getModifiedQueryParams(
      withoutCategory,
      "subcategory",
      null
    ).stringified;
    updateWindowSearchParams(withoutSubcategory);
  }

  function changeDesignType(newType: DesignType) {
    // const newParams: DesignQueryParams = {
    //   ...designQueryParams,
    //   designType: newType,
    //   category: undefined,
    //   subcategory: undefined,
    //   featuredOnly: newType === "Screen Print",
    //   pageNumber: 1,
    // };

    // window.location.href = createNavigationUrl(newParams);
    const withoutCategory = getModifiedQueryParams(
      window.location.search,
      "category",
      null
    ).stringified;
    const withoutSubcategory = getModifiedQueryParams(
      withoutCategory,
      "subcategory",
      null
    ).stringified;
    const withPageNumber = getModifiedQueryParams(
      withoutSubcategory,
      "pageNumber",
      "1"
    ).stringified;
    const withNewType = getModifiedQueryParams(
      withPageNumber,
      "designType",
      newType
    ).stringified;

    updateWindowSearchParams(withNewType);
  }

  return (
    <div className={styles["main"]}>
      <form onSubmit={submitSearch}>
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Search designs..."
        />
        <button type="submit">Search</button>
      </form>
      <div>
        <h2>Choose Library</h2>
        <ToggleSwitch
          option1={{
            id: "Screen Print",
            label: "Screen Print",
          }}
          option2={{
            id: "Embroidery",
            label: "Embroidery",
          }}
          name="Library"
          stacked={true}
          checked={
            designQueryParams.designType.toLocaleLowerCase() === "screen print"
              ? "one"
              : "two"
          }
          onClick={(clicked) =>
            changeDesignType(clicked === "one" ? "Screen Print" : "Embroidery")
          }
        />
      </div>
      <i className="fa-solid fa-sliders"></i>
      <h2 className={styles["filters-heading"]}>Filters</h2>
      {filtersActive && (
        <button
          id="design-library-sidebar-clear-button"
          onClick={handleClearFilters}
        >
          <i className="fa-solid fa-xmark"></i>clear
        </button>
      )}
      <HierarchyList
        hierarchy={filterSidebarHierarchy}
        defaultExpandedParent={designQueryParams.category}
        parentClassName={styles["filter-parent"]}
        parentSelectedClassName={styles["filter-parent-selected"]}
        parentExpandedClassName={styles["filter-parent-expanded"]}
        childClassName={styles["filter-child"]}
        childSelectedClassName={styles["filter-child-selected"]}
      />
    </div>
  );
}
