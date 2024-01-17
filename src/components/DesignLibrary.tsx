import { useEffect, useState } from "react";
import { getDesigns } from "../fetch";
import { DesignQueryParams, TempDesignResults } from "../types";
import {
  buildDesignQueryParams,
  requestParentWindowAdaptToAppHeight,
  requestParentWindowQueryChange,
  splitDesignCategoryHierarchy,
} from "../utility";
import { parseSearchParams } from "../validations";
import { useApp } from "./AppProvider";
import { DesignGrid } from "./DesignGrid";
import { DesignLibraryControls } from "./DesignLibraryControls";
import { LoadingIndicator } from "./LoadingIndicator";
import { PageControls } from "./PageControls";
import styles from "./styles/DesignLibrary.module.css";
import { HierarchyItem, HierarchyList } from "./HierarchyList";

export function DesignLibrary() {
  const [designResults, setDesignResults] = useState<TempDesignResults | null>(
    null
  );
  const { parentWindowLocation, categories } = useApp();
  const designQueryParams = parseSearchParams(
    new URLSearchParams(parentWindowLocation?.search)
  );
  const [isFetchingResults, setIsFetchingResults] = useState(true);

  async function getDesignsToDisplay() {
    try {
      setIsFetchingResults(true);
      const fetchedDesigns = await getDesigns(
        buildDesignQueryParams(designQueryParams)
      );
      setIsFetchingResults(false);
      setDesignResults(fetchedDesigns);
      requestParentWindowAdaptToAppHeight();
    } catch (error) {
      setIsFetchingResults(false);
      console.error(error);
    }
  }

  function clearSearch() {
    if (!parentWindowLocation) return;

    const newParams: DesignQueryParams = {
      ...designQueryParams,
      keywords: undefined,
      allowDuplicateDesignNumbers: false,
    };
    requestParentWindowQueryChange(parentWindowLocation.url, newParams);
  }

  function handleClickSidebarSubcategory(hierarchy: string) {
    if (!parentWindowLocation) return;
    const hierarchySplit = splitDesignCategoryHierarchy(hierarchy);

    const newParams: DesignQueryParams = {
      ...designQueryParams,
      category: hierarchySplit.category,
      subcategory: hierarchySplit.subcategory,
      featuredOnly: false,
      pageNumber: 1,
    };

    requestParentWindowQueryChange(parentWindowLocation?.url, newParams);
  }

  useEffect(() => {
    getDesignsToDisplay();
  }, []);

  const keywordsAsString =
    designQueryParams?.keywords !== undefined
      ? designQueryParams.keywords.join(" ")
      : undefined;
  const pageCount = designResults
    ? Math.ceil(designResults.total / designResults.perPage)
    : 0;

  const filterSidebarHierarchy: HierarchyItem[] = categories
    ? categories
        .filter(
          (category) => category.DesignType === designQueryParams.designType
        )
        .map((category) => ({
          parentName: category.Name,
          selected: designQueryParams.category === category.Name,
          onClickParent: () => requestParentWindowAdaptToAppHeight(),
          children: category.Subcategories.map((subcategory) => ({
            childName: subcategory.Name,
            selected: subcategory.Name === designQueryParams.subcategory,
            onClickChild: () =>
              handleClickSidebarSubcategory(subcategory.Hierarchy),
          })),
        }))
    : [];

  return (
    <>
      <div className={styles["bg"]}>
        <div className="inner-body">
          {keywordsAsString && (
            <div className={styles["searching-for-area"]}>
              <h2>
                Searching for{" "}
                <span className={styles["searching-for-keywords"]}>
                  "{keywordsAsString}"
                </span>
              </h2>
              <button onClick={clearSearch}>
                <i className="fa-solid fa-xmark"></i>Clear Search
              </button>
            </div>
          )}
          <div className={styles["main-flex"]}>
            <HierarchyList
              hierarchy={filterSidebarHierarchy}
              defaultExpandedParent={designQueryParams.category}
              mainClassName={styles["sidebar"]}
              parentClassName={styles["sidebar-parent"]}
              parentSelectedClassName={styles["sidebar-parent-selected"]}
              childClassName={styles["sidebar-child"]}
              childSelectedClassName={styles["sidebar-child-selected"]}
            />
            <div>
              <div className={styles["search-container"]}>
                <DesignLibraryControls />
                {isFetchingResults && <LoadingIndicator />}
                {!designResults && !isFetchingResults && <h3>No results</h3>}
                {designResults &&
                  designResults.designs.length > 0 &&
                  !isFetchingResults && (
                    <DesignGrid designs={designResults.designs} />
                  )}
              </div>
              {designResults && !isFetchingResults && (
                <PageControls totalPages={pageCount} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
