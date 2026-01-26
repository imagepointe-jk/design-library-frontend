import { useEffect, useState } from "react";
import { pageSizeChoices } from "../constants";
import { getDesigns } from "../fetch";
import {
  createNavigationUrl,
  getModifiedQueryParams,
  parseDesignQueryParams,
  updateWindowSearchParams,
} from "../query";
import { DesignResults } from "../types";
import { useApp } from "./AppProvider";
import { DesignGrid } from "./DesignGrid";
import { DesignLibraryControls } from "./DesignLibraryControls";
import { LoadingIndicator } from "./LoadingIndicator";
import { PageControls } from "./PageControls";
import { Sidebar, changeDesignType } from "./Sidebar";
import { ToggleSwitch } from "./ToggleSwitch";
import { TopSection } from "./TopSection";
import styles from "./styles/DesignLibrary.module.css";

export function DesignLibrary() {
  const [designResults, setDesignResults] = useState<DesignResults | null>(
    null
  );
  const designQueryParams = parseDesignQueryParams(
    new URLSearchParams(window.location.search)
  );
  const [isFetchingResults, setIsFetchingResults] = useState(true);
  const { windowWidth } = useApp();

  async function getDesignsToDisplay() {
    try {
      setIsFetchingResults(true);
      const fetchedDesigns = await getDesigns(
        window.location.search.replace("?", "")
      );
      setIsFetchingResults(false);
      setDesignResults(fetchedDesigns);
    } catch (error) {
      setIsFetchingResults(false);
      console.error(error);
    }
  }

  function clearSearch() {
    let modifiedParams = getModifiedQueryParams(
      window.location.search,
      "keyword",
      null
    ).stringified;

    modifiedParams = getModifiedQueryParams(
      modifiedParams,
      "allowDuplicateDesignNumbers",
      null
    ).stringified;
    updateWindowSearchParams(modifiedParams);
  }

  function clearSimilar() {
    const modifiedParams = getModifiedQueryParams(
      window.location.search,
      "similarTo",
      null
    ).stringified;
    updateWindowSearchParams(modifiedParams);
  }

  function handleClickSidebarSubcategory(clickedName: string) {
    let modifiedParams = getModifiedQueryParams(
      window.location.search,
      "age",
      null
    ).stringified;
    modifiedParams = getModifiedQueryParams(
      modifiedParams,
      "subcategory",
      null
    ).stringified;
    if (clickedName === "New Designs") {
      modifiedParams = getModifiedQueryParams(
        modifiedParams,
        "age",
        "new"
      ).stringified;
    } else if (clickedName === "Classics") {
      modifiedParams = getModifiedQueryParams(
        modifiedParams,
        "age",
        "old"
      ).stringified;
    } else {
      modifiedParams = getModifiedQueryParams(
        modifiedParams,
        "subcategory",
        clickedName
      ).stringified;
    }
    updateWindowSearchParams(modifiedParams);
  }

  function clickPageButton(pageNumber: number) {
    const modifiedParams = getModifiedQueryParams(
      window.location.search,
      "pageNumber",
      `${pageNumber}`
    ).stringified;
    updateWindowSearchParams(modifiedParams);
  }

  function jumpToPage(jumpToPage: number) {
    const modifiedParams = getModifiedQueryParams(
      window.location.search,
      "pageNumber",
      `${jumpToPage}`
    ).stringified;
    updateWindowSearchParams(modifiedParams);
  }

  function changeResultsPerPage(count: number) {
    const modifiedParams = getModifiedQueryParams(
      window.location.search,
      "perPage",
      `${count}`
    ).stringified;
    updateWindowSearchParams(modifiedParams);
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
                  href={createNavigationUrl(designQueryParams.similarTo)}
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
                {(!designResults || designResults.totalResults === 0) &&
                  !isFetchingResults && <h3>No results</h3>}
                {designResults &&
                  designResults.designs.length > 0 &&
                  !isFetchingResults && (
                    <DesignGrid designs={designResults.designs} />
                  )}
              </div>
              {designResults &&
                designResults.designs.length > 0 &&
                !isFetchingResults && (
                  <PageControls
                    totalPages={pageCount}
                    pageSizeChoices={pageSizeChoices}
                    curItemsPerPage={designQueryParams.perPage || 0}
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
