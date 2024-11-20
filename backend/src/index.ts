import cookieParser from 'cookie-parser'
import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import { connectDB } from './config/db'
import userRouter from './routes/user.routes'
import bodyParser from 'body-parser'
import jobRouter from './routes/job.routes'
import educationRouter from './routes/education.routes'
import applicationRouter from './routes/application.routes'
import languageRouter from './routes/language.routes'
import experienceRouter from './routes/experience.routes'
import notificationRouter from './routes/notifications.routes'
const app = express()
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.raw({ type: 'multipart/form-data' }))
app.use(cookieParser())
app.use('/api/v1/user', userRouter)
app.use('/api/v1/education', educationRouter)
app.use('/api/v1/application', applicationRouter)
app.use('/api/v1/language', languageRouter)
app.use('/api/v1/experience', experienceRouter)
app.use('/api/v1/job', jobRouter)
app.use('/api/v1/notifications', notificationRouter)
const port = process.env.PORT || 5050
app.listen(port, () => {
  connectDB
  console.log(`Server connected to port ${port}`)
})
