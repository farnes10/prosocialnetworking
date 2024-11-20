import mongoose, { Schema, model } from 'mongoose'

export interface IJob {
  jobTitle: string
  jobDescription: string
  activitySector: string
  location: string
  workMode: string
  requirements: string[]
  salary: number
  minSalary: number
  maxSalary: number
  currency: string
  experienceLevel: string
  createdAt: Date
  expirationDate: Date
  jobType: string
  applications: mongoose.Schema.Types.ObjectId[]
  createdBy: mongoose.Schema.Types.ObjectId
  company: mongoose.Schema.Types.ObjectId
}
const transform = (doc: any, ret: any) => {
  ret.id = doc._id.toString()
  delete ret._id
  delete ret.__v
  return ret
}
const JobSchema = new Schema<IJob>(
  {
    jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true },
    activitySector: { type: String, required: true },
    location: { type: String, required: true },
    jobType: {
      type: String,
      enum: ['part-time', 'full-time', 'freelance', 'CDI', 'CDD', 'internship', 'CIVP', 'KARAMA']
    },
    workMode: { type: String, required: true },
    requirements: { type: [String], required: true },
    salary: { type: Number },
    minSalary: { type: Number },
    maxSalary: { type: Number },
    currency: { type: String, required: true },
    experienceLevel: { type: String, required: true, enum: ['beginner', 'junior', 'senior', 'expert'] },
    expirationDate: { type: Date, required: true },
    applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
    createdAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
  },
  {
    toJSON: { transform }
  }
)

export const Job = model<IJob>('Job', JobSchema)
