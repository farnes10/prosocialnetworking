import * as z from 'zod'

export const JobSchema = z.object({
    jobTitle: z.string().min(1, 'Job title is required'),
    jobDescription: z.string().min(1, 'Job description is required'),
    activitySector: z.string().min(1, 'Activity sector is required'),
    location: z.string().min(1, 'Location is required'),
    workMode: z.enum(['remote', 'hybrid', 'on-site'], {
      errorMap: () => ({ message: 'Sélectionnez un mode de travail validé' }),
    }),
    requirements:z.array(z.string()).min(1, 'Au moins une compétence est requise'),
    salary: z.number().positive('Salary must be a positive number').optional(),
    minSalary: z.number().positive('minSalary must be a positive number').optional(),
    maxSalary: z.number().positive('maxSalary must be a positive number').optional(),
    experienceLevel: z.enum(['beginner', 'junior', 'senior', 'expert'], {
      errorMap: () => ({ message: "Sélectionnez un niveau d'expérience valide" }),
    }),
    expirationDate: z.string().min(1, 'Expiration date is required').date(),
    jobType: z.enum(['part-time', 'full-time', 'freelance', 'CDI', 'CDD', 'internship', 'CIVP', 'KARAMA'], {
      errorMap: () => ({ message: 'Please select a valid job contract type type' }),
    }),
  });
  export const JobTitleSchema = z.object({jobTitle: z.string()})
  export const JobDescriptionSchema = z.object({jobDescription: z.string()})