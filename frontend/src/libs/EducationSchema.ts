import * as z from 'zod'

export const EducationSchema = z.object({
    degree: z.string().min(1, { message: 'Champ requis' }),
    speciality: z.string().min(1, 'Champ Requis'),
    institution: z.string().min(1, 'Champ requis'),
    startDate:z.string().date(),
    endDate:z.string().date()
})