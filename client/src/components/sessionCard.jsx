import { useState } from "react";
import { useTimer } from "../hooks/useTimer";


const SUBJECT_CONFIG = {
  fullstack: {
    label: 'Fullstack Dev',
    target: 120,
    color: 'blue',
    icon: '💻'
  },
  networking: {
    label: 'Networking (Cisco)',
    target: 90,
    color: 'green',
    icon: '🌐'
  },
  cybersecurity: {
    label: 'Cybersecurity',
    target: 60,
    color: 'red',
    icon: '🔒'
  }
}


const COLOR_MAP = {
  blue: {
    border: 'border-blue-500',
    badge: 'bg-blue-100 text-blue-700',
    button: 'bg-blue-500 hover:bg-blue-600',
    progress: 'bg-blue-500'
  },
  green: {
    border: 'border-green-500',
    badge: 'bg-green-100 text-green-700',
    button: 'bg-green-500 hover:bg-green-600',
    progress: 'bg-green-500'
  },
  red: {
    border: 'border-red-500',
    badge: 'bg-red-100 text-red-700',
    button: 'bg-red-500 hover:bg-red-600',
    progress: 'bg-red-500'
  }
}


export default function SessionCard({ subject, date, existingSession, onSessionUpdate }) {
  const config = SUBJECT_CONFIG[subject]
  const colors = COLOR_MAP[config.color]
  const { seconds, isRunning, start, stop, reset, format } = useTimer()
  const [session, setSession] = useState(existingSession || null)
  const [noteInput, setNoteInput] = useState('')
  const [notes, setNotes] = useState(existingSession?.notes || [])
  const [loading, setLoading] = useState(false)

  const progressPercent = Math.min(
    ((session?.duration || 0) / config.target) * 100,
    100
  )

  const handleStart = async () => {
    if (!session) {
      try {
        const res = await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subject, date })
        })
        const data = await res.json()
        setSession(data)
      } catch (err) {
        console.error('Failed to create session:', err)
        return
      }
    }
    start()
  }

  const handleStop = async () => {
    stop()
    if (!session) return
    const totalMinutes = Math.floor((session.duration || 0) + seconds / 60)
    const completed = totalMinutes >= config.target

    try {
      const res = await fetch(`/api/sessions/${session.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration: totalMinutes, completed })
      })
      const data = await res.json()
      setSession(data)
      onSessionUpdate(data)
      reset()
    } catch (err) {
      console.error('Failed to update session:', err)
    }
  }

  const handleAddNote = async () => {
    if (!noteInput.trim() || !session) return
    setLoading(true)

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: noteInput, sessionId: session.id })
      })
      const data = await res.json()
      setNotes(prev => [...prev, data])
      setNoteInput('')
    } catch (err) {
      console.error('Failed to save note:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNote = async (noteId) => {
    try {
      await fetch(`/api/notes/${noteId}`, { method: 'DELETE' })
      setNotes(prev => prev.filter(n => n.id !== noteId))
    } catch (err) {
      console.error('Failed to delete note:', err)
    }
  }

  return (
    <div className={`bg-white rounded-xl border-l-4 ${colors.border} shadow-sm p-4 mb-4`}>

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{config.icon}</span>
          <div>
            <h2 className="font-semibold text-gray-800 text-sm sm:text-base">
              {config.label}
            </h2>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>
              Target: {config.target >= 60
                ? `${config.target / 60}hr`
                : `${config.target}min`}
            </span>
          </div>
        </div>

        {/* Completion badge */}
        {session?.completed && (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            ✓ Done
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
        <div
          className={`h-1.5 rounded-full transition-all duration-500 ${colors.progress}`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Timer display */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-2xl sm:text-3xl font-bold text-gray-700">
          {format()}
        </span>
        <div className="flex gap-2">
          {!isRunning ? (
            <button
              onClick={handleStart}
              disabled={session?.completed}
              className={`text-white text-sm px-4 py-1.5 rounded-lg transition-colors ${colors.button} disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {session ? 'Resume' : 'Start'}
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="bg-gray-700 hover:bg-gray-800 text-white text-sm px-4 py-1.5 rounded-lg transition-colors"
            >
              Stop
            </button>
          )}
        </div>
      </div>

      {/* Saved duration */}
      {session && (
        <p className="text-xs text-gray-400 mb-3">
          Logged: {session.duration} min
          {session.duration > 0 && ` · ${Math.round((session.duration / config.target) * 100)}% of target`}
        </p>
      )}

      {/* Note input */}
      {session && (
        <div className="mt-3 border-t pt-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={noteInput}
              onChange={e => setNoteInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddNote()}
              placeholder="Add a checkpoint note..."
              className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <button
              onClick={handleAddNote}
              disabled={loading || !noteInput.trim()}
              className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg hover:bg-gray-900 disabled:opacity-40 transition-colors"
            >
              {loading ? '...' : 'Save'}
            </button>
          </div>

          {/* Notes list */}
          {notes.length > 0 && (
            <ul className="mt-3 space-y-2">
              {notes.map(note => (
                <li
                  key={note.id}
                  className="flex items-start justify-between gap-2 bg-gray-50 rounded-lg px-3 py-2"
                >
                  <p className="text-xs text-gray-600 flex-1">{note.content}</p>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-gray-300 hover:text-red-400 text-xs transition-colors shrink-0"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}