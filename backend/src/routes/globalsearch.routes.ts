import { globalSearch } from '~/controllers/globalSearch.controller'
import express from 'express'

const searchRouter = express.Router()

searchRouter.post('/search/?q', globalSearch)
export default searchRouter
