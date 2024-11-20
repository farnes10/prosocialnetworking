import { postJob, getAllCompanyJobs, getJobById, getAllJobs } from '~/controllers/job.controller'
import express from 'express'
import { Request, Response } from 'express'
import { isAuthenticated } from '~/middlware/isAuthenticated'
import { IJobFilters } from '~/controllers/job.controller'

const jobRouter = express.Router()

jobRouter.post('/new_job_offer', isAuthenticated, postJob)
jobRouter.get('/all_jobs', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const filters: IJobFilters = req.query as unknown as IJobFilters
    await getAllJobs(filters, res)
  } catch (error) {
    return res.status(500).json({
      message: 'Un problème est survenu, essayez plus tard',
      success: false
    })
  }
})
jobRouter.get('job/:id', isAuthenticated, getJobById)
jobRouter.get('/job_list', isAuthenticated, getAllCompanyJobs)

export default jobRouter
