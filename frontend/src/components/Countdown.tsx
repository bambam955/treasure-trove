import { useState, useEffect } from 'react';

interface CountdownProps {
  endDate: Date;
}

export function Countdown({ endDate }: CountdownProps) {
  // Define the state for the countdown.
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = endDate.getTime() - Date.now();
      // Check if the countdown is over.
      // TODO: make it more obvious that the countdown is complete...
      if (remaining <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        // Calculate the values of each countdown segment.
        const seconds = Math.floor(remaining / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        const remainingHours = hours % 24;
        const remainingMinutes = minutes % 60;
        const remainingSeconds = seconds % 60;

        setTimeLeft({
          days,
          hours: remainingHours,
          minutes: remainingMinutes,
          seconds: remainingSeconds,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  // Define the four segments of the countdown.
  // Using an array like this reduces repetitive HTML code.
  interface CountdownSegment {
    value: number;
    label: string;
  }
  const segments: CountdownSegment[] = [
    {
      value: timeLeft.days,
      label: 'Days',
    },
    {
      value: timeLeft.hours,
      label: 'Hours',
    },
    {
      value: timeLeft.minutes,
      label: 'Minutes',
    },
    {
      value: timeLeft.seconds,
      label: 'Seconds',
    },
  ];

  return (
    <div className='d-flex justify-content-center gap-2 mt-2'>
      {segments.map((i) => {
        return (
          <div className='text-center rounded p-2 bg-body w-25 h-50'>
            <div className='fw-bold'>{i.value}</div>
            <small>{i.label}</small>
          </div>
        );
      })}
    </div>
  );
}
