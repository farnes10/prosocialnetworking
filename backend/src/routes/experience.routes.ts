import {
  addExperience,
  deleteExperience,
  updateExperience,
  readAllMyExperience
} from '~/controllers/experience.controller'

import express from 'express'
import { isAuthenticated } from '~/middlware/isAuthenticated'

const experienceRouter = express.Router()

experienceRouter.post('/add', isAuthenticated, addExperience)
experienceRouter.get('/my_experiences', isAuthenticated, readAllMyExperience)
experienceRouter.put('/update/:id', isAuthenticated, updateExperience)
experienceRouter.delete('/delete/:id', isAuthenticated, deleteExperience)

export default experienceRouter
