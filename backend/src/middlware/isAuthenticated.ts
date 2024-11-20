import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({
        message: 'Utilisateur non authentifié',
        success: false
      })
    }
    const decode = await jwt.verify(token, process.env.JWT_SECRET!)
    if (!decode) {
      return res.status(403).json({
        message: 'Token est invalide',
        success: false
      })
    }
    const { id, email, role } = decode as jwt.JwtPayload
    req.currentUser = { id, email, role }
    next()
  } catch (error: any) {
    console.log(error.message)
  }
}
