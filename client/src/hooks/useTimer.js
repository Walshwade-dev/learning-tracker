import {useState, useRef } from 'react'


export function useTimer() {
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null)

    const start = () => {
        if (isRunning) return
        setIsRunning(true)
        intervalRef.current = setInterval(() => {
            setSeconds(prev => prev + 1)
        }, 1000)
    }

    const stop = () => {
        clearInterval(intervalRef.current)
        setIsRunning(false)
    }

    const reset = () => {
        clearInterval(intervalRef.current)
        setIsRunning(false)
        setSeconds(0)
    }


    const format = () => {
        const h = Math.floor(seconds/ 3600)
        const m = Math.floor((seconds % 3600)/ 60)
        const s = seconds % 60
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }

    return {seconds, isRunning, start, stop, reset, format}
}