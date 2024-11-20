import * as z from "zod"

export const EmployeeSchema = z.object({
    email:z.string().min(1,'Champs requis').email(),
    firstName: z.string().min(1,"Champs requis"),
    lastName: z.string().min(1,"Champs requis"),
    birthdate:z.string().date(),
    password: z.string().min(1,"Champs requis"),
    address:z.string().min(1, 'Champs requis'),
    phone: z.string(),
    zipCode: z.string().min(1, 'Champs requis'),
    city: z.string().min(1, 'Champs requis'),
    province:z.string().min(1, 'Champ Requis'),
    country:z.string().min(1,'Champs requis'),
    image: z.instanceof(File).nullable().optional(),
    jobTitle:z.string().min(1, 'Champs requis'),
    jobDescription: z.string().min(1, 'Champ requis')
})
