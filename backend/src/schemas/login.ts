import * as z from 'zod'

export const LoginSchema = z.object({
  email: z.string().min(1, 'Champ requis').email('Email invalide'),
  password: z.string().min(1, 'Champ requis')
})
export type LoginInput = z.infer<typeof LoginSchema>
