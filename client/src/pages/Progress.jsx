import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCode, faNetworkWired, faShield, faCalendarDay, faClock } from '@fortawesome/free-solid-svg-icons'

const SUBJECT_CONFIG = {
  fullstack: { label: 'Fullstack Dev', icon: faCode, color: 'blue', hex: '#3b82f6', target: 120 },
  networking: { label: 'Networking', icon: faNetworkWired, color: 'green', hex: '#22c55e', target: 90 },
  cybersecurity: { label: 'Cybersecurity', icon: faShield, color: 'red', hex: '#ef4444', target: 60 },
}

function getWeekRange() {
  const now = new Date()
  const day = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0],
  }
}

function getDatesInRange(start, end) {
  const dates = []
  const current = new Date(start)
  const endDate = new Date(end)
  while (current <= endDate) {
    dates.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }
  return dates
}

function formatShortDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  })
}

export default function Progress() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const { start, end } = getWeekRange()
  const dates = getDatesInRange(start, end)

  useEffect(() => {
    const fetchAllSessions = async () => {
      setLoading(true)
      try {
        const requests = dates.map(date =>
          fetch(`/api/sessions?date=${date}`).then(r => r.json())
        )
        const results = await Promise.all(requests)
        setSessions(results.flat())
      } catch (err) {
        console.error('Failed to fetch sessions:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAllSessions()
  }, [dates])

  const totalMinutesForSubject = (subject) =>
    sessions.filter(s => s.subject === subject).reduce((acc, s) => acc + s.duration, 0)

  const completedSessionsForSubject = (subject) =>
    sessions.filter(s => s.subject === subject && s.completed).length

  const totalHours = Math.floor(
    sessions.reduce((acc, s) => acc + s.duration, 0) / 60
  )

  const totalCompleted = sessions.filter(s => s.completed).length

  return (
    <div className="pb-10">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Progress</h1>
        <p className="text-sm text-gray-400 mt-1">
          Week of {formatShortDate(start)} — {formatShortDate(end)}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <FontAwesomeIcon icon={faClock} className="text-gray-400 text-sm" />
            <p className="text-xs text-gray-400 uppercase tracking-wide">Hours Logged</p>
          </div>
          <p className="text-3xl font-bold text-gray-800">{totalHours}
            <span className="text-sm font-normal text-gray-400 ml-1">hrs</span>
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-1">
            <FontAwesomeIcon icon={faCalendarDay} className="text-gray-400 text-sm" />
            <p className="text-xs text-gray-400 uppercase tracking-wide">Sessions Done</p>
          </div>
          <p className="text-3xl font-bold text-gray-800">{totalCompleted}
            <span className="text-sm font-normal text-gray-400 ml-1">/ {dates.length * 3}</span>
          </p>
        </div>
      </div>

      {/* Per subject breakdown */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <h2 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
          This Week by Subject
        </h2>
        <div className="space-y-4">
          {Object.entries(SUBJECT_CONFIG).map(([key, config]) => {
            const minutes = totalMinutesForSubject(key)
            const completed = completedSessionsForSubject(key)
            const weeklyTarget = config.target * dates.length
            const percent = Math.min(Math.round((minutes / weeklyTarget) * 100), 100)

            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={config.icon}
                      className="text-sm"
                      style={{ color: config.hex }}
                    />
                    <span className="text-sm text-gray-700">{config.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      {Math.floor(minutes / 60)}h {minutes % 60}m
                    </span>
                    <span className="text-xs font-semibold text-gray-600">
                      {percent}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: config.hex
                    }}
                  />
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  {completed} session{completed !== 1 ? 's' : ''} completed this week
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Daily breakdown */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
          Daily Breakdown
        </h2>
        {loading ? (
          <p className="text-sm text-gray-400 text-center py-4">Loading...</p>
        ) : (
          <div className="space-y-3">
            {dates.map(date => {
              const daySessions = sessions.filter(s => s.date === date)
              const dayMinutes = daySessions.reduce((acc, s) => acc + s.duration, 0)
              const isToday = date === new Date().toISOString().split('T')[0]

              return (
                <div
                  key={date}
                  className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                    isToday ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>
                      {formatShortDate(date)}
                      {isToday && <span className="ml-2 text-xs bg-blue-100 text-blue-500 px-1.5 py-0.5 rounded-full">Today</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">
                      {Math.floor(dayMinutes / 60)}h {dayMinutes % 60}m
                    </span>
                    <div className="flex gap-1">
                      {['fullstack', 'networking', 'cybersecurity'].map(subject => {
                        const s = daySessions.find(s => s.subject === subject)
                        return (
                          <div
                            key={subject}
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor: s?.completed
                                ? SUBJECT_CONFIG[subject].hex
                                : '#e5e7eb'
                            }}
                          />
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}