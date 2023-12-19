import { z } from "zod";
import { DesignType } from "./sharedTypes";

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

export type DesignQueryParams = {
  designType: DesignType;
  category?: string;
  subcategory?: string;
  tags?: string[];
  keywords?: string[];
  countPerPage?: number;
  pageNumber: number;
  featuredOnly: boolean;
};

export type CategoryData = z.infer<typeof categoryDataSchema>;
export type SubcategoryData = z.infer<typeof subcategoryDataSchema>;
export type CategoryHierarchy = z.infer<typeof categoryHierarchySchema>;
