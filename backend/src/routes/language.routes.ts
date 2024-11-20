import {
  createNewLanguage,
  readAllLanguage,
  readAllMyLanguage,
  updateLanguage,
  deleteLanguage
} from '~/controllers/language.controller'

import express from 'express'
import { isAuthenticated } from '~/middlware/isAuthenticated'
const languageRouter = express.Router()

languageRouter.post('/add', isAuthenticated, createNewLanguage)
languageRouter.get('/all_languages', isAuthenticated, readAllLanguage)
languageRouter.get('/my_languages', isAuthenticated, readAllMyLanguage)
languageRouter.put('/update/:id', isAuthenticated, updateLanguage)
languageRouter.delete('/delete/:id', isAuthenticated, deleteLanguage)

export default languageRouter
