import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Learning Tracker API is running' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})