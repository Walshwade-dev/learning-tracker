import { useState } from "react";
import { useTimer } from "../hooks/useTimer";

import CircularProgress from './CircularProgress'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCode, faNetworkWired, faShield } from '@fortawesome/free-solid-svg-icons'


const SUBJECT_CONFIG = {
  fullstack: {
    label: 'Fullstack Dev',
    target: 120,
    color: 'blue',
    icon: faCode,
    image: '/code.png',
    gradient: 'linear-gradient(135deg, #1e100d99 0%, #3b82f688 100%)'
  },
  networking: {
    label: 'Networking',
    target: 90,
    color: 'green',
    icon: faNetworkWired,
    image: '/networking.png',
    gradient: 'linear-gradient(135deg, #3a3f32 0%, #22c55e88 100%)'
  },
  cybersecurity: {
    label: 'Cybersecurity',
    target: 60,
    color: 'red',
    icon: faShield,
    image: '/cybersecurity.png',
    gradient: 'linear-gradient(135deg, #370f0099 0%, #af4f4488 100%)'
  }
}


const COLOR_MAP = {
  blue: {
    border: 'border-blue-400/40',
    badge: 'bg-blue-500/90 text-blue-100',
    button: 'bg-transparent text-blue-500 hover:underline',
    progress: 'bg-blue-500',
    icon: 'text-blue-500',
    hex: '#3b82f6'
  },
  green: {
    border: 'border-green-400/40',
    badge: 'bg-green-500/70 text-green-100',
    button: 'bg-transparent text-green-500 hover:underline',
    progress: 'bg-green-500',
    icon: 'text-green-500',
    hex: '#22c55e'
  },
  red: {
    border: 'border-red-400/40',
    badge: 'bg-red-500/60 text-red-100',
    button: 'bg-transparent text-red-500 hover:underline',
    progress: 'bg-red-500',
    icon: 'text-yellow-500',
    hex: '#ef4444'
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
    <div
      className="relative rounded-2xl overflow-hidden shadow-lg mb-4 min-w-86.25 max-w-98"
      style={{
        backgroundImage: `url(${config.image})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* Layer 2 — gradient color overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: config.gradient }}
      />

      {/* Layer 3 — glass content panel */}
      <div className="relative z-10 p-4 backdrop-blur-[0.1rem]">

        {/* Top row — left content + right ring/button */}
        <div className="flex items-start justify-between gap-4">

          {/* Left side */}
          <div className="flex-1 min-w-0">

            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <FontAwesomeIcon
                icon={config.icon}
                className={`text-xl ${colors.icon} drop-shadow-black`}
              />
              <div>
                <h2 className="inline-block mr-2 font-semibold text-white text-sm sm:text-base drop-shadow">
                  {config.label}
                </h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>
                  Target: {config.target >= 60
                    ? `${config.target / 60}hr`
                    : `${config.target}min`}
                </span>
              </div>
            </div>

            {/* Timer display — glass pill */}
            <div
              className="relative flex items-center justify-center mb-2 rounded-xl px-2 py-1  max-w-30 border border-white/20 overflow-hidden"
              style={{
                background: `linear-gradient(65deg, ${colors.hex}33, #ffffff15)`
              }}
            >
              <span className="text-white/90 z-10">
                {format()}
              </span>
            </div>

            {/* Logged duration */}
            {session && (
              <p className="text-xs text-white/90 shadow-lg mb-2">
                Logged: {session.duration} min
                {session.duration > 0 &&
                  ` · ${Math.round((session.duration / config.target) * 100)}% of target`}
              </p>
            )}

          </div>

          {/* Right side — ring + button */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <CircularProgress
              percentage={progressPercent}
              color={config.color}
              size={40}
            />
            {!isRunning ? (
              <button
                onClick={handleStart}
                disabled={session?.completed}
                className={`text-white text-xs pl-3 py-1.5 rounded-lg transition-all w-full ${colors.button} disabled:opacity-40 disabled:cursor-not-allowed backdrop-blur-sm`}
              >
                {session ? 'Resume' : 'Start'}
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="backdrop-blur-sm text-white text-xs py-1.5 rounded-lg transition-all w-full"
              >
                Stop
              </button>
            )}
            {session?.completed && (
              <span className="text-xs text-white/70">Done ✓</span>
            )}
          </div>

        </div>

        {/* Notes section */}
        {session && (
          <div className="mt-3 border-t-[0.2em] border-white/70 pt-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={noteInput}
                onChange={e => setNoteInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddNote()}
                placeholder="Add a checkpoint note..."
                className="flex-1 text-sm bg-white/30 border border-white/70 rounded-lg px-3 py-2 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-white/70 backdrop-blur-sm"
              />
              <button
                onClick={handleAddNote}
                disabled={loading || !noteInput.trim()}
                className="bg-white/70 hover:bg-white/70 backdrop-blur-sm border border-white/70 text-white px-3 py-2 rounded-lg disabled:opacity-60 transition-all"
              >
                {loading ? '...' : 'Save'}
              </button>
            </div>

            {notes.length > 0 && (
              <ul className="mt-3 space-y-2">
                {notes.map(note => (
                  <li
                    key={note.id}
                    className="flex items-start justify-between gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2"
                  >
                    <p className="text-xs text-white/80 flex-1">{note.content}</p>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-white/30 hover:text-red-300 text-xs transition-colors shrink-0"
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
    </div>
)
}