import { z } from "zod";
import { tempDesignWithImagesSchema } from "./sharedTypes";
import { subcategoryDataSchema } from "./types";

export function validateDesignsJson(json: any) {
  return z.array(tempDesignWithImagesSchema).parse(json);
}

export function validateSingleDesignJson(json: any) {
  return tempDesignWithImagesSchema.parse(json);
}

export function validateSubcategories(json: any) {
  return z.array(subcategoryDataSchema).parse(json);
}
