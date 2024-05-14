import { z } from "zod";
import { designStatusSchema } from "./sharedTypes";

export const designSubcategorySchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const designTagSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const designTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const colorSchema = z.object({
  id: z.number(),
  name: z.string(),
  hexCode: z.string(),
});

export const designSchema = z.object({
  id: z.number(),
  designNumber: z.number(),
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
});

export type Design = z.infer<typeof designSchema>;
