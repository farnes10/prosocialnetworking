import { Education } from '~/models/education.model'
import { User } from '~/models/user.model'
import { Employee } from '~/models/user.model'
import { Request, Response } from 'express'
import mongoose from 'mongoose'

export const addEducation = async (req: Request, res: Response) => {
  try {
    const userId = req.currentUser.id
    const user = await User.findById(userId)
    if (user && user.role === 'Employee') {
      const employee = await Employee.findById(userId)
      const { degree, speciality, institution, startDate, endDate } = req.body
      const existingEducation = await Education.findOne({ degree: degree })
      if (existingEducation) {
        return res.status(401).json({
          message: "Ce niveau d'éducation existe déjà",
          success: false
        })
      }
      const education = new Education({
        degree: degree,
        speciality: speciality,
        institution: institution,
        startDate: startDate,
        endDate: endDate,
        employee: employee._id
      })
      await education.save()
      employee.education.unshift(education._id)
      return res.status(201).json({
        message: "Niveau d'éducation a été ajoutée avec succès",
        success: true
      })
    } else {
      return res.status(401).json({
        message: "Vous n'avez pas les droits pour effectuer cette action",
        success: false
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: "Une erreur s'est produite lors de l'ajout du niveau d'éducation",
      success: false
    })
  }
}
export const readAllMyEducations = async (req: Request, res: Response) => {
  try {
    const userId = req.currentUser.id
    const user = await User.findById(userId)
    if (user && user.role === 'Employee') {
      const employee = await Employee.findById(userId)
      if (!employee) {
        return res.status(404).json({
          message: 'Employé non trouvé',
          success: false
        })
      }
      const educations = await Education.find({ employee: employee._id })
      if (!educations) {
        return res.status(404).json({
          message: "Aucun niveau d'éducation vous correspond",
          success: false
        })
      }
      return res.status(200).json({
        message: "Tous les niveaux d'éducation ont été récupérés avec succès",
        data: educations,
        success: true
      })
    } else {
      return res.status(401).json({
        message: "Vous n'avez pas les droits pour effectuer cette action",
        success: false
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: "Une erreur s'est produite lors de la récupération des niveaux d'éducation",
      success: false,
      error: error.message
    })
  }
}

export const updateEducation = async (req: Request, res: Response) => {
  try {
    const userId = req.currentUser.id
    const educationId = req.params.id
    const education = await Education.findById(educationId)
    const user = await User.findById(userId)
    if (user && user.role === 'Employee') {
      const employee = await Employee.findById(userId)
      if (!employee) {
        return res.status(404).json({
          message: 'Employé non trouvé',
          success: false
        })
      }
      if (!education) {
        return res.status(404).json({
          message: "Niveau d'éducation non trouvé",
          success: false
        })
      }
      const { degree, speciality, institution, startDate, endDate } = req.body
      education.degree = degree
      education.speciality = speciality
      education.institution = institution
      education.startDate = startDate
      education.endDate = endDate
      education.employee = employee._id
      await education.save()
      return res.status(201).json({
        message: "Niveau d'éducation mis à jour avec succès",
        success: true,
        data: education
      })
    } else {
      return res.status(401).json({
        message: "Vous n'avez pas les droits pour effectuer cette action",
        success: false
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: "Une erreur s'est produite lors de la mise à jour du niveau d'éducation",
      success: false,
      error: error.message
    })
  }
}

export const deleteEducation = async (req: Request, res: Response) => {
  try {
    const userId = req.currentUser.id
    const educationId = req.params.id
    const user = await User.findById(userId)
    if (user && user.role === 'Employee') {
      const employee = await Employee.findById(userId)
      if (!employee) {
        return res.status(404).json({
          message: 'Employé non trouvé',
          success: false
        })
      }
      const education = await Education.findById(educationId)
      if (!education) {
        return res.status(404).json({
          message: "Niveau d'éducation non trouvé",
          success: false
        })
      }
      await Education.findByIdAndDelete(educationId)
      employee.education.filter((edu: mongoose.Schema.Types.ObjectId) => String(edu) !== educationId)
      await employee.save()
      return res.status(200).json({
        message: "Niveau d'éducation supprimé",
        success: true
      })
    } else {
      return res.status(401).json({
        message: "Vous n'avez pas les droits pour effectuer cette action",
        success: false
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: "Un problème est survenu lors de la suppression du niveau d'édudation",
      error: error.message,
      success: false
    })
  }
}
