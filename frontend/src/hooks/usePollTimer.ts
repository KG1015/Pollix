import { useEffect, useState } from "react";

export function usePollTimer(remainingSeconds: number | null, isLive: boolean) {
  const [seconds, setSeconds] = useState(remainingSeconds ?? 0);

  useEffect(() => {
    if (!isLive || remainingSeconds == null) {
      setSeconds(remainingSeconds ?? 0);
      return;
    }
    setSeconds(remainingSeconds);
    const t = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [remainingSeconds, isLive]);

  return seconds;
}
