import { z } from "zod";
import {
  designTypeSchema,
  quoteRequestSchema,
  // tempDesignSchema,
} from "./sharedTypes";
import {
  // DesignQueryParams,
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
