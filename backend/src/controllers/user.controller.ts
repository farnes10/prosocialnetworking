import bcrypt from 'bcrypt'
import { Request, Response, NextFunction } from 'express'
import multer, { MulterError } from 'multer'
import { User, Employee } from '~/models/user.model'
import path from 'path'
import crypto from 'crypto'
import fs from 'fs/promises'
import jwt from 'jsonwebtoken'
import { Token } from '~/models/token.model'
import 'dotenv/config'
import verifyEmail from '~/middlware/verifyEmail'
import { LoginInput, LoginSchema } from '~/schemas/login'
import { sendPasswordResetEmail } from '~/middlware/sendPasswordResetEmail'
import { sendResetSuccessEmail } from '~/middlware/sendResetSuccessEmail'

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir(path.join(__dirname, 'uploads/employees'), { recursive: true })
      cb(null, path.join(__dirname, 'uploads/employees'))
    } catch (err) {
      console.error('Error creating uploads/employees directory:', err instanceof Error ? err.message : String(err))
      cb(err as Error | null, '')
    }
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${crypto.randomBytes(16).toString('hex')}-${file.originalname}`
    cb(null, uniqueFilename)
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

export const handleEmployeeUpload = (req: Request, res: Response, next: NextFunction) => {
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

export const EmployeeRegistration = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      address,
      birthdate,
      zipCode,
      city,
      province,
      country,
      phone,
      firstName,
      lastName,
      jobTitle,
      jobDescription
    } = req.body

    const existingUser = await User.findOne({ email, role: 'Employee' })
    if (existingUser) {
      return res.status(409).json({
        message: 'This email address is already registered.',
        success: false
      })
    }

    const hashedPassword = await bcrypt.hash(String(password), 10)

    const employee = new Employee({
      email: String(email),
      password: hashedPassword,
      address: String(address),
      zipCode: Number(zipCode),
      city: String(city),
      province: String(province),
      country: String(country),
      phone: String(phone),
      firstName: String(firstName),
      lastName: String(lastName),
      birthdate: new Date(birthdate),
      jobTitle: String(jobTitle),
      jobDescription: String(jobDescription),
      verified: false,
      image: req.file?.filename
    })

    const savedEmployee = await employee.save()
    res.status(201).json({
      message: 'Your registration was successful',
      success: true,
      data: savedEmployee
    })
    const token = new Token({
      userId: savedEmployee._id,
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

export const activateAccount = async (req: Request, res: Response) => {
  try {
    const token = req.params.token
    const userToken = await Token.findOne({ token })
    if (!userToken) {
      return res.status(403).json({
        message: 'Compte utilisateur non vérifié',
        success: false
      })
    }
    await User.updateOne({ _id: userToken.userId }, { $set: { verified: true } })
    await Token.findByIdAndDelete(userToken._id)
    return res.status(201).json({
      message: 'Compte vérifié avec succèss',
      success: true
    })
  } catch {
    return res.status(500).json({
      message: 'Compte utilisateur non vérifié',
      success: false
    })
  }
}
export const login = async (req: Request, res: Response) => {
  try {
    let data: any = {}
    const contentType = req.headers['content-type']
    if (contentType && contentType.includes('multipart/form-data')) {
      const rawBody = req.body.toString('utf8')
      const parts = rawBody.split('\r\n')
      for (let i = 0; i < parts.length; i++) {
        if (parts[i].includes('name="email"')) {
          data.email = parts[i + 2].trim()
        }
        if (parts[i].includes('name="password"')) {
          data.password = parts[i + 2].trim()
        }
      }
    } else {
      data = req.body
    }
    //console.log('Parsed data:', data)
    const result = LoginSchema.safeParse(data)
    if (!result.success) {
      return res.status(400).json({
        message: 'Input non valide',
        error: result.error,
        success: false
      })
    }
    const { email, password }: LoginInput = result.data
    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      return res.status(401).json({
        message: 'Email ou mot de passe est érroné',
        success: false
      })
    } else {
      const isValidPassword = await bcrypt.compare(password, existingUser.password)
      if (!isValidPassword) {
        return res.status(401).json({
          message: 'Email ou mot de passe est érroné',
          success: false
        })
      }
      const tokenData = {
        userId: existingUser._id,
        email: existingUser.email,
        role: existingUser.role
      }
      const token = await jwt.sign(tokenData, process.env.JWT_SECRET!, { expiresIn: '1d' })
      return res
        .status(200)
        .cookie('token', token, {
          maxAge: 1 * 24 * 60 * 60 * 1000,
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true,
          sameSite: 'strict'
        })
        .json({
          message: 'Bienvenue, vous êtes connecté',
          success: true
        })
    }
  } catch (error) {
    console.error('Login error:', error instanceof Error ? error.message : String(error))
    return res.status(500).json({
      message: 'Quelque chose éronnée, essayons plus tard',
      success: false
    })
  }
}
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('token', { maxAge: 0 })
    res.status(200).json({
      message: 'Vous êtes déconnecté',
      success: true
    })
  } catch (error) {
    console.error('Erreur déconnexion:', error instanceof Error ? error.message : String(error))
    return res.status(500).json({
      message: 'Un problème est survenu, essayez plus tard',
      success: false
    })
  }
}

export const forgetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        message: 'Aucun utilisateur trouvé avec cet email',
        success: false
      })
    }
    const resetToken = crypto.randomBytes(20).toString('hex')
    const resetTokenExpiration = Date.now() + 1 * 60 * 60 * 1000 // + 1hour
    user.resetPasswordToken = resetToken
    user.resetPasswordExpiresAt = new Date(resetTokenExpiration)
    await user.save()
    await sendPasswordResetEmail(user.email, `http://localhost:5173/reset_password/${resetToken}`)
    return res.status(200).json({
      message: 'Un email de réinitialisation de mot de passe a été envoyé',
      success: true
    })
  } catch (error: any) {
    return res.status(500).json({
      message: "Un problème est survenu lors de l'envoi d'un email de restauration de mot de passe",
      success: false,
      error: error.message
    })
  }
}
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const token = req.params.token
    const { password, confirmPassword } = req.body
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() }
    })
    if (!user) {
      return res.status(400).json({ success: false, message: 'Token invalide ou token expiré' })
    }
    if (confirmPassword !== password) {
      return res.status(400).json({ success: false, message: 'Les mots de passes ne sont pas identiques' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    user.password = hashedPassword
    user.resetPasswordToken = ''
    user.resetPasswordExpiresAt = new Date()
    sendResetSuccessEmail(user.email)
    await user.save()
    return res.status(200).json({
      message: 'Votre mot de passe a été mis à jour avec succès',
      success: true
    })
  } catch (error: any) {
    return res.status(500).json({
      message: 'Un problème est survenu lors de la mise à jour du mot de passe',
      success: false,
      error: error.message
    })
  }
}
export const updateEmployeeJobDescriptionProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.currentUser.id
    const user = await User.findOne({ userId })
    if (user && user.role === 'Employee') {
      const employee = await Employee.findById(userId)
      employee.jobDescription = req.body.jobDescription
      await employee.save()
      return res.status(200).json({
        message: 'Votre description du profil a été mis à jour avec succès',
        success: true
      })
    } else {
      return res.status(401).json({ success: false, message: "Vous n'êtes pas autorisé à ce faire" })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: 'Un problème est survenu lors de la mise à jour du profil',
      sucess: false,
      error: error.message
    })
  }
}
export const updateEmployeeJobTitle = async (req: Request, res: Response) => {
  try {
    const userId = req.currentUser.id
    const user = await User.findById(userId)
    if (user && user.role === 'Employee') {
      const employee = await Employee.findById(userId)
      employee.jobTitle = req.body.jobTitle
      await employee.save()
      return res.status(200).json({
        message: 'Votre Job a été mis à jour avec succès',
        success: true
      })
    } else {
      return res.status(401).json({ success: false, message: "Vous n'êtes pas autorisé à ce faire" })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: 'Un problème est survenu lors de la mise à jour du Job',
      success: false,
      error: error.message
    })
  }
}

export const updateImageProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.currentUser.id)
    if (user) {
      user.image = req.file?.filename
      await user.save()
      return res.status(200).json({
        message: 'Phot de profil est mise à jour avec succès',
        success: true
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: 'Un problème est survenu lors de la mise à jour du photo de profil',
      error: error.message
    })
  }
}
export const updateSkillsProfile = async(req:Request, res: Response) => {
  try {
  const {skills} = req.body
  const user = await User.findById(req.currentUser.id)
  if(user && user.role === "Employee") {
    const employee = await Employee.findById(req.currentUser.id)
    employee.skills = skills
    return res.status(200).json({
      message:"Compétences mis à jour avec succès",
      success: true
    })
  } else {
    return res.status(403).json({
      message:"Vous n'avez pas le droit de le faire",
      success: false
    })
  }
  } catch (error) {
    return res.status(500).json({
      message: "Un problème est survenu, veuilllez essayez plus tard",
      success: false,
      error: error
    })
  }
}
