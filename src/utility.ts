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
    ? `subcategory=${params.subcategory}`
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

  return [
    designTypeParam,
    subcategoryParam,
    perPageParam,
    pageNumberParam,
    tagsParam,
    keywordsParam,
  ]
    .filter((item) => item !== undefined)
    .join("&");
}
