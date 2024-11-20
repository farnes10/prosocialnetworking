import mongoose, { Document, Schema, model } from 'mongoose'
import { IUser, IEmployee, ICompany, UserType } from './user.types'

interface UserDocument extends IUser, Document {}
const transform = (doc: any, ret: any) => {
  ret.id = ret._id.toString()
  delete ret._id
  delete ret.__v
  return ret
}
const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      validate: (value: string) => {
        const upperCase = new RegExp('[/A-Z/]')
        const numbers = new RegExp('[/0-9/]')
        const specialChar = new RegExp('[/!@#$%^&*()_+=/]')
        if (!upperCase.test(value)) {
          throw new Error('Le mot de passe doit contenir au moins une majuscule')
        }
        if (!numbers.test(value)) {
          throw new Error('Le mot de passe doit contenir au moins un chiffre')
        }
        if (!specialChar.test(value)) {
          throw new Error('Le mot de passe doit contenir au moins un caractère spécial: !@#$%^&*()_+=')
        }
      }
    },
    address: {
      type: String,
      required: true
    },
    zipCode: {
      type: Number,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    province: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: false
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    },
    verified: {
      type: Boolean,
      default: false
    },
    resetPasswordToken: {
      type: String,
      default: ''
    },
    resetPasswordExpiresAt: {
      type: Date,
      default: null
    },
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification'
      }
    ]
  },
  {
    _id: true,
    discriminatorKey: 'role',
    toJSON: { transform }
  }
)

export const User = model<UserDocument>('User', userSchema)
export const Employee = User.discriminator(
  UserType.EMPLOYEE,
  new Schema<IEmployee>({
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    birthdate: {
      type: Date,
      required: true
    },
    education: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Education'
      }
    ],
    experience: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Experience'
      }
    ],
    skills: [String],
    language: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Language'
      }
    ],
    jobTitle: {
      type: String,
      required: true
    },
    jobDescription: {
      type: String
    }
  })
)
export const Company = User.discriminator(
  UserType.COMPANY,
  new Schema<ICompany>({
    name: {
      type: String,
      required: true
    },
    foundationDate: {
      type: Date,
      required: false
    },
    industry: {
      type: String,
      required: true
    },
    employeeNumber: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    activitySector: {
      type: String,
      required: true
    },
    slogan: {
      type: String,
      required: false
    },
    nationalID: {
      type: String,
      required: true
    },
    jobs: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Job'
      }
    ]
  })
)
