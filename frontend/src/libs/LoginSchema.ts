import * as z from 'zod'

export const LoginSchema = z.object({
    email: z.string().min(1, 'Champ requis').email(),
    password: z.string().min(1, 'Champ Requis'),
})