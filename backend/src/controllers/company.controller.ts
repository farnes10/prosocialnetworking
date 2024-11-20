import bcrypt from 'bcrypt'
import multer, { MulterError } from 'multer'
import { Request, Response, NextFunction } from 'express'
import path from 'path'
import crypto from 'crypto'
import fs from 'fs/promises'
import { User, Company } from '~/models/user.model'
import { Token } from '~/models/token.model'
import verifyEmail from '~/middlware/verifyEmail'
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir(path.join(__dirname, 'uploads/companies'), { recursive: true })
      cb(null, path.join(__dirname, 'uploads/companies'))
    } catch (error) {
      console.error(
        'Error creating uploads/employees directory: ',
        error instanceof Error ? error.message : String(error)
      )
    }
  },
  filename: (req, file, cb) => {
    const uniqueFileName = `${crypto.randomBytes(16).toString('hex')}-${file.originalname}`
    cb(null, uniqueFileName)
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 3 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif']
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and GIF image files are allowed.') as any)
    }
  }
}).single('image')

export const handleCompanyImageUpload = (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, (err: any) => {
    if (err instanceof MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res
          .status(400)
          .json({ message: 'Image file size exceeds the limit (3MB). Please upload a smaller image.', success: false })
      }
      return res.status(400).json({ message: 'Error uploading image', success: false })
    } else if (err) {
      return res.status(400).json({ message: err.message, success: false })
    }
    next()
  })
}

export const CompanyRegistration = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      address,
      zipCode,
      city,
      province,
      country,
      name,
      foundationDate,
      industry,
      activitySector,
      slogan,
      nationalId,
      phone,
      description,
      employeeNumber
    } = req.body
    const existingCompany = await User.findOne({ email })
    if (existingCompany) {
      return res.status(400).json({
        message: 'Comapny with this email has been registred',
        success: false
      })
    }
    const hashedPassword = await bcrypt.hash(String(password), 10)

    const company = new Company({
      email: String(email),
      password: hashedPassword,
      address: String(address),
      zipCode: Number(zipCode),
      city: String(city),
      province: String(province),
      country: String(country),
      name: String(name),
      foundationDate: new Date(foundationDate),
      industry: String(industry),
      activitySector: String(activitySector),
      slogan: String(slogan),
      image: req.file?.filename,
      nationalID: String(nationalId),
      description: String(description),
      employeeNumber: String(employeeNumber),
      phone: String(phone),
      createdAt: new Date()
    })
    const savedCompany = await company.save()
    res.status(201).json({
      message: 'Company registred successfully',
      success: true,
      data: savedCompany
    })
    const token = new Token({
      userId: savedCompany._id,
      token: crypto.randomBytes(16).toString('hex')
    })
    await token.save()
    const link = `http://localhost:5000/api/v1/user/confirm/${token.token}`
    await verifyEmail(String(email), link)
  } catch (error) {
    console.error('Employee registration error:', error instanceof Error ? error.message : String(error))
    if (error instanceof Error && error.name === 'MongoError' && 'code' in error && error.code === 11000) {
      return res.status(409).json({ message: 'This email address is already registered.', success: false })
    } else {
      return res.status(500).json({
        message: 'Something went wrong, please try again later',
        success: false
      })
    }
  }
}
export const updateCompanyEmployeeNumber = async (req: Request, res: Response) => {
  try {
    const companyId = req.currentUser.id
    const { employeeNumber } = req.body
    const company = await Company.findByIdAndUpdate(companyId, {
      $set: {
        employeeNumber: employeeNumber
      }
    })
    await company.save()
    return res.status(200).json({
      message: 'Le nombre des employés est mis à jour avec success',
      success: true
    })
  } catch (error: any) {
    return res.status(500).json({
      message: 'un problème est survenu, essayez plus tard',
      success: false,
      error: error.message
    })
  }
}
