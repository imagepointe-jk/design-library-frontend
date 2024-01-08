import { z } from "zod";

export const designTypes = ["Screen Print", "Embroidery"] as const;
export const designTypeSchema = z.enum(designTypes);

const designStatuses = ["Published", "Draft"] as const;
const designStatusSchema = z.enum(designStatuses);

export const tempDesignSchema = z.object({
  Id: z.number(),
  Name: z.string().optional(),
  Description: z.string().optional(),
  DefaultBackgroundColor: z.string(),
  Subcategory1: z.string().optional(),
  Subcategory2: z.string().optional(),
  Subcategory3: z.string().optional(),
  Subcategory4: z.string().optional(),
  Subcategory5: z.string().optional(),
  DesignType: designTypeSchema,
  Tag1: z.string().optional(),
  Tag2: z.string().optional(),
  Tag3: z.string().optional(),
  Tag4: z.string().optional(),
  Tag5: z.string().optional(),
  DropboxImagePath1: z.string().optional(),
  DropboxImagePath2: z.string().optional(),
  DropboxImagePath3: z.string().optional(),
  DropboxImagePath4: z.string().optional(),
  DropboxImagePath5: z.string().optional(),
  DropboxImagePath6: z.string().optional(),
  DropboxImagePath7: z.string().optional(),
  DesignNumber: z.string(),
  Featured: z.boolean(),
  Status: designStatusSchema,
});

export const tempDesignWithImagesSchema = z.intersection(
  tempDesignSchema,
  z.object({ ImageURLs: z.array(z.string()) })
);

export const tempCategorySchema = z.object({
  Name: z.string(),
  DesignType: z.string(),
});

export const tempSubcategorySchema = z.object({
  Name: z.string(),
  ParentCategory: z.string(),
  Hierarchy: z.string().regex(/^.+ > .+$/g),
});

export const tempDbSchema = z.object({
  Designs: z.array(tempDesignSchema),
  Tags: z.array(z.object({ Name: z.string() })),
  Categories: z.array(tempCategorySchema),
  Subcategories: z.array(tempSubcategorySchema),
});

export type DesignType = z.infer<typeof designTypeSchema>;
export type TempDesign = z.infer<typeof tempDesignSchema>;
export type TempDesignWithImages = z.infer<typeof tempDesignWithImagesSchema>;
export type TempDb = z.infer<typeof tempDbSchema>;
