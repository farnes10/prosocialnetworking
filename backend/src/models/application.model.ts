import mongoose, { Schema, model } from 'mongoose'

const ApplicationSchema = new Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  cv: {
    type: String,
    required: true
  },
  coverLetter: {
    type: String,
    required: true
  }
})

export const Application = model('Application', ApplicationSchema)
