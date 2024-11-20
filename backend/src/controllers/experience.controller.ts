import { Experience, IExperience } from '~/models/experience.model'
import { User } from '~/models/user.model'
import { Employee } from '~/models/user.model'
import { Request, Response } from 'express'
import mongoose from 'mongoose'

export const addExperience = async (req: Request, res: Response) => {
  try {
    const userId = req.currentUser.id
    const user = await User.findById(userId)
    if (user && user.role === 'Employee') {
      const experienceData: Omit<IExperience, 'endDate' | 'tillNowWork'> & { endDate?: Date; tillNowWork?: boolean } =
        req.body
      const newExperience: IExperience = {
        ...experienceData,
        tillNowWork: experienceData.tillNowWork || false,
        endDate: experienceData.tillNowWork
          ? new Date()
          : experienceData.endDate
            ? new Date(experienceData.endDate)
            : new Date()
      }
      const createdExperience = await Experience.create(newExperience)
      await Employee.findByIdAndUpdate(userId, { $push: { experience: createdExperience._id } })
      return res.status(201).json({
        message: 'Experience added successfully',
        success: true
      })
    } else {
      return res.status(401).json({
        message: "Vous n'avez pas le droit de ce faire",
        success: false
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Failed to add experience',
      success: false
    })
  }
}

export const readAllMyExperience = async (req: Request, res: Response) => {
  try {
    const userId = req.currentUser.id
    const user = await User.findById(userId)
    if (user && user.role === 'Employee') {
      const experiences = await Experience.find({ employee: userId })
      return res.status(200).json({
        message: 'All experiences are fetched successfully',
        success: true,
        data: experiences
      })
    } else {
      return res.status(403).json({
        message: 'You are not authorized to access this resource',
        success: false
      })
    }
  } catch (error) {
    console.error('Error updating experience:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update experience',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const updateExperience = async (req: Request, res: Response) => {
  try {
    const userId = req.currentUser.id
    const experienceId = req.params.id
    const user = await User.findById(userId)
    if (user && user.role === 'Employee') {
      const experienceData: Omit<IExperience, 'endDate' | 'tillNowWork'> & { endDate?: Date; tillNowWork?: boolean } =
        req.body
      if (experienceData.startDate) {
        experienceData.startDate = new Date(experienceData.startDate)
      }

      if (experienceData.endDate) {
        experienceData.endDate = new Date(experienceData.endDate)
      }
      // Handle the case where tillNowWork is set to true
      if (experienceData.tillNowWork === true) {
        experienceData.endDate = undefined
      } else if (experienceData.tillNowWork === false && !experienceData.endDate) {
        // If tillNowWork is set to false, ensure an end date is provided
        return res.status(400).json({
          success: false,
          message: 'End date is required when tillNowWork is false'
        })
      }
      const updatedExperience = await Experience.findByIdAndUpdate(
        experienceId,
        {
          $set: {
            ...experienceData
          }
        },
        { new: true, runValidators: true }
      )
      if (!updatedExperience) {
        return res.status(404).json({
          success: false,
          message: 'Experience not found'
        })
      }
      res.status(200).json({
        success: true,
        data: updatedExperience,
        message: 'Experience updated successfully'
      })
    } else {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this experience'
      })
    }
  } catch (error) {
    console.error('Error updating experience:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update experience',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const userId = req.currentUser.id
    const experienceId = req.params.id
    const user = await User.findById(userId)
    if (user && user.role === 'Employee') {
      const employee = await Employee.findById(userId)
      const experience = await Experience.findByIdAndDelete(experienceId)
      if (!experience) {
        return res.status(404).json({
          success: false,
          message: 'Experience not found'
        })
      }
      employee.experience.filter((exp: mongoose.Schema.Types.ObjectId) => String(exp) !== experienceId)
      await employee.save()
      return res.status(200).json({
        success: true,
        message: 'Experience deleted successfully'
      })
    } else {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this experience'
      })
    }
  } catch (error) {
    console.error('Error updating experience:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update experience',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
