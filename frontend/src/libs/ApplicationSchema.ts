import * as z from 'zod'

export const ApplicationSchema = z.object({
    cv:z.instanceof(File),
    coverLetter: z.string().min(1, 'Champ requis')
})