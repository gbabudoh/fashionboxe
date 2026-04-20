'use client';

import React, { useEffect, useState } from 'react';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { X, Loader2 } from 'lucide-react';

interface LiveKitMeetingProps {
  roomName: string;
  participantName: string;
  onClose?: () => void;
}

export default function LiveKitMeeting({ 
  roomName, 
  participantName, 
  onClose 
}: LiveKitMeetingProps) {
  const [token, setToken] = useState<string>('');
  const [serverUrl, setServerUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch('/api/livekit/token', {
          method: 'POST',
          body: JSON.stringify({ roomName, participantName }),
        });
        const data = await resp.json();
        if (data.error) throw new Error(data.error);
        setToken(data.token);
        setServerUrl(data.serverUrl);
      } catch (e) {
        console.error(e);
        setError('Failed to initialize secure session');
      }
    })();
  }, [roomName, participantName]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-zinc-900 text-white p-6 text-center">
        <p className="text-red-400 font-bold mb-4">{error}</p>
        <button 
          onClick={onClose}
          className="px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-all text-xs font-black uppercase tracking-widest"
        >
          Close Session
        </button>
      </div>
    );
  }

  if (token === '') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-zinc-900 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-accent mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Initializing LiveKit Node...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden group/lk">
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={serverUrl}
        onDisconnected={onClose}
        data-lk-theme="default"
        className="h-full"
      >
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60 pointer-events-none z-10" />
        
        {/* Video Components */}
        <VideoConference />
        
        {/* Custom Overlay Controls */}
        <div className="absolute top-4 right-4 z-[100] opacity-0 group-hover/lk:opacity-100 transition-opacity">
           <button 
             onClick={onClose}
             className="h-10 w-10 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors shadow-2xl"
           >
              <X size={18} />
           </button>
        </div>

        <RoomAudioRenderer />
      </LiveKitRoom>

      <style jsx global>{`
        .lk-video-conference {
          background: transparent !important;
          border: none !important;
        }
        .lk-control-bar {
          background: rgba(0, 0, 0, 0.6) !important;
          backdrop-filter: blur(20px) !important;
          border-top: 1px solid rgba(255, 255, 255, 0.05) !important;
          padding: 1.5rem !important;
          border-radius: 2rem 2rem 0 0 !important;
        }
        .lk-button {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          padding: 12px 20px !important;
          border-radius: 1rem !important;
          font-weight: 900 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          font-size: 9px !important;
          transition: all 0.3s ease !important;
        }
        .lk-button:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          transform: translateY(-2px) !important;
        }
        .lk-button-primary {
          background: #d4af37 !important;
          color: black !important;
          border: none !important;
        }
        .lk-participant-name {
          font-family: serif !important;
          font-style: italic !important;
          font-weight: 900 !important;
          letter-spacing: -0.02em !important;
        }
      `}</style>
    </div>
  );
}
