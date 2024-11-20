import mongoose, { Schema, model } from 'mongoose'

interface IEducation {
  degree: string
  speciality: string
  institution: string
  startDate: Date
  endDate: Date
  employee: mongoose.Schema.Types.ObjectId
}
const transform = (doc: any, ret: any) => {
  ret.id = doc._id.toString()
  delete ret._id
  delete ret.__v
  return ret
}
const EducationSchema = new Schema<IEducation>(
  {
    degree: {
      type: String,
      required: true
    },
    speciality: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee'
    }
  },
  {
    toJSON: { transform }
  }
)

export const Education = model<IEducation>('Education', EducationSchema)
