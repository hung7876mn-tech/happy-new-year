
import React, { useEffect, useRef } from 'react';
import { AppStatus } from '../types';

interface MusicPlayerProps {
  status: AppStatus;
  isStarted: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ status, isStarted }) => {
  const player1Ref = useRef<any>(null);
  const player2Ref = useRef<any>(null);
  const playersReady = useRef({ p1: false, p2: false });

  // YouTube IDs từ link bạn cung cấp
  const MUSIC_ID_1 = 'CVpBJpnc9eE'; // Nhạc lúc đếm ngược
  const MUSIC_ID_2 = 'i3LYCGQLHsM'; // Nhạc lúc pháo hoa/chúc mừng

  useEffect(() => {
    const initPlayers = () => {
      // Player 1
      player1Ref.current = new (window as any).YT.Player('player1', {
        height: '0',
        width: '0',
        videoId: MUSIC_ID_1,
        playerVars: { 
          autoplay: 0, 
          controls: 0, 
          loop: 1, 
          playlist: MUSIC_ID_1,
          enablejsapi: 1,
          origin: window.location.origin 
        },
        events: {
          onReady: () => {
            playersReady.current.p1 = true;
            if (isStarted && (status === AppStatus.COUNTDOWN || status === AppStatus.IDLE)) {
              player1Ref.current.playVideo();
            }
          }
        }
      });

      // Player 2
      player2Ref.current = new (window as any).YT.Player('player2', {
        height: '0',
        width: '0',
        videoId: MUSIC_ID_2,
        playerVars: { 
          autoplay: 0, 
          controls: 0, 
          loop: 1, 
          playlist: MUSIC_ID_2,
          enablejsapi: 1,
          origin: window.location.origin 
        },
        events: {
          onReady: () => {
            playersReady.current.p2 = true;
            if (isStarted && status === AppStatus.CELEBRATION) {
              player2Ref.current.playVideo();
            }
          }
        }
      });
    };

    if ((window as any).YT && (window as any).YT.Player) {
      initPlayers();
    } else {
      (window as any).onYouTubeIframeAPIReady = initPlayers;
    }

    return () => {
      if (player1Ref.current?.destroy) player1Ref.current.destroy();
      if (player2Ref.current?.destroy) player2Ref.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (!isStarted) return;

    // Quản lý Nhạc 1
    if (status === AppStatus.COUNTDOWN || status === AppStatus.IDLE) {
      if (playersReady.current.p1) {
        player1Ref.current.playVideo();
      }
    } else {
      if (player1Ref.current?.stopVideo) {
        player1Ref.current.stopVideo();
      }
    }

    // Quản lý Nhạc 2
    if (status === AppStatus.CELEBRATION) {
      if (playersReady.current.p2) {
        player2Ref.current.playVideo();
      }
    } else {
      if (player2Ref.current?.stopVideo) {
        player2Ref.current.stopVideo();
      }
    }
  }, [status, isStarted]);

  return (
    <div className="fixed opacity-0 pointer-events-none">
      <div id="player1"></div>
      <div id="player2"></div>
    </div>
  );
};

export default MusicPlayer;
