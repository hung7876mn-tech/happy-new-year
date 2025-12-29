
import React from 'react';
import { TimeLeft } from '../types';

interface CountdownDisplayProps {
  timeLeft: TimeLeft;
}

const CountdownDisplay: React.FC<CountdownDisplayProps> = ({ timeLeft }) => {
  const units = [
    { label: 'Ngày', value: timeLeft.days },
    { label: 'Giờ', value: timeLeft.hours },
    { label: 'Phút', value: timeLeft.minutes },
    { label: 'Giây', value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in">
      <h2 className="text-3xl md:text-5xl font-light tracking-widest text-white uppercase drop-shadow-md">
        Countdown to New Year
      </h2>
      <div className="flex space-x-4 md:space-x-8">
        {units.map((unit) => (
          <div key={unit.label} className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-8 min-w-[80px] md:min-w-[140px] border border-white/20 shadow-2xl">
            <span className="text-4xl md:text-7xl font-black text-yellow-400 tabular-nums">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-xs md:text-sm uppercase tracking-widest text-gray-300 mt-2">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownDisplay;
