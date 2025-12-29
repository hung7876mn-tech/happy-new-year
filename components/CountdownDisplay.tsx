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
    <div className="flex flex-col items-center justify-center space-y-12 animate-fade-in">
      <div className="space-y-4">
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-[0.2em] drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Countdown to New Year
        </h2>
        <p className="text-yellow-500 text-xl md:text-2xl tracking-[0.5em] font-light uppercase opacity-80">
          with peoe
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {units.map((unit) => (
          <div key={unit.label} className="group relative flex flex-col items-center bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-10 min-w-[100px] md:min-w-[160px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 tabular-nums">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-gray-400 mt-4 font-bold">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownDisplay;