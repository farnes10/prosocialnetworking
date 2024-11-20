import * as z from 'zod'

export const LanguageSchema = z.object({
    language: z.string().min(1, 'Champ requis'),
    level: z.string(z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Langue maternelle']))
})