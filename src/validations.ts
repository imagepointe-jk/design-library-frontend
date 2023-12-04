import { z } from "zod";
import { tempDesignWithImagesSchema } from "./sharedTypes";

export function validateDesignsJson(json: any) {
  return z.array(tempDesignWithImagesSchema).parse(json);
}

export function validateSingleDesignJson(json: any) {
  return tempDesignWithImagesSchema.parse(json);
}
