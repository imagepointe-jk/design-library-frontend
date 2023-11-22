import { z } from "zod";

export const tempDesignSchema = z.object({
  Name: z.string(),
  Description: z.string(),
  DefaultBackgroundColor: z.string(),
  Subcategory1: z.string(),
  Subcategory2: z.string().optional(),
  Subcategory3: z.string().optional(),
  Subcategory4: z.string().optional(),
  Subcategory5: z.string().optional(),
  ScreenPrint: z.boolean(),
  Embroidery: z.boolean(),
  Tag1: z.string(),
  Tag2: z.string().optional(),
  Tag3: z.string().optional(),
  Tag4: z.string().optional(),
  Tag5: z.string().optional(),
  DropboxImagePath: z.string(),
});

export const tempDesignWithImageSchema = z.intersection(
  tempDesignSchema,
  z.object({ ImageURL: z.string() })
);

export type TempDesign = z.infer<typeof tempDesignSchema>;
export type TempDesignWithImage = z.infer<typeof tempDesignWithImageSchema>;
