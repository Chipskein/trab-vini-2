import { z } from 'zod';

const patchUserDTO = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    active : z.boolean().optional()
});

export default patchUserDTO;