import mongoose, { Schema, model } from 'mongoose'

export interface IExperience {
  position: string
  company: string
  startDate: Date
  endDate: Date
  tillNowWork: boolean
  description: string
  employee: mongoose.Schema.Types.ObjectId
}
const transform = (doc: any, ret: any) => {
  ret.id = doc._id.toString()
  delete ret._id
  delete ret.__v
  return ret
}
const ExperienceSchema = new Schema<IExperience>(
  {
    position: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    description: { type: String },
    tillNowWork: { type: Boolean, default: false },
    employee: { type: Schema.Types.ObjectId, ref: 'Employee' }
  },
  { toJSON: { transform } }
)

export const Experience = model<IExperience>('Experience', ExperienceSchema)
