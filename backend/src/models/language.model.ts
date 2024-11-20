import mongoose, { Schema, model } from 'mongoose'

interface ILanguage {
  language: string
  level: string
  employee: mongoose.Schema.Types.ObjectId
}
const transform = (doc: any, ret: any) => {
  ret.id = doc._id.toString()
  delete ret._id
  delete ret.__v
  return ret
}
const LanguageSchema = new Schema<ILanguage>(
  {
    language: {
      type: String,
      required: true
    },
    level: {
      type: String,
      enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Langue maternelle'],
      default: 'Langue maternelle'
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

export const Language = model<ILanguage>('Language', LanguageSchema)
