import { z } from "zod";
import {
  designTypeSchema,
  quoteRequestSchema,
  // tempDesignSchema,
} from "./sharedTypes";
import {
  DesignQueryParams,
  cartDataSchema,
  // categoryDataSchema,
  compareModeDataSchema,
  designResultsSchema,
  subcategoryDataSchema,
  // tempDesignResultsSchema,
} from "./types";
import { makeStringTitleCase } from "./utility";
import { colorSchema, designCategorySchema, designSchema } from "./dbSchema";
import { pageSizeChoices } from "./constants";

export function validateDesignResultsJson(json: any) {
  return designResultsSchema.parse(json);
}

export function validateSingleDesignJson(json: any) {
  return designSchema.parse(json);
}

export function validateDesignArrayJson(json: any) {
  return z.array(designSchema).parse(json);
}

export function validateCategories(json: any) {
  return z.array(designCategorySchema).parse(json);
}

// export function validateSubcategories(json: any) {
//   return z.array(subcategoryDataSchema).parse(json);
// }

export function validateColors(json: any) {
  return z.array(colorSchema).parse(json);
}

export function tryParseDesignType(str: string) {
  try {
    return designTypeSchema.parse(str);
  } catch (_) {
    return undefined;
  }
}

export function parseSearchParams(params: URLSearchParams): DesignQueryParams {
  const designTypeFromParams = params.get("designType");
  const categoryFromParams = params.get("category");
  const subcategoryFromParams = params.get("subcategory");
  const tagsFromParams = params.get("tags");
  const keywordsFromParams = params.get("keywords");
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

export function validateQuoteRequest(data: any) {
  return quoteRequestSchema.parse(data);
}

export function validateEmail(str: string) {
  return z.string().email().parse(str);
}

export function validatePhone(phone: number) {
  if (`${phone}`.length !== 10) throw new Error();
}

export function validateCompareModeData(jsonString: string) {
  const json = JSON.parse(jsonString);
  return compareModeDataSchema.parse(json);
}

export function validateCartData(jsonString: string) {
  const json = JSON.parse(jsonString);
  return cartDataSchema.parse(json);
}
