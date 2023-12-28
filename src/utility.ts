import { DesignQueryParams } from "./types";

export function deduplicateStrings(strings: string[]) {
  const set = new Set(strings);
  return Array.from(set);
}

export function makeStringTitleCase(str: string) {
  return str
    .split(" ")
    .map((word) => `${word[0].toUpperCase()}${word.substring(1)}`)
    .join(" ");
}

export function buildDesignQueryParams(params: DesignQueryParams) {
  const tagsParam = params.tags ? `tags=${params.tags.join(",")}` : undefined;
  const subcategoryParam = params.subcategory
    ? `subcategories=${params.subcategory}` //this will be a comma separated list if we decide to allow multiple subcategories
    : undefined;
  const categoryParam = params.category
    ? `category=${params.category}`
    : undefined;
  const keywordsParam = params.keywords
    ? `keywords=${params.keywords.join(",")}`
    : undefined;
  const designTypeParam = `designtype=${params.designType.toLocaleLowerCase()}`;
  const perPageParam = params.countPerPage
    ? `perPage=${params.countPerPage}`
    : undefined;
  const pageNumberParam = params.pageNumber
    ? `pageNumber=${params.pageNumber}`
    : undefined;
  const featuredParam = params.featuredOnly ? "featured=true" : undefined;
  const allowDuplicatesParam = params.allowDuplicateDesignNumbers
    ? "allowDuplicateDesignNumbers=true"
    : undefined;

  return [
    designTypeParam,
    subcategoryParam,
    categoryParam,
    perPageParam,
    pageNumberParam,
    tagsParam,
    keywordsParam,
    featuredParam,
    allowDuplicatesParam,
  ]
    .filter((item) => item !== undefined)
    .join("&");
}

export function requestParentWindowUrlChange(url: string) {
  window.parent.postMessage(
    {
      type: "design-library-url-change-request",
      url,
    },
    "*"
  );
}

export function requestParentWindowModalOpen(
  iframePathname: string,
  iframeSize: {
    width?: number;
    height?: number;
  }
) {
  window.parent.postMessage(
    {
      type: "design-library-open-modal",
      iframePathname,
      width: iframeSize.width,
      height: iframeSize.height,
    },
    "*"
  );
}

export function requestParentWindowResizeApp(newSize: {
  width?: number;
  height?: number;
}) {
  window.parent.postMessage(
    {
      type: "design-library-resize-app",
      width: newSize.width,
      height: newSize.height,
    },
    "*"
  );
}

export function requestParentWindowQueryChange(
  currentUrl: string,
  newParams: DesignQueryParams
) {
  const currentUrlWithoutQuery = currentUrl?.split("?")[0];
  const newUrl = `${currentUrlWithoutQuery}?${buildDesignQueryParams(
    newParams
  )}`;
  requestParentWindowUrlChange(newUrl);
}

export function handleAnchorClick(
  e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
) {
  e.preventDefault();
  requestParentWindowUrlChange(e.currentTarget.href);
}

export function clamp(value: number, min: number, max: number) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function getPageControlNumbers(
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

export function addEllipsisToNumberArray(array: number[]): (number | "...")[] {
  const newArr: (number | "...")[] = [];
  for (let i = 0; i < array.length; i++) {
    newArr.push(array[i]);
    const deltaToNext = array[i + 1] - array[i];
    if (deltaToNext > 1) newArr.push("...");
  }
  return newArr;
}
