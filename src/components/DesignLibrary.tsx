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
import { pageSizeChoices } from "../constants";
import { TopSection } from "./TopSection";
import { Sidebar } from "./Sidebar";

export function DesignLibrary() {
  const [designResults, setDesignResults] = useState<TempDesignResults | null>(
    null
  );
  const { parentWindowLocation } = useApp();
  const designQueryParams = parseSearchParams(
    new URLSearchParams(parentWindowLocation?.search)
  );
  const [isFetchingResults, setIsFetchingResults] = useState(true);

  async function getDesignsToDisplay() {
    const {
      designType,
      allowDuplicateDesignNumbers,
      category,
      subcategory,
      pageNumber,
      tags,
      keywords,
      featuredOnly,
    } = designQueryParams;
    const shouldExcludePrioritized =
      designType === "Screen Print" &&
      !allowDuplicateDesignNumbers &&
      !category &&
      !subcategory &&
      pageNumber === 1 &&
      !tags &&
      !keywords &&
      !featuredOnly;
    const designQueryParamsToUse = {
      ...designQueryParams,
      shouldExcludePrioritized,
    };
    try {
      setIsFetchingResults(true);
      const fetchedDesigns = await getDesigns(
        buildDesignQueryParams(designQueryParamsToUse)
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

  function clickPageButton(pageNumber: number) {
    if (!parentWindowLocation) return;
    const newParams: DesignQueryParams = {
      ...designQueryParams,
      pageNumber: pageNumber,
    };
    requestParentWindowQueryChange(parentWindowLocation.url, newParams);
  }

  function jumpToPage(jumpToPage: number) {
    if (!parentWindowLocation) return;

    const newParams: DesignQueryParams = {
      ...designQueryParams,
      pageNumber: +jumpToPage,
    };
    requestParentWindowQueryChange(parentWindowLocation.url, newParams);
  }

  function changeResultsPerPage(count: number) {
    if (!parentWindowLocation) return;

    const newParams: DesignQueryParams = {
      ...designQueryParams,
      pageNumber: 1,
      countPerPage: count,
    };
    requestParentWindowQueryChange(parentWindowLocation.url, newParams);
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

  return (
    <>
      <div className={styles["bg"]}>
        <div className="inner-body">
          <TopSection />
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
            <Sidebar
              onClickSidebarSubcategory={handleClickSidebarSubcategory}
            />
            <div>
              <h2>{designQueryParams.designType} Designs</h2>
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
                <PageControls
                  totalPages={pageCount}
                  pageSizeChoices={pageSizeChoices}
                  curItemsPerPage={designQueryParams.countPerPage || 0}
                  curPageNumber={designQueryParams.pageNumber}
                  onClickPageNumber={clickPageButton}
                  onSubmitJumpToPage={jumpToPage}
                  onClickPageSizeButton={changeResultsPerPage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
