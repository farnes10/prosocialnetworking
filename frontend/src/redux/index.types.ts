export interface IApplication {
    cv: string
    coverLetter: string
    email: string
    firstName: string
    lastName: string
}
export interface IJob{
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
  applications: IApplication
  createdBy: IUser
  company: ICompany
}
export interface INotification {
    recipient : IEmployee | ICompany
    job: IJob
    application: IApplication
    type: 'newJob' | 'applicationStatus' | 'newApplication'
    message: string
    createdAt: Date
    updatedAt: Date
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
    notifications: INotification[]
  }
  export interface IEmployee extends IUser{
    firstName: string
    lastName: string
    birthdate: Date
    jobTitle: string
    jobDescription: string
    experience: IExperience[]
    language: ILanguage[]
    skills: string[]
    education: IEducation[]
    application:IApplication[]
  }
  export interface ICompany extends IUser {
    name: string
    foundationDate: Date
    industry: string
    activitySector: string
    slogan: string
    nationalID: string
    jobs: IJob[]
    employeeNumber: string
    description: string
  }
  export interface IEducation {
   degree:string
   speciality: string
   institution: string
   startDate: Date
   endDate: Date 
  }
  export interface ILanguage {
    language: string
    level: string
  }

  export interface IExperience {
    position: string
    company: string
    startDate: Date
    endDate: Date
    description: string
    tillNowWork : boolean
  }