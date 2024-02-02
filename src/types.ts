import { z } from "zod";
import { DesignType, tempDesignWithImagesSchema } from "./sharedTypes";

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

export const tempDesignResultsSchema = z.object({
  pageNumber: z.number(),
  perPage: z.number(),
  total: z.number(),
  designs: z.array(tempDesignWithImagesSchema),
});

export type DesignQueryParams = {
  designType: DesignType;
  category?: string;
  subcategory?: string;
  tags?: string[];
  keywords?: string[];
  countPerPage?: number;
  pageNumber: number;
  featuredOnly: boolean;
  allowDuplicateDesignNumbers?: boolean;
  sortBy?: string;
  shouldExcludePrioritized?: boolean;
};

export type CategoryData = z.infer<typeof categoryDataSchema>;
export type SubcategoryData = z.infer<typeof subcategoryDataSchema>;
export type CategoryHierarchy = z.infer<typeof categoryHierarchySchema>;
export type TempDesignResults = z.infer<typeof tempDesignResultsSchema>;
