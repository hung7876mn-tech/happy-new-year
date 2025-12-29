
import React, { useState, useEffect, useCallback } from 'react';
import { AppStatus, TimeLeft } from './types';
import Fireworks from './components/Fireworks';
import MusicPlayer from './components/MusicPlayer';
import CountdownDisplay from './components/CountdownDisplay';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
  const [messageIndex, setMessageIndex] = useState(0);

  // Thời điểm chuyển giao: 00:00:00 ngày 01/01/2026
  const TARGET_DATE = new Date('2026-01-01T00:00:00').getTime();
  
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const now = new Date().getTime();
    const difference = TARGET_DATE - now;
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      total: difference
    };
  }, [TARGET_DATE]);

  useEffect(() => {
    if (!isStarted) return;

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      // Khi đồng hồ về 0
      if (remaining.total <= 0 && status === AppStatus.COUNTDOWN) {
        clearInterval(timer);
        triggerSequence();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, status, calculateTimeLeft]);

  const triggerSequence = () => {
    // 1. Dừng đếm ngược, hiện quả pháo nổ chậm (Giai đoạn FUSE - Nhạc 1 dừng ở đây)
    setStatus(AppStatus.FUSE);
    
    // 2. Sau 1 giây, bắt đầu pháo hoa và Nhạc 2
    setTimeout(() => {
      setStatus(AppStatus.CELEBRATION);
      startMessageSequence();
    }, 1000);
  };

  const startMessageSequence = () => {
    // Lời chúc 1: Hiện lên
    setMessageIndex(1);
    
    // Sau 5 giây, ẩn lời chúc 1, hiện lời chúc 2
    setTimeout(() => {
      setMessageIndex(2);
    }, 5000);

    // Sau 10 giây (tổng cộng), ẩn lời chúc 2, hiện "Happy New Year"
    setTimeout(() => {
      setMessageIndex(3);
    }, 10000);
  };

  const handleStart = () => {
    setIsStarted(true);
    const initialTime = calculateTimeLeft();
    setTimeLeft(initialTime);
    if (initialTime.total > 0) {
      setStatus(AppStatus.COUNTDOWN);
    } else {
      triggerSequence();
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden selection:bg-yellow-500 selection:text-black">
      <MusicPlayer status={status} isStarted={isStarted} />

      {/* Màn hình khởi động để kích hoạt âm thanh */}
      {!isStarted && (
        <div className="z-50 flex flex-col items-center space-y-8 animate-fade-in text-center px-4">
          <div className="space-y-2">
            <h1 className="text-white text-3xl md:text-5xl font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
              New Year 2026
            </h1>
            <p className="text-yellow-500 tracking-[0.3em] uppercase text-sm">Countdown Experience</p>
          </div>
          <button
            onClick={handleStart}
            className="group relative px-16 py-6 overflow-hidden bg-white text-black rounded-full text-2xl font-bold transition-all hover:pr-20 hover:bg-yellow-400 active:scale-95"
          >
            <span className="relative z-10">BẮT ĐẦU</span>
            <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">→</span>
          </button>
          <p className="text-gray-500 text-xs italic">Vui lòng bật âm lượng để có trải nghiệm tốt nhất</p>
        </div>
      )}

      {/* Giao diện chính */}
      {isStarted && (
        <div className="z-10 w-full max-w-5xl px-4 text-center">
          {status === AppStatus.COUNTDOWN && (
            <CountdownDisplay timeLeft={timeLeft} />
          )}

          {status === AppStatus.FUSE && (
            <div className="flex flex-col items-center justify-center space-y-8">
              <div className="relative w-32 h-48 flex flex-col items-center justify-end">
                {/* Quả pháo */}
                <div className="w-24 h-40 bg-gradient-to-b from-red-600 to-red-800 rounded-2xl shadow-2xl border-2 border-red-500 flex flex-col items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-black/20 animate-pulse"></div>
                   <span className="text-white font-black text-3xl rotate-90">2026</span>
                </div>
                {/* Ngòi nổ */}
                <div className="absolute top-[-30px] w-1 h-10 bg-gray-600 origin-bottom">
                   <div className="w-4 h-4 bg-yellow-400 rounded-full animate-ping absolute top-0 left-[-6px] shadow-[0_0_15px_yellow]"></div>
                   <div className="w-2 h-2 bg-white rounded-full absolute top-1 left-[-2px]"></div>
                </div>
              </div>
              <p className="text-5xl text-white font-black tracking-[1em] uppercase ml-[1em] animate-pulse">
                SẮP NỔ...
              </p>
            </div>
          )}

          {status === AppStatus.CELEBRATION && (
            <>
              <Fireworks />
              <div className="relative z-20 flex flex-col items-center justify-center min-h-[400px]">
                {messageIndex === 1 && (
                  <h1 className="text-4xl md:text-7xl font-bold text-white leading-tight animate-fade-in-out drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] px-4">
                    Chúc tất cả mọi người thành công trong cuộc sống
                  </h1>
                )}
                {messageIndex === 2 && (
                  <h1 className="text-5xl md:text-9xl font-black text-yellow-400 animate-fade-in-out drop-shadow-[0_0_30px_rgba(255,215,0,0.6)] px-4">
                    Chúc mừng năm mới 2026
                  </h1>
                )}
                {messageIndex === 3 && (
                  <h1 className="text-7xl md:text-[13rem] dancing-script text-transparent bg-clip-text bg-gradient-to-t from-yellow-600 via-yellow-200 to-yellow-400 animate-scale-up drop-shadow-[0_0_40px_rgba(255,215,0,0.5)]">
                    Happy New Year
                  </h1>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Hiệu ứng ánh sáng nền */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-yellow-900/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: scale(0.8) translateY(30px); filter: blur(10px); }
          10% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
          90% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
          100% { opacity: 0; transform: scale(1.1) translateY(-30px); filter: blur(10px); }
        }
        .animate-fade-in-out {
          animation: fadeInOut 5s forwards cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes scaleUp {
          0% { opacity: 0; transform: scale(0.3) rotate(-5deg); filter: blur(20px); }
          100% { opacity: 1; transform: scale(1) rotate(0); filter: blur(0); }
        }
        .animate-scale-up {
          animation: scaleUp 2.5s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(60px, -60px) scale(1.3); }
          66% { transform: translate(-40px, 40px) scale(0.7); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 15s infinite alternate ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 3s;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
            animation: fadeIn 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
