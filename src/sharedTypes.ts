import { z } from "zod";

export const designTypes = ["Screen Print", "Embroidery"] as const;
export const designTypeSchema = z.enum(designTypes);

const designStatuses = ["Published", "Draft"] as const;
export const designStatusSchema = z.enum(designStatuses);

const quoteRequestItemSchema = z.object({
  designId: z.number(),
  variationId: z.number().optional(),
  designNumber: z.string(),
  garmentColor: z.string(),
});

export const quoteRequestSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.number(),
  union: z.string(),
  comments: z.string(),
  items: z.array(quoteRequestItemSchema),
});

export type DesignType = z.infer<typeof designTypeSchema>;
export type QuoteRequest = z.infer<typeof quoteRequestSchema>;
