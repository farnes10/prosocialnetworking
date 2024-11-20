import * as z from 'zod'

export const SkillsSchema = z.object({skills:z.array(z.string()).optional()})