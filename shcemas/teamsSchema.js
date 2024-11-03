import { z } from 'zod'

const teamCreateSchema = z.object({
    name: z.string(),
    description: z.string(),
    category_id: z.number(),
    image_url: z.string(),
});



export { teamCreateSchema };