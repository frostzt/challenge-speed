import * as z from "zod/v4";

export const identifyContactRequestDto = z.object({
  email: z.email().optional(),
  phoneNumber: z.string().min(10).max(10).optional(),
});
