import { useEffect, useState } from "react";
import { pageSizeChoices } from "../constants";
import { getDesigns } from "../fetch";
import { DesignQueryParams, TempDesignResults } from "../types";
import {
  buildDesignQueryParams,
  createNavigationUrl,
  splitDesignCategoryHierarchy,
} from "../utility";
import { parseSearchParams } from "../validations";
import { DesignGrid } from "./DesignGrid";
import { DesignLibraryControls } from "./DesignLibraryControls";
import { LoadingIndicator } from "./LoadingIndicator";
import { PageControls } from "./PageControls";
import { Sidebar } from "./Sidebar";
import { TopSection } from "./TopSection";
import styles from "./styles/DesignLibrary.module.css";

export function DesignLibrary() {
  const [designResults, setDesignResults] = useState<TempDesignResults | null>(
    null
  );
  const designQueryParams = parseSearchParams(
    new URLSearchParams(window.location.search)
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
    const designQueryParamsToUse: DesignQueryParams = {
      ...designQueryParams,
      shouldExcludePrioritized,
      sortBy: "priority",
    };
    try {
      setIsFetchingResults(true);
      const fetchedDesigns = await getDesigns(
        buildDesignQueryParams(designQueryParamsToUse)
      );
      setIsFetchingResults(false);
      setDesignResults(fetchedDesigns);
    } catch (error) {
      setIsFetchingResults(false);
      console.error(error);
    }
  }

  function clearSearch() {
    const newParams: DesignQueryParams = {
      ...designQueryParams,
      keywords: undefined,
      allowDuplicateDesignNumbers: false,
    };
    window.location.href = createNavigationUrl(newParams);
  }

  function handleClickSidebarSubcategory(hierarchy: string) {
    const hierarchySplit = splitDesignCategoryHierarchy(hierarchy);

    const newParams: DesignQueryParams = {
      ...designQueryParams,
      category: hierarchySplit.category,
      subcategory: hierarchySplit.subcategory,
      featuredOnly: false,
      pageNumber: 1,
    };

    window.location.href = createNavigationUrl(newParams);
  }

  function clickPageButton(pageNumber: number) {
    const newParams: DesignQueryParams = {
      ...designQueryParams,
      pageNumber: pageNumber,
    };

    window.location.href = createNavigationUrl(newParams);
  }

  function jumpToPage(jumpToPage: number) {
    const newParams: DesignQueryParams = {
      ...designQueryParams,
      pageNumber: +jumpToPage,
    };

    window.location.href = createNavigationUrl(newParams);
  }

  function changeResultsPerPage(count: number) {
    const newParams: DesignQueryParams = {
      ...designQueryParams,
      pageNumber: 1,
      countPerPage: count,
    };

    window.location.href = createNavigationUrl(newParams);
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
