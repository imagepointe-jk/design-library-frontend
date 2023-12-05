import { z } from "zod";

export const designTypes = ["Screen Print", "Embroidery"] as const;
export const designTypeSchema = z.enum(designTypes);

export const tempDesignSchema = z.object({
  Name: z.string(),
  Description: z.string().optional(),
  DefaultBackgroundColor: z.string(),
  Subcategory1: z.string(),
  Subcategory2: z.string().optional(),
  Subcategory3: z.string().optional(),
  Subcategory4: z.string().optional(),
  Subcategory5: z.string().optional(),
  DesignType: designTypeSchema,
  Tag1: z.string(),
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
  DesignNumber: z.number(),
  Featured: z.boolean(),
});

export const tempDesignWithImagesSchema = z.intersection(
  tempDesignSchema,
  z.object({ ImageURLs: z.array(z.string()) })
);

export type DesignType = z.infer<typeof designTypeSchema>;
export type TempDesign = z.infer<typeof tempDesignSchema>;
export type TempDesignWithImages = z.infer<typeof tempDesignWithImagesSchema>;
