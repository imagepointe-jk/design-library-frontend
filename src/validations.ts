import { z } from "zod";
import { tempDesignWithImageSchema } from "./sharedTypes";

export function validateDesignsJson(json: any) {
  return z.array(tempDesignWithImageSchema).parse(json);
}

export function validateSingleDesignJson(json: any) {
  return tempDesignWithImageSchema.parse(json);
}
