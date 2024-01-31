import { DesignQueryParams } from "../types";
import {
  requestParentWindowAdaptToAppHeight,
  requestParentWindowQueryChange,
} from "../utility";
import { parseSearchParams } from "../validations";
import { useApp } from "./AppProvider";
import { HierarchyItem, HierarchyList } from "./HierarchyList";
import { submitSearch } from "./SearchArea";
import "./styles/Sidebar.css";
import styles from "./styles/Sidebar.module.css";

type SidebarProps = {
  onClickSidebarSubcategory: (clicked: string) => void;
};

export function Sidebar({ onClickSidebarSubcategory }: SidebarProps) {
  const { parentWindowLocation, categories } = useApp();
  const designQueryParams = parseSearchParams(
    new URLSearchParams(parentWindowLocation?.search)
  );
  const filterSidebarHierarchy: HierarchyItem[] = categories
    ? categories
        .filter(
          (category) => category.DesignType === designQueryParams.designType
        )
        .map((category) => ({
          parentName:
            category.Name === "Event/Awareness"
              ? "Event / Awareness"
              : category.Name,
          selected: designQueryParams.category === category.Name,
          onClickParent: () => requestParentWindowAdaptToAppHeight(),
          children: category.Subcategories.map((subcategory) => ({
            childName: subcategory.Name,
            selected: subcategory.Name === designQueryParams.subcategory,
            onClickChild: () =>
              onClickSidebarSubcategory(subcategory.Hierarchy),
          })),
        }))
    : [];

  const filtersActive =
    designQueryParams.category !== undefined ||
    designQueryParams.subcategory !== undefined;

  function handleClearFilters() {
    if (!parentWindowLocation) return;

    const newParams: DesignQueryParams = {
      ...designQueryParams,
      category: undefined,
      subcategory: undefined,
      pageNumber: 1,
    };

    requestParentWindowQueryChange(parentWindowLocation?.url, newParams);
  }

  return (
    <div className={styles["main"]}>
      <form onSubmit={(e) => submitSearch(e, parentWindowLocation?.url || "")}>
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Search designs..."
        />
        <button type="submit">Search</button>
      </form>
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
