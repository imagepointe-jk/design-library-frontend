import styles from "./styles/PageControls.module.css";

type PageControlsProps = {
  totalPages: number;
  curPageNumber: number;
  curItemsPerPage: number;
  pageSizeChoices: number[];
  onClickPageNumber: (clickedPageNumber: number) => void;
  onSubmitJumpToPage: (jumpToPage: number) => void;
  onClickPageSizeButton: (clickedPageSize: number) => void;
};

export function PageControls({
  totalPages,
  curItemsPerPage,
  curPageNumber,
  pageSizeChoices,
  onClickPageNumber,
  onSubmitJumpToPage,
  onClickPageSizeButton,
}: PageControlsProps) {
  return (
    <div className={styles["main"]}>
      <PageNumberControl
        curPageNumber={curPageNumber}
        totalPages={totalPages}
        onClickPageNumber={onClickPageNumber}
      />
      <JumpToControl
        curPageNumber={curPageNumber}
        totalPages={totalPages}
        onSubmitJumpToPage={onSubmitJumpToPage}
      />
      <PageSizeControl
        curItemsPerPage={curItemsPerPage}
        pageSizeChoices={pageSizeChoices}
        onClickPageSizeButton={onClickPageSizeButton}
      />
    </div>
  );
}

type PageNumberControlProps = {
  totalPages: number;
  curPageNumber: number;
  onClickPageNumber: (clickedPageNumber: number) => void;
};

function PageNumberControl({
  curPageNumber,
  totalPages,
  onClickPageNumber,
}: PageNumberControlProps) {
  const pageControlNumbers = addEllipsisToNumberArray(
    getPageControlNumbers(totalPages, curPageNumber)
  );

  return (
    <div className={styles["controls-subsection"]}>
      <span className={styles["page-buttons-label"]}>Page</span>
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
              onClick={() => onClickPageNumber(numberOrEllipsis)}
            >
              {numberOrEllipsis}
            </button>
          );
      })}
    </div>
  );
}

type JumpToControlProps = {
  totalPages: number;
  curPageNumber: number;
  onSubmitJumpToPage: (jumpToPage: number) => void;
};

function JumpToControl({
  curPageNumber,
  totalPages,
  onSubmitJumpToPage,
}: JumpToControlProps) {
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

    onSubmitJumpToPage(+jumpToPage);
  }

  return (
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
  );
}

type PageSizeControlProps = {
  curItemsPerPage: number;
  pageSizeChoices: number[];
  onClickPageSizeButton: (clickedPageSize: number) => void;
};

function PageSizeControl({
  curItemsPerPage,
  pageSizeChoices,
  onClickPageSizeButton,
}: PageSizeControlProps) {
  return (
    <div className={styles["controls-subsection"]}>
      <div>Results Per Page</div>
      {pageSizeChoices.map((choice, i) => (
        <button
          className={
            (i === 0 && !curItemsPerPage) || curItemsPerPage === choice
              ? ""
              : "button-minor"
          }
          style={{
            pointerEvents:
              (i === 0 && !curItemsPerPage) || curItemsPerPage === choice
                ? "none"
                : "initial",
          }}
          onClick={() => onClickPageSizeButton(choice)}
        >
          {choice}
        </button>
      ))}
    </div>
  );
}

function getPageControlNumbers(
  totalPages: number,
  currentPage: number
): number[] {
  if (currentPage < 1 || currentPage > totalPages) {
    console.error("The current page must be between 1 and totalPages.");
    return [];
  }

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  ).filter((thisPage, i, arr) => {
    function distanceCondition(thisPage: number) {
      const distanceToStart = thisPage - 1;
      const distanceToEnd = totalPages - thisPage;
      const distanceToCurrentPage = Math.abs(currentPage - thisPage);
      const currentPageIsLimit =
        currentPage === 1 || currentPage === totalPages;
      return (
        distanceToStart === 0 ||
        distanceToEnd === 0 ||
        (currentPageIsLimit && distanceToCurrentPage < 3) ||
        (!currentPageIsLimit && distanceToCurrentPage < 2)
      );
    }
    const distanceConditionHere = distanceCondition(thisPage);
    const distanceConditionPrev = i > 1 ? distanceCondition(arr[i - 1]) : true;
    const distanceConditionNext =
      i < totalPages ? distanceCondition(arr[i + 1]) : true;

    return (
      distanceConditionHere || (distanceConditionPrev && distanceConditionNext)
    );
  });

  return pageNumbers;
}

function addEllipsisToNumberArray(array: number[]): (number | "...")[] {
  const newArr: (number | "...")[] = [];
  for (let i = 0; i < array.length; i++) {
    newArr.push(array[i]);
    const deltaToNext = array[i + 1] - array[i];
    if (deltaToNext > 1) newArr.push("...");
  }
  return newArr;
}
