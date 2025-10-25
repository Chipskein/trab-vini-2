import { z } from 'zod';

const savePostDTO = z.object({
    title: z.string().optional(),
    description: z.string().min(1),
    externalLink: z.string().url().optional(),
    parentId: z.coerce.number().int().optional()
});

export default savePostDTO;