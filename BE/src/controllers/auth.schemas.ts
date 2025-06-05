import { z } from "zod";

const loginSchema = z.object({
    address: z.string().nonempty({ message: 'Address is required' }),
    signature: z.string().nonempty({ message: 'Signature is required' }),
    userAgent: z.string().optional(),
})

export { loginSchema }