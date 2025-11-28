import { useState, useEffect } from 'react';

interface CountdownProps {
  endDate: string | Date;
  onExpire?: () => void;
}

export function Countdown({ endDate, onExpire }: CountdownProps) {
  // Define the state for the countdown.
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Track whether we've already notified the parent
  const [hasExpired, setHasExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const endTime =
        endDate instanceof Date
          ? endDate.getTime()
          : new Date(endDate).getTime();

      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        // Ensure onExpire is only called once
        if (!hasExpired) {
          setHasExpired(true);
          if (onExpire) onExpire();
        }
        return;
      }

        // Calculate the values of each countdown segment.
        const seconds = Math.floor(remaining / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

      setTimeLeft({
        days,
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: seconds % 60,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate, hasExpired, onExpire]);

  interface CountdownSegment {
    value: number;
    label: string;
  }

  const segments: CountdownSegment[] = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Minutes' },
    { value: timeLeft.seconds, label: 'Seconds' },
  ];

  return (
    <div className='d-flex justify-content-center gap-2 mt-2'>
      {segments.map((i) => {
        return (
          <div 
            key={i.label}
            className='text-center rounded p-2 bg-body w-25 h-50'
          >
            <div className='fw-bold'>{i.value}</div>
            <small>{i.label}</small>
          </div>
        );
      })}
    </div>
  );
}
