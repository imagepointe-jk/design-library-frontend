import { useEffect, useState } from "react";
// import { useParams, useSearchParams } from "react-router-dom";
import { getDesigns } from "../fetch";
import { TempDesignResults, TempDesignWithImages } from "../sharedTypes";
import { buildDesignQueryParams } from "../utility";
import { parseSearchParams } from "../validations";
import { DesignGrid } from "./DesignGrid";
import { DesignLibraryControls } from "./DesignLibraryControls";
import { DesignModal } from "./DesignModal";
import { FilterModal } from "./FilterModal";
import { LoadingIndicator } from "./LoadingIndicator";
import { SearchModal } from "./SearchModal";
import styles from "./styles/DesignLibrary.module.css";
import { PageControls } from "./PageControls";
import { useApp } from "./AppProvider";

export function DesignLibrary() {
  // const { designNumber: designNumberStr } = useParams();
  const [designResults, setDesignResults] = useState<TempDesignResults | null>(
    null
  );
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  // const [searchParams] = useSearchParams();
  const { parentWindowLocation } = useApp();
  const designQueryParams = parseSearchParams(
    new URLSearchParams(parentWindowLocation?.search)
  );
  // const designQueryParams = parseSearchParams(searchParams);
  const [isFetchingResults, setIsFetchingResults] = useState(true);

  // const designId = designNumberStr !== undefined ? +designNumberStr : 0;

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

  // useEffect(() => {
  //   getDesignsToDisplay();
  // }, [searchParams]);

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
          <p className={styles["library-text"]}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
            unde, provident omnis libero corporis minus, voluptas perspiciatis
            deserunt, natus eos eligendi. Impedit veritatis placeat dignissimos
            perferendis possimus distinctio, eos eum!
          </p>
          {keywordsAsString && (
            <h2>
              Searching for{" "}
              <span className={styles["searching-for-keywords"]}>
                "{keywordsAsString}"
              </span>
            </h2>
          )}
          <div className={styles["search-container"]}>
            <DesignLibraryControls
              setShowFilterModal={setShowFilterModal}
              setShowSearchModal={setShowSearchModal}
            />
            {isFetchingResults && <LoadingIndicator />}
            {designResults &&
              designResults.designs.length === 0 &&
              !isFetchingResults && <h3>No results</h3>}
            {designResults &&
              designResults.designs.length > 0 &&
              !isFetchingResults && (
                <DesignGrid designs={designResults.designs} />
              )}
            {/* {designId !== undefined && designId > 0 && (
              <DesignModal designId={designId} />
            )} */}
          </div>
          {designResults && !isFetchingResults && (
            <PageControls totalPages={pageCount} />
          )}
        </div>
      </div>
      {showFilterModal && (
        <FilterModal clickAwayFunction={() => setShowFilterModal(false)} />
      )}
      {showSearchModal && (
        <SearchModal clickAwayFunction={() => setShowSearchModal(false)} />
      )}
    </>
  );
}
