import { useEffect, useState } from "react";
import { getDesigns } from "../fetch";
import { TempDesignResults } from "../sharedTypes";
import { buildDesignQueryParams } from "../utility";
import { parseSearchParams } from "../validations";
import { useApp } from "./AppProvider";
import { DesignGrid } from "./DesignGrid";
import { DesignLibraryControls } from "./DesignLibraryControls";
import { LoadingIndicator } from "./LoadingIndicator";
import { PageControls } from "./PageControls";
import styles from "./styles/DesignLibrary.module.css";

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
    try {
      setIsFetchingResults(true);
      const fetchedDesigns = await getDesigns(
        buildDesignQueryParams(designQueryParams)
      );
      setIsFetchingResults(false);
      setDesignResults(fetchedDesigns);
    } catch (error) {
      setIsFetchingResults(false);
      console.error(error);
    }
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
          {keywordsAsString && (
            <h2>
              Searching for{" "}
              <span className={styles["searching-for-keywords"]}>
                "{keywordsAsString}"
              </span>
            </h2>
          )}
          <div className={styles["search-container"]}>
            <DesignLibraryControls />
            {isFetchingResults && <LoadingIndicator />}
            {designResults &&
              designResults.designs.length === 0 &&
              !isFetchingResults && <h3>No results</h3>}
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
    </>
  );
}
