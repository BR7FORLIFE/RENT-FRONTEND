import { z } from "zod";

export const QrPayloadSchema = z.object({
    propertyId: z.uuid(),
    userId: z.uuid(),
});
