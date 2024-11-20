import { Application } from '~/models/application.model'
import { Request, Response, NextFunction } from 'express'
import multer, { MulterError } from 'multer'
import fs from 'fs/promises'
import crypto from 'crypto'
import path from 'path'
import { Job } from '~/models/job.model'
import { Employee, User, Company } from '~/models/user.model'
import { Notifiaction } from '~/models/notification.model'
import nodemailer from 'nodemailer'
import 'dotenv/config'
const storage = multer.diskStorage({
  destination: async (req, file, callback) => {
    try {
      await fs.mkdir(path.join(__dirname, 'uploads/cv'), { recursive: true })
      callback(null, path.join(__dirname, 'uploads/cv'))
    } catch (error) {
      console.error('Error creating directory:', error instanceof Error ? error.message : String(error))
      callback(error as Error | null, '')
    }
  },
  filename: async (req, file, callback) => {
    const uniqueFilename = `${crypto.randomBytes(16).toString('hex')}-${file.originalname}`
    callback(null, uniqueFilename)
  }
})
const upload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only pdf files are allowed.') as any)
    }
  }
}).single('cv')
export const handleCvFile = async (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, (err: any) => {
    if (err instanceof MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res
          .status(400)
          .json({ message: 'CV file size exceeds the limit (3MB). Please upload a smaller file size.', success: false })
      }
      return res.status(400).json({ message: 'Error uploading file', success: false })
    } else if (err) {
      return res.status(400).json({ message: err.message, success: false })
    }
  })
}
export const creataApplication = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id
    const applicantId = req.currentUser.id
    const user = await User.findById(applicantId)
    if (user && user.role === 'Employee') {
      const job = await Job.findById(jobId)
      if (!job) {
        return res.status(403).json({
          message: 'Job not found',
          success: false
        })
      }
      const company = await Company.findOne({ _id: job.company })
      const employee = await Employee.findOne({ _id: applicantId })
      const existingApplication = await Application.findOne({ job: jobId, applicant: applicantId })
      if (existingApplication) {
        return res.status(403).json({
          message: 'Cette candidature est déjà effectuée',
          success: false
        })
      }
      const { coverLetter } = req.body
      const application = new Application({
        firstName: String(employee.firstName),
        lastName: String(employee.lastName),
        email: String(employee.email),
        job: jobId,
        applicant: applicantId,
        cv: req.file?.filename,
        coverLetter: String(coverLetter),
        status: 'pending'
      })
      const createdApplication = await application.save()
      Notifiaction.create({
        job: job._id,
        type: 'newApplication',
        recipient: job.company,
        application: application._id,
        message: `Vous avez une nouvelle candidature pour l'offre ${job.jobTitle} du candidat ${employee.firstName} ${employee.lastName}, pour plus de détais <a href="/applications/${createdApplication._id}">Détails de l'offre</a>`,
        read: false,
        createdAt: new Date()
      })
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.USER,
          pass: process.env.PASSWORD
        },
        secure: true
      })
      transporter.sendMail({
        from: process.env.USER,
        to: company.email,
        subject: `Nouvelle candidature pour ${job.jobTitle}`,
        text: `Vous avez reçu une nouvelle candidature pour ${job.jobTitle} par le candidat Mr: ${employee.firstName} ${employee.lastName}
        Pour plus de détais, <a href="/applications/${createdApplication._id}">Détails de l'offre</a>`
      })
      return res.status(201).json({
        message: 'You are applied to this job successfully',
        success: true,
        data: createdApplication
      })
    } else {
      return res.status(401).json({
        message: "Vous n'êtes pas un employé, vous n'avez pas l'accès de postuler à cette offre",
        success: false
      })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: 'Error while appliying to this job, try later',
      success: false
    })
  }
}

export const getApplicants = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id
    const job = await Job.findById({ _id: jobId }).populate({
      path: 'applications',
      options: { sort: { createdAt: -1 } },
      populate: {
        path: 'applicant'
      }
    })
    if (!job) {
      return res.status(404).json({
        message: 'Offre non trouvée',
        success: false
      })
    }
    return res.status(200).json({
      job,
      success: true
    })
  } catch (error: any) {
    return res.status(500).json({
      message: 'Erreur lors de recherche des candidatures',
      success: false,
      error: error.message
    })
  }
}

export const getAllAppliedJobs = async (req: Request, res: Response) => {
  try {
    const userId = req.currentUser.id
    const user = await User.findOne({ _id: userId })
    if (user && user.role === 'Employee') {
      const application = await Application.find({ applicant: userId })
        .sort({ createdAt: -1 })
        .populate({
          path: 'job',
          options: { sort: { createdAt: -1 } },
          populate: {
            path: 'company',
            options: { sort: { creatdAt: -1 } }
          }
        })
      if (!application) {
        return res.status(404).json({
          message: 'Aucune candidature trouvée',
          success: false
        })
      }
      return res.status(200).json({
        application,
        success: true
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Erreur lors de la récupération des candidatures',
      success: false
    })
  }
}

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body
    const applicationId = req.params.id
    const application = await Application.findOne({ _id: applicationId })
    if (!status) {
      return res.status(400).json({
        message: 'Statut de la candidature est non fourni',
        success: false
      })
    }
    if (!application) {
      return res.status(404).json({
        mesage: 'Candidature non trouvée',
        success: false
      })
    }
    application.status = status.toLowerCase()
    await application.save()
    const applicant = await Employee.findOne({ _id: application.applicant })
    const job = await Job.findOne({ _id: application.job })
    await Notifiaction.create({
      recipient: applicant._id,
      type: 'applicationStatus',
      message: `Votre candidature au poste ${job?.jobTitle} est : ${application.status}`,
      application: application._id,
      read: false,
      createdAt: new Date()
    })
    const transporter = nodemailer.createTransport({
      // Your email transport configuration
      service: 'gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD
      },
      secure: true,
      port: 587
    })
    transporter.sendMail({
      from: process.env.USER,
      to: applicant.email,
      subject: `Status de candidature au poste de ${job?.jobTitle}`,
      text: `Votre candidature au poste de ${job?.jobTitle} est: ${application.status}`
    })
    return res.status(200).json({
      message: 'Status de candidature est mis à jour avec succès, le candidat sera notifié immédiatement',
      success: true
    })
  } catch (error: any) {
    return res.status(500).json({
      message: 'Erreur lors de la mise à jour du statut de la candidature',
      success: false,
      error: error.message
    })
  }
}
