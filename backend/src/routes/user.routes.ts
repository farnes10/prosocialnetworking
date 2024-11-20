import express from 'express'
import { handleEmployeeUpload, EmployeeRegistration, login, logout, activateAccount, updateSkillsProfile } from '~/controllers/user.controller'
import { CompanyRegistration, handleCompanyImageUpload } from '~/controllers/company.controller'
import { isAuthenticated } from '~/middlware/isAuthenticated'

const userRouter = express.Router()

userRouter.post('/signup/employee', handleEmployeeUpload, EmployeeRegistration)
userRouter.post('/signup/company', handleCompanyImageUpload, CompanyRegistration)
userRouter.post('/signin', login)
userRouter.post('/signout', logout)
userRouter.get('/confirm/:token', activateAccount)
userRouter.post('/skills', isAuthenticated, updateSkillsProfile )

export default userRouter
