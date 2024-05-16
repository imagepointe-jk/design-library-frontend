import { z } from "zod";

export const designTypes = ["Screen Print", "Embroidery"] as const;
export const designTypeSchema = z.enum(designTypes);

const designStatuses = ["Published", "Draft"] as const;
export const designStatusSchema = z.enum(designStatuses);

const quoteRequestDesignSchema = z.object({
  id: z.number(),
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
  designs: z.array(quoteRequestDesignSchema),
});

export type DesignType = z.infer<typeof designTypeSchema>;
export type QuoteRequest = z.infer<typeof quoteRequestSchema>;
