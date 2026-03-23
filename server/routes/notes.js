import { Router } from "express";
import { prisma } from "../db.js";



const router = Router()

//GET /api/notes/:sessionId - Get all notes for a session
router.get("/:sessionId", async (req, res) => {
    const { sessionId } = req.params

    try {
        const notes = await prisma.note.findMany({
            where: { sessionId: parseInt(sessionId) },
            orderBy: { createdAt: "asc" }
        })
        res.status(200).json(notes)
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch notes" })
    }
})

//POST /api/notes - Create a new note
// save a new note under a session

router.post("/", async (req, res) => {
    const { sessionId, content } = req.body

    if (!sessionId || !content) {
        return res.status(400).json({ error: "Session ID and content are required" })
    }

    try {
        const note = await prisma.note.create({
            data: {
                sessionId: parseInt(sessionId),
                content
            }
        })
        res.status(201).json(note)
    } catch (error) {
        res.status(500).json({ error: "Failed to create note" })
    }
})

// DELETE /api/notes/:id - Delete a note
// delete a note by id
router.delete("/:id", async (req, res) => {
    const { id } = req.params

    try {
        await prisma.note.delete({
            where: { id: parseInt(id) }
        })
        res.status(204).json({ message: "Note deleted" })
    } catch (error) {
        res.status(500).json({ error: "Failed to delete note" })
    }
})  

export default router