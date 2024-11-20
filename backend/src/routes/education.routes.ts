import { addEducation, deleteEducation, updateEducation, readAllMyEducations } from '~/controllers/education.controller'
import { isAuthenticated } from '~/middlware/isAuthenticated'
import express from 'express'

const educationRouter = express.Router()

educationRouter.post('/add', isAuthenticated, addEducation)
educationRouter.get('my_educations', isAuthenticated, readAllMyEducations)
educationRouter.put('/update/:id', isAuthenticated, updateEducation)
educationRouter.delete('/delete/:id', isAuthenticated, deleteEducation)

export default educationRouter
