import express from 'express'

import {
  creataApplication,
  getAllAppliedJobs,
  getApplicants,
  handleCvFile,
  updateApplicationStatus
} from '~/controllers/application.controller'
import { isAuthenticated } from '~/middlware/isAuthenticated'

const applicationRouter = express.Router()
applicationRouter.post('/apply/:id', isAuthenticated, handleCvFile, creataApplication)
applicationRouter.get('/applied_jobs', isAuthenticated, getAllAppliedJobs)
applicationRouter.get('/:id/applicants', isAuthenticated, getApplicants)
applicationRouter.put('/status/:id/update', isAuthenticated, updateApplicationStatus)

export default applicationRouter
