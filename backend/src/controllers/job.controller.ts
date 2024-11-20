import { Request, Response } from 'express'
import { IJob, Job } from '~/models/job.model'
import { Notifiaction } from '~/models/notification.model'
import { Company, Employee, User } from '~/models/user.model'
import nodemailer from 'nodemailer'
import 'dotenv/config'
export interface IJobFilters {
  jobTitle: string
  experienceLevel: 'beginner' | 'junior' | 'senior' | 'expert'
  workMode?: 'hybrid' | 'on-site' | 'remote'
  jobType: string
  company?: string
  createdAfter?: Date
  activitySector: string
}
export const postJob = async (req: Request, res: Response) => {
  try {
    const {
      jobTitle,
      jobDescription,
      salary,
      experienceLevel,
      expirationDate,
      minSalary,
      requirements,
      maxSalary,
      workMode
    } = req.body
    const userId = req.currentUser.id
    const user = await User.findOne({ _id: userId })
    if (user && user.role === 'Company') {
      const company = await Company.findOne({ userId })
      const job = new Job({
        jobTitle: String(jobTitle),
        jobDescription: String(jobDescription),
        salary: Number(salary),
        workMode: String(workMode),
        minSalary: Number(minSalary),
        maxSalary: Number(maxSalary),
        requirements: requirements.split(','),
        experienceLevel: String(experienceLevel),
        expirationDate: new Date(expirationDate).toISOString(),
        createdAt: `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
        createdBy: user?.id,
        company: company._id,
        applications: []
      })
      company.jobs.unshift(job._id)
      const createdJob = await job.save()
      const employees = await Employee.find({ jobTitle: job.jobTitle })
      for (const employee of employees) {
        await Notifiaction.create({
          recipient: employee._id,
          type: 'newJob',
          job: createdJob._id,
          message: `<p>une nouvelle offre d'emploi pour ${job.jobTitle} est publiée par ${company.name}</p>
          <a href="/jobs/${job._id}">View job details</a>`,
          read: false,
          createdAt: new Date().toLocaleString()
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
        const mailOptions = {
          from: process.env.USER,
          to: employee.email,
          subject: `Nouvelle offre d'emploi "${job.jobTitle}`,
          text: `Bienvenue ${employee.firstName} ${employee.lastName},\n\nUne nouvelle offre d'emploi poulr le poste "${job.jobTitle}" a été publiée par${company.name}.\n\nDétails:\n- Poste ${job.jobTitle}\n-  Description: ${job.jobDescription}\n- Situation: ${job.location}\n- Rangée de salaire: ${job.minSalary} - ${job.maxSalary}\n- Expérience : ${job.experienceLevel}\n\nSi vous êtes interessé, cliquez sur le lien et postulez : <a href="/jobs/${job._id}">Détails de l'offre</a>\n\nCoordiallement,\nL'&quipe FlixJob`
        }
        await transporter.sendMail(mailOptions)
      }
      return res.status(201).json({
        message: `L'appel à la candidature à l'offre ${createdJob.jobTitle} à été créée avec succèss`,
        success: true
      })
    } else {
      res.status(401).json({
        message: "Vous n'êtes pas autorisé à créer une offre d'emploi",
        success: false
      })
    }
  } catch (error) {
    console.error(error)
    return res.status(409).json({
      message: 'Error creating job',
      success: false
    })
  }
}

export const getAllCompanyJobs = async (req: Request, res: Response) => {
  try {
    const companyId = req.currentUser.id
    const jobs = await Job.find({ createdBy: companyId }).populate({ path: 'Company' })
    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "Il n y'a aucune offre d'emploi",
        success: false
      })
    }
    return res.status(200).json({
      jobs,
      success: true
    })
  } catch (error: any) {
    console.log(error.message)
    return res.status(500).json({
      message: 'Un problème est survenu, essayez plus tard',
      success: false
    })
  }
}

export const getJobById = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.id
    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({
        message: 'Jobs not found.',
        success: false
      })
    }
    const applications = job.applications.length
    return res.status(200).json({ job, success: true, applications: `${applications} candidatures` })
  } catch (error) {
    console.log(error)
  }
}
export const getAllJobs = async (filters: IJobFilters, res: Response) => {
  try {
    let query = Job.find()
    if (filters.jobTitle) {
      query = query.regex('jobTitle', new RegExp(filters.jobTitle, 'i'))
    }
    if (filters.experienceLevel) {
      query = query.where('experienceLevel').equals(filters.experienceLevel)
    }
    if (filters.activitySector) {
      const companies = await Company.find({ activitySector: filters.activitySector }).select('_id')
      const companyIds = companies.map((company: any) => company._id)
      query.where('company').in(companyIds)
    }
    if (filters.workMode) {
      query = query.where('workMode').equals(filters.workMode)
    }
    if (filters.createdAfter) {
      query = query.where('createdAt').gte(Number(filters.createdAfter))
    }
    query = query.sort('-createdAt')
    const jobs = await query.exec()
    return res.status(200).json({
      jobs,
      success: true
    })
  } catch (error) {
    return res.status(404).json({
      message: 'Jobs not found.',
      success: false
    })
  }
}
