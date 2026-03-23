import { useState, useEffect } from 'react'
import SessionCard from '../components/sessionCard.jsx'

const SUBJECTS = ['fullstack', 'networking', 'cybersecurity']

function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}

function formatDisplayDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function Today() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const today = getTodayDate()

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(`/api/sessions?date=${today}`)
        const data = await res.json()
        setSessions(data)
      } catch (err) {
        console.error('Failed to fetch sessions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [today])

  const handleSessionUpdate = (updatedSession) => {
    setSessions(prev =>
      prev.map(s => s.id === updatedSession.id ? updatedSession : s)
    )
  }

  const getSessionForSubject = (subject) => {
    return sessions.find(s => s.subject === subject) || null
  }

  const completedCount = sessions.filter(s => s.completed).length

  return (
    <div className="pb-10">

      {/* Date header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Today's Schedule
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {formatDisplayDate(today)}
        </p>
      </div>

      {/* Daily progress summary */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center justify-between md:max-w-[28em]">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            Daily Progress
          </p>
          <p className="text-2xl font-bold text-gray-800 mt-0.5">
            {completedCount}
            <span className="text-gray-300 font-normal"> / 3</span>
          </p>
        </div>
        <div className="flex gap-1">
          {SUBJECTS.map(subject => {
            const session = getSessionForSubject(subject)
            return (
              <div
                key={subject}
                className={`w-3 h-3 rounded-full ${
                  session?.completed ? 'bg-green-400' : 'bg-gray-200'
                }`}
              />
            )
          })}
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-10 text-gray-400 text-sm">
          Loading your sessions...
        </div>
      ) : (
        <div className='md:grid md:grid-cols-2 lg:grid-cols-3 gap-4  py-4'>
          {SUBJECTS.map(subject => (
            <SessionCard
              key={subject}
              subject={subject}
              date={today}
              existingSession={getSessionForSubject(subject)}
              onSessionUpdate={handleSessionUpdate}
            />
          ))}
        </div>
      )}

    </div>
  )
}