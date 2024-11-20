import { User } from '~/models/user.model'
import { Request, Response } from 'express'
import { Job } from '~/models/job.model'
export const globalSearch = async (req: Request, res: Response) => {
  try {
    const query = req.query.q
    const pipline = [
      {
        $search: {
          index: 'textIndex',
          text: {
            query: query,
            path: {
              wildcard: '*'
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1
        }
      }
    ]
    await User.aggregate(pipline)
    await Job.aggregate(pipline)
    return res.status(200).json({
      message: 'Recherche globale effectuée avec succès',
      success: true
    })
  } catch (error: any) {
    return res.status(500).json({
      message: 'Un problème est survenu lors de la recherche globale',
      error: error.message
    })
  }
}
