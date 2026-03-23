import { Router } from 'express'
import { prisma } from '../db.js'

const router = Router()

// GET /api/roadmap/:subject - Get roadmap for a subject
// Fetch all milestones for a subject, ordered by their position

router.get("/:subject", async (req, res) => {
    const { subject } = req.params

    try {
        const milestones = await prisma.roadmap.findMany({
            where: { subject },
            orderBy: { id: "asc" }
        })
        res.status(200).json(milestones)
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch roadmap" })
    }
})


// PATCH /api/roadmap/:id - Update a roadmap milestone
// Update the completed status as done or not done for a milestone

router.patch("/:id", async (req, res) => {
    const { id } = req.params
    const { done } = req.body

    try {
        const milestone = await prisma.roadmap.update({
            where: { id: parseInt(id) },
            data: { done }
        })
        res.status(200).json(milestone)
    } catch (error) {
        res.status(500).json({ error: "Failed to update roadmap milestone" })
    }
})

export default router