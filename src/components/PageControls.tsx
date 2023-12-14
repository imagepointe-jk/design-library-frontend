// import { useSearchParams } from "react-router-dom";
import styles from "./styles/PageControls.module.css";
import { parseSearchParams } from "../validations";
import { DesignQueryParams } from "../types";
import { buildDesignQueryParams } from "../utility";
import { useApp } from "./AppProvider";

type PageControlsProps = {
  totalPages: number;
};

export function PageControls({ totalPages }: PageControlsProps) {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const designQueryParams = parseSearchParams(searchParams);
  const { parentWindowLocation } = useApp();
  const designQueryParams = parseSearchParams(
    new URLSearchParams(parentWindowLocation?.search)
  );

  const useSplitView = totalPages > 5; //whether we should show page buttons as: 1, 2, 3, ... 23 (for example)
  const consecutiveButtons = useSplitView ? 3 : totalPages;
  const arr = Array.from({ length: consecutiveButtons }, () => 0);
  const curPageNumber = designQueryParams.pageNumber;
  const curPerPage = designQueryParams.countPerPage;
  const perPageChoices = [3, 5, 7];

  function clickPageButton(pageNumber: number) {
    const newParams: DesignQueryParams = {
      ...designQueryParams,
      pageNumber: pageNumber,
    };
    // setSearchParams(buildDesignQueryParams(newParams));
  }

  function submitJumpToPage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const jumpToPage = formData.get("jump-to-page");
    if (
      !jumpToPage ||
      isNaN(+jumpToPage) ||
      +jumpToPage > totalPages ||
      +jumpToPage === curPageNumber
    )
      return;

    const newParams: DesignQueryParams = {
      ...designQueryParams,
      pageNumber: +jumpToPage,
    };
    // setSearchParams(buildDesignQueryParams(newParams));
  }

  function changeResultsPerPage(count: number) {
    const newParams: DesignQueryParams = {
      ...designQueryParams,
      pageNumber: 1,
      countPerPage: count,
    };
    // setSearchParams(buildDesignQueryParams(newParams));
  }

  return (
    <div className={styles["main"]}>
      <div className={styles["controls-subsection"]}>
        {arr.map((_, i) => (
          <button
            className={
              curPageNumber === i + 1
                ? styles["page-active"]
                : styles["page-inactive"]
            }
            style={{
              pointerEvents: curPageNumber === i + 1 ? "none" : "initial",
            }}
            onClick={() => clickPageButton(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        {useSplitView && (
          <>
            <div>...</div>
            <button
              className={
                curPageNumber === totalPages
                  ? styles["page-active"]
                  : styles["page-inactive"]
              }
              style={{
                pointerEvents:
                  curPageNumber === totalPages ? "none" : "initial",
              }}
              onClick={() => clickPageButton(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>
      <div className={styles["controls-subsection"]}>
        <div>Jump To</div>
        <form
          className={styles["controls-subsection"]}
          onSubmit={submitJumpToPage}
        >
          <input
            className={styles["jump-to-page-input"]}
            type="number"
            name="jump-to-page"
            id="jump-to-page"
          />
          <button type="submit">Go</button>
        </form>
      </div>
      <div className={styles["controls-subsection"]}>
        <div>Results Per Page</div>
        {perPageChoices.map((choice, i) => (
          <button
            className={
              (i === 0 && !curPerPage) || curPerPage === choice
                ? ""
                : "button-minor"
            }
            style={{
              pointerEvents:
                (i === 0 && !curPerPage) || curPerPage === choice
                  ? "none"
                  : "initial",
            }}
            onClick={() => changeResultsPerPage(choice)}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
