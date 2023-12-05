import { z } from "zod";

export const subcategoryDataSchema = z.object({
  Name: z.string(),
  ParentCategory: z.string(),
  Hierarchy: z.string(),
});

export type DesignQueryParams = {
  screenPrint?: boolean;
  embroidery?: boolean;
  subcategories?: string[];
  tags?: string[];
  keywords?: string[];
  countPerPage?: number;
  pageNumber?: number;
};

export type SubcategoryData = z.infer<typeof subcategoryDataSchema>;
