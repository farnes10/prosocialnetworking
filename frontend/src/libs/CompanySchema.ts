import * as z from 'zod'

export const CompanySchema = z.object({
    email: z.string().min(1, 'Champ requis').email(),
    password: z.string().min(1,'Champ requis'),
    name: z.string().min(1,'Champ requis'),
    foundationDate: z.string().date(),
    phone:z.string(),
    address: z.string().min(1,'Champ requis'),
    zipCode: z.string().min(1, 'Champ Requis'),
    city: z.string().min(1, 'Champ Requis'),
    province: z.string().min(1,'Champ requis'),
    country: z.string().min(1, 'Champ Requis'),
    industry: z.string().min(1, 'Champ requis'),
    activitySector: z.string().min(1, 'Champ requis'),
    description: z.string().min(1, 'Champ requis'),
    nationalId: z.string().min(1, 'Champ requis'),
    employeeNumber: z.string().min(1, 'Champ requis'),
    slogan: z.string().min(1, 'Champ requis'), 
    image:z.instanceof(File).nullable().optional()
})