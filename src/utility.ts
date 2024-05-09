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
  const sortByParam = params.sortBy
    ? `sortBy=${encodeURIComponent(params.sortBy)}`
    : undefined;
  const excludePrioritizedParam = params.shouldExcludePrioritized
    ? "excludePrioritized=true"
    : undefined;
  const similarTo = params.similarTo
    ? `similarTo=${params.similarTo}`
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
    sortByParam,
    excludePrioritizedParam,
    similarTo,
  ]
    .filter((item) => item !== undefined)
    .join("&");
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
  if (!hexCode) {
    console.error(
      `Couldn't find hex code in ${design.DefaultBackgroundColor} for design ${design.DesignNumber}`
    );
    return "";
  }
  return hexCode;
}

export function splitDesignCategoryHierarchy(hierarchy: string) {
  const split = hierarchy.split(" > ");
  return {
    category: split[0],
    subcategory: split[1],
  };
}

type DesignId = {
  designId: number;
};

function isDesignId(param: any): param is DesignId {
  return param && typeof param.designId === "number";
}

export function createNavigationUrl(
  params: DesignId | DesignQueryParams | "cart"
) {
  //preserve previous search params; this allows the app to work on WordPress draft pages
  const existingSearchParams = new URLSearchParams(window.location.search);
  let newSearchParams = new URLSearchParams();
  const pageId = existingSearchParams.get("page_id");
  const preview = existingSearchParams.get("preview");
  if (pageId) newSearchParams.set("page_id", pageId);
  if (preview) newSearchParams.set("preview", preview);

  if (isDesignId(params)) {
    newSearchParams.set("viewDesign", `${params.designId}`);
  } else if (params === "cart") {
    newSearchParams.set("viewCart", "true");
  } else {
    newSearchParams = new URLSearchParams(
      `${newSearchParams.toString()}&${buildDesignQueryParams(params)}`
    );
  }

  return `${window.location.origin}${
    window.location.pathname
  }?${newSearchParams.toString()}`;
}

export function isDesignTransparent(design: TempDesign) {
  //assume for now that all PNGs are transparent
  return design.ImageURL?.endsWith(".png");
}
