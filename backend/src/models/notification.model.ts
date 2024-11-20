import mongoose, { Document, Schema, model } from 'mongoose'
const transform = (doc: any, ret: any) => {
  ret.id = doc._id.toString()
  delete ret._id
  delete ret.__v
  return ret
}
interface INotificationDocument extends Document {
  recipient: mongoose.Schema.Types.ObjectId
  type: 'newJob' | 'applicationStatus' | 'newApplication'
  job: mongoose.Schema.Types.ObjectId
  application: mongoose.Schema.Types.ObjectId
  message: string
  read: boolean
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema = new Schema<INotificationDocument>(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['newJob', 'applicationStatus', 'newApplication'] },
    job: { type: Schema.Types.ObjectId, ref: 'Job' },
    application: { type: Schema.Types.ObjectId, ref: 'Application' },
    message: { type: String },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() }
  },
  { toJSON: { transform } }
)
export const Notifiaction = model<INotificationDocument>('Notification', NotificationSchema)
