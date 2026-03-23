import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import sessionsRouter from './routes/sessions.js'
import notesRouter from './routes/notes.js'
import roadmapRouter from './routes/roadmap.js'


dotenv.config()



const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


//Routes
app.use("/api/sessions", sessionsRouter)
app.use("/api/notes", notesRouter)
app.use("/api/roadmap", roadmapRouter)



// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Learning Tracker API is running' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})