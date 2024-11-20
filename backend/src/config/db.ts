import mongoose from 'mongoose'
import 'dotenv/config'
export const connectDB = mongoose
  .connect(String(process.env.DATABASE_URL))
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch((err: any) => {
    console.error(err.message)
  })
