import * as z from 'zod'

export const ForgetPasswordSchema = z.object({
    email: z.string().min(1, "L'email est obligatoire pour être authentifié").email("Email non valide")
})