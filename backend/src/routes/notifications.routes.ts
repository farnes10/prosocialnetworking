import express from 'express'
import {
  getNewJobEmployee,
  applicationNotifications,
  applicationsStatusNotifications
} from '~/controllers/notifications.controller'
import { isAuthenticated } from '~/middlware/isAuthenticated'

const notificationRouter = express.Router()
notificationRouter.get('/newjobs', isAuthenticated, getNewJobEmployee)
notificationRouter.get('/applications', isAuthenticated, applicationNotifications)
notificationRouter.get('/application_status', isAuthenticated, applicationsStatusNotifications)

export default notificationRouter
