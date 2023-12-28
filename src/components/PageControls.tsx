import { DesignQueryParams } from "../types";
import {
  addEllipsisToNumberArray,
  getPageControlNumbers,
  requestParentWindowQueryChange,
} from "../utility";
import { parseSearchParams } from "../validations";
import { useApp } from "./AppProvider";
import styles from "./styles/PageControls.module.css";

type PageControlsProps = {
  totalPages: number;
};

export function PageControls({ totalPages }: PageControlsProps) {
  const { parentWindowLocation } = useApp();
  const designQueryParams = parseSearchParams(
    new URLSearchParams(parentWindowLocation?.search)
  );

  const curPageNumber = designQueryParams.pageNumber;
  const curPerPage = designQueryParams.countPerPage;
  const perPageChoices = [18, 30, 50];
  const pageControlNumbers = addEllipsisToNumberArray(
    getPageControlNumbers(totalPages, curPageNumber)
  );

  function clickPageButton(pageNumber: number) {
    if (!parentWindowLocation) return;
    const newParams: DesignQueryParams = {
      ...designQueryParams,
      pageNumber: pageNumber,
    };
    requestParentWindowQueryChange(parentWindowLocation.url, newParams);
  }

  function submitJumpToPage(e: React.FormEvent<HTMLFormElement>) {
    if (!parentWindowLocation) return;
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

  return (
    <div className={styles["main"]}>
      <div className={styles["controls-subsection"]}>
        {pageControlNumbers.map((numberOrEllipsis) => {
          if (numberOrEllipsis === "...") return <div>...</div>;
          else
            return (
              <button
                className={
                  curPageNumber === numberOrEllipsis
                    ? styles["page-active"]
                    : styles["page-inactive"]
                }
                style={{
                  pointerEvents:
                    curPageNumber === numberOrEllipsis ? "none" : "initial",
                }}
                onClick={() => clickPageButton(numberOrEllipsis)}
              >
                {numberOrEllipsis}
              </button>
            );
        })}
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
