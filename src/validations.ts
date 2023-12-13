import { z } from "zod";
import {
  designTypeSchema,
  tempDesignResultsSchema,
  tempDesignWithImagesSchema,
} from "./sharedTypes";
import { DesignQueryParams, subcategoryDataSchema } from "./types";
import { makeStringTitleCase } from "./utility";

export function validateDesignResultsJson(json: any) {
  return tempDesignResultsSchema.parse(json);
}

export function validateSingleDesignJson(json: any) {
  return tempDesignWithImagesSchema.parse(json);
}

export function validateSubcategories(json: any) {
  return z.array(subcategoryDataSchema).parse(json);
}

function tryParseDesignType(str: string) {
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
  };

  return parsedSearchParams;
}
