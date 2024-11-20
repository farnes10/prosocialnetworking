import { User, Employee } from '~/models/user.model'
import { Language } from '~/models/language.model'
import { Request, Response } from 'express'
import mongoose from 'mongoose'

export const createNewLanguage = async (req: Request, res: Response) => {
  try {
    const { language, level } = req.body
    const userId = req.currentUser.id
    const user = await User.findOne({ _id: userId })
    if (user && user.role === 'Employee') {
      const employee = await Employee.findOne({ _id: userId })
      const newLanguage = new Language({
        language: language,
        level: level,
        employee: employee._id
      })
      await newLanguage.save()
      employee.languages.unshift(newLanguage._id)
      return res.status(201).json({
        message: 'Langue ajouté dans votre profil avec succès',
        success: true
      })
    } else {
      return res.status(401).json({
        message: "Vous n'êtes pas autorisé à faire ceci",
        success: false
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: "'Une erreur est survenue lors de l'ajout de la langue",
      success: false
    })
  }
}
export const readAllLanguage = async (req: Request, res: Response) => {
  try {
    const allLanguages = await Language.find()
    return res.status(200).json({
      message: 'Toutes les langues ont été récupérées avec succès',
      data: allLanguages,
      success: true
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Une erreur est survenue lors de la récupération des langues',
      success: false
    })
  }
}
export const readAllMyLanguage = async (req: Request, res: Response) => {
  try {
    const userId = req.currentUser.id
    const user = await User.findOne({ _id: userId })
    if (user && user.role === 'Employee') {
      const employee = await Employee.findOne({ _id: userId })
      const allMyLanguages = await Language.find({ employee: employee._id })
      return res.status(200).json({
        message: 'Toutes les langues de votre profil ont été récupérées avec succès',
        data: allMyLanguages
      })
    } else {
      return res.status(401).json({
        message: "Vous n'êtes pas autorisé à faire ceci",
        success: false
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: 'Une erreur est survenue lors de la récupération de vos langues',
      data: error.message
    })
  }
}

export const updateLanguage = async (req: Request, res: Response) => {
  try {
    const userId = req.currentUser.id
    const user = await User.findOne({ _id: userId })
    if (user && user.role === 'Employee') {
      const employee = await Employee.findOne({ _id: userId })
      if (!employee) {
        return res.status(404).json({
          message: "L'employé n'existe pas",
          success: false
        })
      }
      const languageId = req.params.id
      const language = await Language.findOne({ _id: languageId, employee: userId })
      if (!language) {
        return res.status(404).json({
          message: "La langue n'existe pas",
          success: false
        })
      }
      const { newLanguage, newLevel } = req.body
      if (!newLanguage || !newLevel) {
        return res.status(400).json({ message: "Au moins l'un des chapms langue ou niveau doit être saisie" })
      }
      const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Langue maternelle']
      if (newLevel && !validLevels.includes(newLevel)) {
        return res.status(400).json({
          message:
            "Niveau de langue est invalide, i doit être l'un des valeurs suivantes: A1, A2, B1, B2, C1, C2 ou Langue maternelle "
        })
      }
      if (newLanguage) language.language = newLanguage
      if (newLevel) language.level = newLevel
      return res.status(200).json({
        message: 'Langue mis à jour avec succès',
        success: true
      })
    } else {
      return res.status(401).json({
        message: "Vous n'êtes pas autorisé à faire ce service",
        success: false
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      success: false
    })
  }
}

export const deleteLanguage = async (req: Request, res: Response) => {
  try {
    const userId = req.currentUser.id
    const languageId = req.params.id
    const user = await User.findOne({ _id: userId })
    if (user && user.role === 'Employee') {
      const employee = await Employee.findOne({ _id: user._id })
      if (!employee) {
        return res.status(404).json({
          message: "L'employé n'existe pas",
          success: false
        })
      }
      const language = await Language.findOne({ _id: languageId, employee: userId })
      if (!language) {
        return res.status(404).json({
          message: "La langue n'existe pas",
          success: false
        })
      }
      await Language.findByIdAndDelete(languageId)
      employee.languages.filter((lang: mongoose.Schema.Types.ObjectId) => String(lang) !== languageId)
      await employee.save
      return res.status(200).json({
        message: 'Langue supprimée avec succès',
        success: true
      })
    } else {
      return res.status(401).json({
        message: "Vous n'êtes pas autorisé à faire ce service",
        success: false
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
      success: false
    })
  }
}
