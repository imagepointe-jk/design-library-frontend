import { z } from "zod";
import {
  designTypeSchema,
  quoteRequestSchema,
  tempDesignSchema,
} from "./sharedTypes";
import {
  DesignQueryParams,
  categoryDataSchema,
  subcategoryDataSchema,
  tempDesignResultsSchema,
} from "./types";
import { makeStringTitleCase } from "./utility";

export function validateDesignResultsJson(json: any) {
  return tempDesignResultsSchema.parse(json);
}

export function validateSingleDesignJson(json: any) {
  return tempDesignSchema.parse(json);
}

export function validateDesignArrayJson(json: any) {
  return z.array(tempDesignSchema).parse(json);
}

export function validateCategories(json: any) {
  return z.array(categoryDataSchema).parse(json);
}

export function validateSubcategories(json: any) {
  return z.array(subcategoryDataSchema).parse(json);
}

export function validateColors(json: any) {
  return z.array(z.string()).parse(json);
}

export function tryParseDesignType(str: string) {
  try {
    return designTypeSchema.parse(str);
  } catch (_) {
    return undefined;
  }
}

export function parseSearchParams(params: URLSearchParams): DesignQueryParams {
  const designTypeFromParams = params.get("designtype");
  const categoryFromParams = params.get("category");
  const subcategoryFromParams = params.get("subcategories");
  const tagsFromParams = params.get("tags");
  const keywordsFromParams = params.get("keywords");
  const countPerPageFromParams = params.get("perPage");
  const pageNumberFromParams = params.get("pageNumber");
  const featuredFromParams = params.get("featured");
  const allowDuplicateDesignNumbers = params.get("allowDuplicateDesignNumbers");
  const shouldExcludePrioritized = params.get("excludePrioritized");
  const similarTo = params.get("similarTo");

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
    countPerPage:
      countPerPageFromParams && !isNaN(+countPerPageFromParams)
        ? +countPerPageFromParams
        : undefined,
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
