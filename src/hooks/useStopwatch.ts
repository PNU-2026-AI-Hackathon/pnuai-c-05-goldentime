import { useState, useRef, useCallback, useEffect } from 'react';

export function useStopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    setTime(0);
    setRunning(true);
    const startTime = performance.now();
    intervalRef.current = setInterval(() => {
      setTime(Math.floor((performance.now() - startTime) / 100) / 10);
    }, 100);
  }, []);

  const stop = useCallback(() => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const reset = useCallback(() => {
    setTime(0);
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  // unmount cleanup — leak 방지
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { time, running, start, stop, reset };
}
