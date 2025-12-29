
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

  // Mục tiêu: 00:00:00 ngày 01/01/2026
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

      // Khi đồng hồ đếm ngược kết thúc
      if (remaining.total <= 0 && status === AppStatus.COUNTDOWN) {
        clearInterval(timer);
        triggerSequence();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, status, calculateTimeLeft]);

  const triggerSequence = () => {
    // 1. Hiện quả pháo nổ chậm (Giai đoạn FUSE - 1 giây)
    setStatus(AppStatus.FUSE);
    
    // 2. Sau đúng 1 giây, bắn pháo hoa và đổi nhạc sang i3LYCGQLHsM
    setTimeout(() => {
      setStatus(AppStatus.CELEBRATION);
      startMessageSequence();
    }, 1000);
  };

  const startMessageSequence = () => {
    // Lời chúc 1: "chúc tất cả mọi người thành công trong cuộc sống"
    setMessageIndex(1);
    
    // Sau 5 giây, lời chúc 1 biến mất, hiện lời chúc 2: "chúc mừng năm mới 2026"
    setTimeout(() => {
      setMessageIndex(2);
    }, 5000);

    // Sau 10 giây (tổng cộng), lời chúc 2 biến mất, hiện "Happy New Year"
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
      {/* Trình phát nhạc quản lý 2 bản nhạc */}
      <MusicPlayer status={status} isStarted={isStarted} />

      {/* Màn hình khởi động */}
      {!isStarted && (
        <div className="z-50 flex flex-col items-center space-y-10 animate-fade-in text-center px-4">
          <div className="space-y-4">
            <h1 className="text-white text-5xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-600">
              NEW YEAR 2026
            </h1>
            <p className="text-yellow-500 tracking-[0.8em] uppercase text-sm font-bold opacity-60">Prepare for the Moment</p>
          </div>
          <button
            onClick={handleStart}
            className="group relative px-20 py-8 overflow-hidden bg-white text-black rounded-2xl text-3xl font-black transition-all hover:bg-yellow-400 hover:shadow-[0_0_50px_rgba(250,204,21,0.4)] active:scale-95"
          >
            <span className="relative z-10">BẮT ĐẦU ĐẾM NGƯỢC</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 translate-y-full group-hover:translate-y-0 transition-transform"></div>
          </button>
        </div>
      )}

      {/* Giao diện Đếm ngược & Chúc mừng */}
      {isStarted && (
        <div className="z-10 w-full max-w-6xl px-6 text-center">
          {status === AppStatus.COUNTDOWN && (
            <CountdownDisplay timeLeft={timeLeft} />
          )}

          {status === AppStatus.FUSE && (
            <div className="flex flex-col items-center justify-center space-y-12 animate-pulse">
              <div className="relative w-40 h-64 flex flex-col items-center justify-end">
                {/* Hình ảnh quả pháo */}
                <div className="w-32 h-52 bg-gradient-to-b from-red-600 to-red-900 rounded-3xl shadow-[0_0_40px_rgba(220,38,38,0.6)] border-4 border-red-500/50 flex flex-col items-center justify-center relative">
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                   <span className="text-white font-black text-5xl rotate-90 tracking-tighter">BOOM</span>
                </div>
                {/* Ngòi nổ đang cháy */}
                <div className="absolute top-[-40px] w-1.5 h-12 bg-gray-700 origin-bottom">
                   <div className="w-8 h-8 bg-yellow-400 rounded-full animate-ping absolute top-[-10px] left-[-12px] shadow-[0_0_30px_rgba(253,224,71,1)]"></div>
                   <div className="w-4 h-4 bg-orange-500 rounded-full absolute top-[-2px] left-[-5px] animate-bounce"></div>
                </div>
              </div>
              <p className="text-6xl text-white font-black tracking-[0.5em] uppercase animate-bounce drop-shadow-2xl">
                SẮP NỔ...
              </p>
            </div>
          )}

          {status === AppStatus.CELEBRATION && (
            <>
              <Fireworks />
              <div className="relative z-20 flex flex-col items-center justify-center min-h-[500px]">
                {messageIndex === 1 && (
                  <h1 className="text-5xl md:text-8xl font-bold text-white leading-tight animate-fade-in-out drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] max-w-4xl px-4">
                    Chúc tất cả mọi người thành công trong cuộc sống
                  </h1>
                )}
                {messageIndex === 2 && (
                  <h1 className="text-6xl md:text-[10rem] font-black text-yellow-400 animate-fade-in-out drop-shadow-[0_0_50px_rgba(255,215,0,0.7)] tracking-tighter">
                    Chúc mừng năm mới 2026
                  </h1>
                )}
                {messageIndex === 3 && (
                  <h1 className="text-8xl md:text-[15rem] dancing-script text-transparent bg-clip-text bg-gradient-to-t from-yellow-700 via-yellow-200 to-yellow-500 animate-scale-up drop-shadow-[0_0_60px_rgba(255,215,0,0.6)]">
                    Happy New Year
                  </h1>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Hiệu ứng ánh sáng nền sang trọng */}
      <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-red-900/10 rounded-full blur-[150px] animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-yellow-900/10 rounded-full blur-[150px] animate-blob animation-delay-2000"></div>
      </div>

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: scale(0.8) translateY(50px); filter: blur(20px); }
          10% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
          90% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
          100% { opacity: 0; transform: scale(1.1) translateY(-50px); filter: blur(20px); }
        }
        .animate-fade-in-out {
          animation: fadeInOut 5s forwards cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes scaleUp {
          0% { opacity: 0; transform: scale(0.2) rotate(-10deg); filter: blur(30px); }
          100% { opacity: 1; transform: scale(1) rotate(0); filter: blur(0); }
        }
        .animate-scale-up {
          animation: scaleUp 3s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(100px, -100px) scale(1.4); }
          66% { transform: translate(-60px, 60px) scale(0.6); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 20s infinite alternate ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 5s;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 2.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
