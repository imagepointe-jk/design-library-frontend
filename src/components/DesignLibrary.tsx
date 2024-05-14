import { useEffect, useState } from "react";
import { pageSizeChoices } from "../constants";
import { getDesigns } from "../fetch";
import {
  DesignQueryParams,
  DesignResults /*TempDesignResults*/,
} from "../types";
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
import { ToggleSwitch } from "./ToggleSwitch";
import { DesignType } from "../sharedTypes";
import { useApp } from "./AppProvider";

export function DesignLibrary() {
  const [designResults, setDesignResults] = useState<DesignResults | null>(
    null
  );
  const designQueryParams = parseSearchParams(
    new URLSearchParams(window.location.search)
  );
  const [isFetchingResults, setIsFetchingResults] = useState(true);
  const { windowWidth } = useApp();

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
      similarTo,
    } = designQueryParams;
    const shouldExcludePrioritized =
      designType === "Screen Print" &&
      !allowDuplicateDesignNumbers &&
      !category &&
      !subcategory &&
      pageNumber === 1 &&
      !tags &&
      !keywords &&
      !featuredOnly &&
      !similarTo;
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

  function clearSimilar() {
    const newParams: DesignQueryParams = {
      ...designQueryParams,
      similarTo: undefined,
      allowDuplicateDesignNumbers: false,
    };
    window.location.href = createNavigationUrl(newParams);
  }

  function changeDesignType(newType: DesignType) {
    const newParams: DesignQueryParams = {
      ...designQueryParams,
      designType: newType,
      category: undefined,
      subcategory: undefined,
      featuredOnly: newType === "Screen Print",
      pageNumber: 1,
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
    ? Math.ceil(designResults.totalResults / designResults.perPage)
    : 0;

  const showSidebar = windowWidth && windowWidth > 1200;

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
          {designQueryParams.similarTo && (
            <div className={styles["searching-for-area"]}>
              <h2>
                Similar to{" "}
                <a
                  href={createNavigationUrl({
                    designId: designQueryParams.similarTo,
                  })}
                  className="normal-link"
                >
                  #{designQueryParams.similarTo}
                </a>
              </h2>
              <button onClick={clearSimilar}>
                <i className="fa-solid fa-xmark"></i>Clear
              </button>
            </div>
          )}
          <div className={styles["library-info-container"]}>
            <h2 className={styles["library-name"]}>
              {designQueryParams.designType} Designs
            </h2>
            <h2 className={styles["choose-library"]}>Choose Library</h2>
          </div>
          {!showSidebar && (
            <div className={styles["toggle-switch-container"]}>
              <ToggleSwitch
                className={styles["toggle-switch"]}
                option1={{
                  id: "Screen Print",
                  label: "Screen Print",
                }}
                option2={{
                  id: "Embroidery",
                  label: "Embroidery",
                }}
                name="Library"
                stacked={false}
                checked={
                  designQueryParams.designType === "Screen Print"
                    ? "one"
                    : "two"
                }
                onClick={(clicked) =>
                  changeDesignType(
                    clicked === "one" ? "Screen Print" : "Embroidery"
                  )
                }
              />
            </div>
          )}
          {designQueryParams.designType === "Embroidery" && (
            <p className={styles["library-subtext"]}>
              The inspiration library shows current embroidery designs we've
              done for unions and organizations to help you envision and choose
              your next design. Design work is done in-house by our experienced
              Art Team.{" "}
            </p>
          )}
          <div className={styles["main-flex"]}>
            {showSidebar && (
              <Sidebar
                onClickSidebarSubcategory={handleClickSidebarSubcategory}
              />
            )}
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
