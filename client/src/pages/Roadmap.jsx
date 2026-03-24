import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCode, faNetworkWired, faShield, faCheckCircle, faCircle } from '@fortawesome/free-solid-svg-icons'

const SUBJECT_CONFIG = {
  fullstack: { label: 'Fullstack Dev', icon: faCode, hex: '#3b82f6', image: '/code.png', gradient: 'linear-gradient(135deg, #1e100d99 0%, #3b82f688 100%)' },
  networking: { label: 'Networking', icon: faNetworkWired, hex: '#22c55e', image: '/networking.png', gradient: 'linear-gradient(135deg, #3a3f32 0%, #22c55e88 100%)' },
  cybersecurity: { label: 'Cybersecurity', icon: faShield, hex: '#ef4444', image: '/cybersecurity.png', gradient: 'linear-gradient(135deg, #370f0099 0%, #af4f4488 100%)' },
}

export default function Roadmap() {
  const [milestones, setMilestones] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeSubject, setActiveSubject] = useState('fullstack')

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const requests = Object.keys(SUBJECT_CONFIG).map(subject =>
          fetch(`/api/roadmap/${subject}`)
            .then(r => r.json())
            .then(data => ({ subject, data }))
        )
        const results = await Promise.all(requests)
        const mapped = {}
        results.forEach(({ subject, data }) => { mapped[subject] = data })
        setMilestones(mapped)
      } catch (err) {
        console.error('Failed to fetch roadmap:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const handleToggle = async (subject, milestone) => {
    try {
      const res = await fetch(`/api/roadmap/${milestone.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !milestone.done })
      })
      const updated = await res.json()
      setMilestones(prev => ({
        ...prev,
        [subject]: prev[subject].map(m => m.id === updated.id ? updated : m)
      }))
    } catch (err) {
      console.error('Failed to update milestone:', err)
    }
  }

  const getProgress = (subject) => {
    const list = milestones[subject] || []
    if (list.length === 0) return 0
    return Math.round((list.filter(m => m.done).length / list.length) * 100)
  }

  const config = SUBJECT_CONFIG[activeSubject]
  const activeMilestones = milestones[activeSubject] || []
  const doneCount = activeMilestones.filter(m => m.done).length

  return (
    <div className="pb-10">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Roadmap</h1>
        <p className="text-sm text-gray-400 mt-1">Track your learning milestones</p>
      </div>

      {/* Subject selector tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {Object.entries(SUBJECT_CONFIG).map(([key, cfg]) => {
          const progress = getProgress(key)
          const isActive = activeSubject === key
          return (
            <button
              key={key}
              onClick={() => setActiveSubject(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap border ${
                isActive
                  ? 'text-white shadow-md'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
              style={isActive ? { backgroundColor: cfg.hex, borderColor: cfg.hex } : {}}
            >
              <FontAwesomeIcon icon={cfg.icon} className="text-xs" />
              {cfg.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {progress}%
              </span>
            </button>
          )
        })}
      </div>

      {/* Active subject card */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-lg mb-4"
        style={{
          backgroundImage: `url(${config.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 z-0" style={{ background: config.gradient }} />
        <div className="relative z-10 p-4 backdrop-blur-[0.1rem]">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={config.icon} className="text-white text-lg" />
              <h2 className="text-white font-semibold">{config.label}</h2>
            </div>
            <span className="text-white/80 text-sm">
              {doneCount} / {activeMilestones.length} done
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
            <div
              className="h-1.5 rounded-full bg-white transition-all duration-700"
              style={{ width: `${getProgress(activeSubject)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Milestones list */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-sm text-gray-400 text-center py-8">Loading milestones...</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {activeMilestones.map((milestone, index) => (
              <li
                key={milestone.id}
                onClick={() => handleToggle(activeSubject, milestone)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <FontAwesomeIcon
                  icon={milestone.done ? faCheckCircle : faCircle}
                  className="text-base shrink-0 transition-colors"
                  style={{ color: milestone.done ? config.hex : '#d1d5db' }}
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${milestone.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {milestone.milestone}
                  </p>
                </div>
                <span className="text-xs text-gray-300 shrink-0">
                  {index + 1}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  )
}