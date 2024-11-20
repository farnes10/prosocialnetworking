import nodemailer from 'nodemailer'
import 'dotenv/config'
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: true,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
})

export const sendApplicationEmail = (email: string, jobTitle: string, cvFile: string, coverLetter: string) => {
  transporter.sendMail({
    from: process.env.USER,
    to: email,
    subject: 'Candidature au poste de ' + jobTitle,
    attachments: [
      {
        filename: 'cv.pdf',
        content: cvFile
      }
    ],
    text: coverLetter
  })
}
