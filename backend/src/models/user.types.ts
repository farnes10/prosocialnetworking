import mongoose from 'mongoose'

export enum UserType {
  EMPLOYEE = 'Employee',
  COMPANY = 'Company'
}

export interface IUser {
  email: string
  password: string
  address: string
  zipCode: number
  city: string
  province: string
  country: string
  image: string | undefined
  phone: string
  role: string
  verified: boolean
  createdAt: Date
  updatedAt: Date
  resetPasswordToken: string
  resetPasswordExpiresAt: Date
  notifications: mongoose.Schema.Types.ObjectId[]
}
export interface IEmployee extends IUser {
  firstName: string
  lastName: string
  birthdate: Date
  jobTitle: string
  jobDescription: string
  experience: mongoose.Schema.Types.ObjectId[]
  language: mongoose.Schema.Types.ObjectId[]
  skills: string[]
  education: mongoose.Schema.Types.ObjectId[]
}
export interface ICompany extends IUser {
  name: string
  foundationDate: Date
  industry: string
  activitySector: string
  slogan: string
  nationalID: string
  jobs: mongoose.Schema.Types.ObjectId[]
  employeeNumber: string
  description: string
}
