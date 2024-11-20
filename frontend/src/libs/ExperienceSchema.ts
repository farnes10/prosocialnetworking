import * as z from 'zod'

export const ExperienceSchema = z.object({
    position: z.string().min(1, 'Champ Requis'),
    company: z.string().min(1, 'Champ Requis'),
    startDate: z.string().date(),
    endDate: z.optional(z.date()),
    tillNowWork: z.boolean(),
    description: z.string()
})