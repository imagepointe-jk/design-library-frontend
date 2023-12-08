import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getDesigns } from "../fetch";
import { TempDesignWithImages } from "../sharedTypes";
import { buildDesignQueryParams } from "../utility";
import { parseSearchParams } from "../validations";
import { DesignGrid } from "./DesignGrid";
import { DesignLibraryControls } from "./DesignLibraryControls";
import { DesignModal } from "./DesignModal";
import { FilterModal } from "./FilterModal";
import { LoadingIndicator } from "./LoadingIndicator";
import { SearchModal } from "./SearchModal";
import styles from "./styles/DesignLibrary.module.css";

export function DesignLibrary() {
  const { designNumber: designNumberStr } = useParams();
  const [designs, setDesigns] = useState<TempDesignWithImages[] | undefined>(
    undefined
  );
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchParams] = useSearchParams();
  const designQueryParams = parseSearchParams(searchParams);
  const [isFetchingResults, setIsFetchingResults] = useState(true);

  const designId = designNumberStr !== undefined ? +designNumberStr : 0;

  async function getDesignsToDisplay() {
    try {
      setIsFetchingResults(true);
      const fetchedDesigns = await getDesigns(
        buildDesignQueryParams(designQueryParams)
      );
      setIsFetchingResults(false);
      setDesigns(fetchedDesigns);
    } catch (error) {
      setIsFetchingResults(false);
      console.error(error);
    }
  }

  useEffect(() => {
    getDesignsToDisplay();
  }, [searchParams]);

  const keywordsAsString =
    designQueryParams?.keywords !== undefined
      ? designQueryParams.keywords.join(" ")
      : undefined;

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
            {designs && designs.length === 0 && !isFetchingResults && (
              <h3>No results</h3>
            )}
            {designs && designs.length > 0 && !isFetchingResults && (
              <DesignGrid designs={designs} />
            )}
            {designId !== undefined && designId > 0 && (
              <DesignModal designId={designId} />
            )}
          </div>
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
