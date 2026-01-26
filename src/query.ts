import { pageSizeChoices } from "./constants";
import { DesignType } from "./sharedTypes";
import { getTimeStampYearsAgo, makeStringTitleCase } from "./utility";
import { tryParseDesignType } from "./validations";

export function getDefaultQueryParams() {
  const defaultQueryParams: DesignQueryParams = {
    designType: "Screen Print",
    featuredOnly: false,
    pageNumber: 1,
    sortBy: "priority",
  };

  return {
    params: defaultQueryParams,
    stringified: buildDesignQueryParams(defaultQueryParams),
  };
}

//TODO: Refactor this so that we can pass multiple modifications in one function call
//calling the function multiple times to make multiple modifications is inefficient
export function getModifiedQueryParams(
  curSearchParams: string,
  key: string,
  valueToSet: string | null
) {
  const params = new URLSearchParams(curSearchParams);

  if (key === "age") {
    const twoYearsAgo = getTimeStampYearsAgo(2);
    params.delete("before");
    params.delete("after");
    if (valueToSet === "new") {
      params.set("after", `${twoYearsAgo}`);
    } else if (valueToSet === "old") {
      params.set("before", `${twoYearsAgo}`);
    }
  } else {
    if (valueToSet === null) params.delete(key);
    else params.set(key, valueToSet);
  }

  return {
    params: parseDesignQueryParams(params),
    stringified: params.toString(),
  };
}

export function parseDesignQueryParams(
  params: URLSearchParams
): DesignQueryParams {
  const designTypeFromParams = params.get("designType");
  const categoryFromParams = params.get("category");
  const subcategoryFromParams = params.get("subcategory");
  const tagsFromParams = params.get("tags");
  const keywordsFromParams = params.get("keyword");
  const perPageFromParams = params.get("perPage");
  const pageNumberFromParams = params.get("pageNumber");
  const featuredFromParams = params.get("featured");
  const allowDuplicateDesignNumbers = params.get("allowDuplicateDesignNumbers");
  const shouldExcludePrioritized = params.get("excludePrioritized");
  const similarTo = params.get("similarTo");
  const before = params.get("before");
  const after = params.get("after");

  const parsedDesignType =
    tryParseDesignType(makeStringTitleCase(`${designTypeFromParams}`)) ||
    "Screen Print";

  const parsedSearchParams: DesignQueryParams = {
    designType: parsedDesignType,
    category: categoryFromParams
      ? makeStringTitleCase(categoryFromParams)
      : undefined,
    subcategory: subcategoryFromParams
      ? makeStringTitleCase(subcategoryFromParams)
      : undefined,
    perPage:
      perPageFromParams && !isNaN(+perPageFromParams)
        ? +perPageFromParams
        : pageSizeChoices[0],
    keywords: keywordsFromParams ? keywordsFromParams.split(",") : undefined,
    pageNumber:
      pageNumberFromParams && !isNaN(+pageNumberFromParams)
        ? +pageNumberFromParams
        : 1,
    tags: tagsFromParams ? tagsFromParams.split(",") : undefined,
    featuredOnly: featuredFromParams === "true",
    allowDuplicateDesignNumbers: allowDuplicateDesignNumbers === "true",
    shouldExcludePrioritized: shouldExcludePrioritized === "true",
    similarTo: similarTo && !isNaN(+similarTo) ? +similarTo : undefined,
    after: after && !isNaN(+after) ? +after : undefined,
    before: before && !isNaN(+before) ? +before : undefined,
  };

  return parsedSearchParams;
}

function buildDesignQueryParams(params: DesignQueryParams) {
  const tagsParam = params.tags ? `tags=${params.tags.join(",")}` : undefined;
  const subcategoryParam = params.subcategory
    ? `subcategory=${encodeURIComponent(params.subcategory)}` //this will be a comma separated list if we decide to allow multiple subcategories
    : undefined;
  const categoryParam = params.category
    ? `category=${encodeURIComponent(params.category)}`
    : undefined;
  const keywordsParam = params.keywords
    ? `keywords=${params.keywords.join(",")}`
    : undefined;
  const designTypeParam = `designType=${params.designType.toLocaleLowerCase()}`;
  const perPageParam = params.perPage ? `perPage=${params.perPage}` : undefined;
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
  const twoYearsAgo = `${getTimeStampYearsAgo(2)}`;
  const before = params.before ? `before=${twoYearsAgo}` : undefined;
  const after = params.after ? `after=${twoYearsAgo}` : undefined;

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
    before,
    after,
  ]
    .filter((item) => item !== undefined)
    .join("&");
}

type DesignQueryParams = {
  designType: DesignType;
  category?: string;
  subcategory?: string;
  tags?: string[];
  keywords?: string[];
  perPage?: number;
  pageNumber: number;
  featuredOnly: boolean;
  allowDuplicateDesignNumbers?: boolean;
  sortBy?: string;
  shouldExcludePrioritized?: boolean;
  similarTo?: number;
  before?: number;
  after?: number;
};

export function createNavigationUrl(
  designIdOrPage: number | "cart" | "compare" | "home",
  variationId?: number
) {
  //preserve previous search params; this allows the app to work on WordPress draft pages
  const existingSearchParams = new URLSearchParams(window.location.search);
  let newSearchParams = new URLSearchParams();
  const pageId = existingSearchParams.get("page_id");
  const preview = existingSearchParams.get("preview");
  if (pageId) newSearchParams.set("page_id", pageId);
  if (preview) newSearchParams.set("preview", preview);

  if (typeof designIdOrPage === "number") {
    newSearchParams.set("viewDesign", `${designIdOrPage}`);
    if (variationId) newSearchParams.set("viewVariation", `${variationId}`);
  } else if (designIdOrPage === "cart") {
    newSearchParams.set("viewCart", "true");
  } else if (designIdOrPage === "compare") {
    newSearchParams.set("viewCompare", "true");
  }

  return `${window.location.origin}${
    window.location.pathname
  }?${newSearchParams.toString()}`;
}

export function updateWindowSearchParams(newParams: string) {
  window.location.href = `${window.location.origin}${window.location.pathname}?${newParams}`;
}
