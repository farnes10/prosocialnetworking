import mongoose, { Schema, model } from 'mongoose'

interface IToken {
  userId: mongoose.Schema.Types.ObjectId
  token: string
}
const transform = (doc: any, ret: any) => {
  ret.id = doc._id.toString()
  delete ret._id
  delete ret.__v
  return ret
}
const TokenSchema = new Schema<IToken>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true }
  },
  {
    toJSON: { transform }
  }
)

export const Token = model<IToken>('Token', TokenSchema)
