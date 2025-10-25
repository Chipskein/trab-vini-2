import { z } from 'zod';

const authenticateUserDTO = z.object({
    email: z.string().email(),
    password: z.string(),
    rememberMe: z.preprocess(val => val === 'on', z.boolean()).optional().default(false)
});

export default authenticateUserDTO;
