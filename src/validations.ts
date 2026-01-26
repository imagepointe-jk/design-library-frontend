import { z } from "zod";
import { colorSchema, designCategorySchema, designSchema } from "./dbSchema";
import { designTypeSchema, quoteRequestSchema } from "./sharedTypes";
import {
  cartDataSchema,
  compareModeDataSchema,
  designResultsSchema,
} from "./types";

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
