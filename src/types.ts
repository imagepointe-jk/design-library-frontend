import { z } from "zod";
import { DesignType } from "./sharedTypes";

export const subcategoryDataSchema = z.object({
  Name: z.string(),
  ParentCategory: z.string(),
  Hierarchy: z.string(),
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
};

export type SubcategoryData = z.infer<typeof subcategoryDataSchema>;
