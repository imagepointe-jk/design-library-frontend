import { z } from "zod";
import { designStatusSchema } from "./sharedTypes";

export const designSubcategorySchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const designTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const designCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  designSubcategories: z.array(designSubcategorySchema),
  designType: designTypeSchema,
});

export const designTagSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const colorSchema = z.object({
  id: z.number(),
  name: z.string(),
  hexCode: z.string(),
});

const designVariationSchema = z.object({
  id: z.number(),
  parentDesignId: z.number(),
  color: colorSchema,
  imageUrl: z.string(),
  designSubcategories: z.array(designSubcategorySchema),
  designTags: z.array(designTagSchema),
});

export const designSchema = z.object({
  id: z.number(),
  designNumber: z.string(),
  name: z.union([z.string(), z.null()]),
  description: z.union([z.string(), z.null()]),
  featured: z.boolean(),
  date: z.string(),
  status: designStatusSchema,
  imageUrl: z.string(),
  designSubcategories: z.array(designSubcategorySchema),
  designTags: z.array(designTagSchema),
  designType: designTypeSchema,
  defaultBackgroundColor: colorSchema,
  variations: z.array(designVariationSchema),
});

export type Design = z.infer<typeof designSchema>;
export type DesignCategory = z.infer<typeof designCategorySchema>;
export type DesignSubcategory = z.infer<typeof designSubcategorySchema>;
export type Color = z.infer<typeof colorSchema>;
