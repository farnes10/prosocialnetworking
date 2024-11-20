import * as z from 'zod'

export const ResetPasswordSchema = z.object({
    password: z.string().min(1, 'Champ requis'),
    confirmPassword: z.string().min(1, 'Champ requis')
    }).refine((data) => data.password === data.confirmPassword,
{
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
})
