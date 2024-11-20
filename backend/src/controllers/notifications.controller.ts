import { Notifiaction } from '~/models/notification.model'
import { Request, Response } from 'express'
import { User, Employee, Company } from '~/models/user.model'
//New Job notifications for employees
export const getNewJobEmployee = async (req: Request, res: Response) => {
  try {
    const userId = req.currentUser.id
    const user = await User.findById(userId)
    if (user && user.role === 'Employee') {
      const employee = await Employee.findById(user._id)
      const jobNotifications = await Notifiaction.find({ recipient: employee._id, type: 'newJob' })
      return res.status(200).json({
        message: 'Job notifications retrieved successfully',
        data: jobNotifications
      })
    } else {
      return res.status(401).json({
        message: 'You are not an employee'
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving job notifications',
      error: error
    })
  }
}
//New notifications of application status for employees
export const applicationsStatusNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.currentUser.id
    const user = await User.findById(userId)
    if (user && user.role === 'Employee') {
      const employee = await Employee.findById(user._id)
      const applicationStatus = await Notifiaction.find({ recipient: employee._id, type: 'applicationStatus' })
      return res.status(200).json({
        message: 'Job notifications retrieved successfully',
        data: applicationStatus
      })
    } else {
      return res.status(401).json({
        message: 'You are not an employee'
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving job notifications',
      error: error
    })
  }
}

// new applications for company
export const applicationNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.currentUser.id
    const user = await User.findById(userId)
    if (user && user.role === 'Company') {
      const company = await Company.findById(user._id)
      const newApplications = await Notifiaction.find({ recipient: company._id, type: 'newApplication' })
      return res.status(200).json({
        message: 'New applications retrieved successfully',
        data: newApplications,
        success: true
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving new applications',
      error: error
    })
  }
}
