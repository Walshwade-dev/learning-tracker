import { useState, useRef, useEffect } from 'react'

export function useTimer() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const startTimeRef = useRef(null)
  const accumulatedRef = useRef(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  const start = () => {
    if (isRunning) return
    startTimeRef.current = Date.now()
    setIsRunning(true)

    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      setSeconds(accumulatedRef.current + elapsed)
    }, 1000)
  }

  const stop = () => {
    if (!isRunning) return
    clearInterval(intervalRef.current)
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
    accumulatedRef.current = accumulatedRef.current + elapsed
    setSeconds(accumulatedRef.current)
    setIsRunning(false)
  }

  const reset = () => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setSeconds(0)
    accumulatedRef.current = 0
    startTimeRef.current = null
  }

  const format = () => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
   return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`
  }

  return { seconds, isRunning, start, stop, reset, format }
}