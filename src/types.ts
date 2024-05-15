import { z } from "zod";
import { DesignType /*tempDesignSchema*/ } from "./sharedTypes";
import { designSchema } from "./dbSchema";

export const categoryDataSchema = z.object({
  Name: z.string(),
  DesignType: z.string(),
});

export const subcategoryDataSchema = z.object({
  Name: z.string(),
  ParentCategory: z.string(),
  Hierarchy: z.string(),
});

const categoryHierarchySchema = z.intersection(
  categoryDataSchema,
  z.object({ Subcategories: z.array(subcategoryDataSchema) })
);

// export const tempDesignResultsSchema = z.object({
//   pageNumber: z.number(),
//   perPage: z.number(),
//   total: z.number(),
//   designs: z.array(tempDesignSchema),
// });

export const designResultsSchema = z.object({
  pageNumber: z.number(),
  perPage: z.number(),
  totalResults: z.number(),
  designs: z.array(designSchema),
});

export const compareModeDataSchema = z.object({
  active: z.boolean(),
  expanded: z.boolean(),
  selectedIds: z.array(z.number()),
});

export const cartDesignSchema = z.object({
  id: z.number(),
  designNumber: z.string(),
  garmentColor: z.string(),
});

export const cartDataSchema = z.object({
  designs: z.array(cartDesignSchema),
});

export type CategoryData = z.infer<typeof categoryDataSchema>;
export type SubcategoryData = z.infer<typeof subcategoryDataSchema>;
export type CategoryHierarchy = z.infer<typeof categoryHierarchySchema>;
// export type TempDesignResults = z.infer<typeof tempDesignResultsSchema>;
export type DesignResults = z.infer<typeof designResultsSchema>;
export type CompareModeData = z.infer<typeof compareModeDataSchema>;
export type CartData = z.infer<typeof cartDataSchema>;
export type CartDesign = z.infer<typeof cartDesignSchema>;
