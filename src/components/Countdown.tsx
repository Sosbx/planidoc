import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { getTimeRemaining } from '../utils/timeUtils';

interface CountdownProps {
  deadline: Date;
}

const Countdown: React.FC<CountdownProps> = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(deadline));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeRemaining(deadline);
      setTimeLeft(remaining);
      
      if (remaining.isExpired) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  if (timeLeft.isExpired) {
    return (
      <div className="flex items-center gap-2 bg-red-50 text-red-800 px-4 py-2 rounded-lg">
        <Clock className="h-5 w-5" />
        <span className="text-sm font-medium">Le délai de réponse est expiré</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-indigo-50 text-indigo-800 px-4 py-2 rounded-lg">
      <Clock className="h-5 w-5" />
      <div className="text-sm">
        <span className="font-medium">Temps restant : </span>
        <span className="tabular-nums">
          {timeLeft.days > 0 && `${timeLeft.days}j `}
          {String(timeLeft.hours).padStart(2, '0')}:
          {String(timeLeft.minutes).padStart(2, '0')}:
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

export default Countdown;