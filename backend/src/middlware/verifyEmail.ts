import nodemailer from 'nodemailer'
import 'dotenv/config'
const verifyEmail = async (email: string, link: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD
      }
    })
    const info = transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: 'Vérification de votre email',
      text: 'Bienvenue sur FlixJob',
      html: `<div>
        <a href=${link}>Clickez ici pour activez votre compte</a>
        </div>`
    })
    console.log('Message sent: %s', (await info).messageId)
  } catch (error) {
    console.log(error, 'Mail failed to sent !!')
  }
}
export default verifyEmail
