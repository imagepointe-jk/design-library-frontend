import { TempDesign } from "./sharedTypes";
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
    ? `subcategories=${encodeURIComponent(params.subcategory)}` //this will be a comma separated list if we decide to allow multiple subcategories
    : undefined;
  const categoryParam = params.category
    ? `category=${encodeURIComponent(params.category)}`
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
  },
  windowMaxWidth: number | "default"
) {
  window.parent.postMessage(
    {
      type: "design-library-open-modal",
      iframePathname,
      width: iframeSize.width,
      height: iframeSize.height,
      windowMaxWidth,
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

export function requestParentWindowAdaptToAppHeight() {
  //wait briefly for DOM to update, then request iframe resize based on content length
  setTimeout(() => {
    requestParentWindowResizeApp({
      height: document.querySelector(".inner-body")?.scrollHeight,
    });
  }, 100);
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

export function requestParentWindowURL() {
  window.parent.postMessage(
    {
      type: "design-library-url-retrieve-request",
      originPathname: window.location.pathname,
    },
    "*"
  );
}

export function clamp(value: number, min: number, max: number) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function getDesignTags(design: TempDesign) {
  const {
    Tag1,
    Tag2,
    Tag3,
    Tag4,
    Tag5,
    Tag6,
    Tag7,
    Tag8,
    Tag9,
    Tag10,
    Tag11,
    Tag12,
  } = design;
  return [
    Tag1,
    Tag2,
    Tag3,
    Tag4,
    Tag5,
    Tag6,
    Tag7,
    Tag8,
    Tag9,
    Tag10,
    Tag11,
    Tag12,
  ];
}

export function getDesignCategoryHierarchies(design: TempDesign) {
  const {
    Subcategory1,
    Subcategory2,
    Subcategory3,
    Subcategory4,
    Subcategory5,
  } = design;
  return [Subcategory1, Subcategory2, Subcategory3, Subcategory4, Subcategory5];
}

export function getFirstHexCodeInString(str: string) {
  const match = str.match(/#[a-zA-Z\d]{6}/g);
  return match ? match[0] : null;
}

export function getDesignDefaultBackgroundColor(design: TempDesign) {
  const hexCode = getFirstHexCodeInString(design.DefaultBackgroundColor);
  if (!hexCode)
    console.error(
      `Couldn't find hex code in ${design.DefaultBackgroundColor} for design ${design.DesignNumber}`
    );
  return hexCode;
}

export function splitDesignCategoryHierarchy(hierarchy: string) {
  const split = hierarchy.split(" > ");
  return {
    category: split[0],
    subcategory: split[1],
  };
}
