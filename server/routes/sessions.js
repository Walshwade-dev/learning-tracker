import { Router } from "express";
import { prisma } from "../db.js";

const router = Router()

// Create a new session
router.get("/", async (req, res) => {

    const  { date } = req.query

    if(!date) {
        return res.status(400).json({ error: "Date is required" })
    }

    try {
        const sessions = await prisma.session.findMany({
            where: { date },
            include: { notes: true },
            orderBy: { createdAt: "asc" }
        })
        res.status(200).json(sessions)
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch sessions" })
    }
})

router.post("/", async (req, res) => {
    const { subject, date } = req.body

    if (!subject || !date) {
        return res.status(400).json({ error: "Subject and date are required" })
    }

    const validateSubjects = ['fullstack', 'networking', 'cybresecurity']
    if (!validateSubjects.includes(subject)) {
        return res.status(400).json({ error: "Invalid subject" })
    }

    try {
        const session = await prisma.session.create({
            data: {
                subject, date, duration: 0, completed: false
            }
        })
        res.status(201).json(session)
    } catch (error) {
        res.status(500).json({ error: "Failed to create session" })
    }
})



//update duration and mark complete
router.patch("/:id", async (req, res) => {
    const { id } = req.params
    const { duration, completed } = req.body

    try {
        const session = await prisma.session.update({
            where: { id: parseInt(id)},
            data: { duration, completed }
        })
        res.status(200).json(session)
    } catch (error) {
        res.status(500).json({ error: "Failed to update session" })
    }
})

export default router