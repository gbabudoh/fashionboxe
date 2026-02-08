'use client';

import React, { useEffect, useRef } from 'react';

interface JitsiMeetingProps {
  domain?: string;
  roomName: string;
  displayName: string;
  onClose?: () => void;
}

const JitsiMeeting = ({ 
  domain = 'meet.jit.si', 
  roomName, 
  displayName,
  onClose 
}: JitsiMeetingProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Jitsi script
    const script = document.createElement('script');
    script.src = `https://${domain}/external_api.js`;
    script.async = true;
    script.onload = () => {
      if (window.JitsiMeetExternalAPI && containerRef.current) {
        const api = new window.JitsiMeetExternalAPI(domain, {
          roomName: roomName,
          parentNode: containerRef.current,
          userInfo: {
            displayName: displayName
          },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            prejoinPageEnabled: false,
            disableModeratorIndicator: true,
            enableEmailInStats: false,
            disableChat: true, // Keep focus on the video/garment
            toolbarButtons: ['microphone', 'camera', 'hangup', 'videoquality'], 
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            DEFAULT_REMOTE_DISPLAY_NAME: 'Fashionboxe Concierge',
          }
        });

        api.addEventListener('videoConferenceLeft', () => {
          onClose?.();
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [domain, roomName, displayName, onClose]);

  return <div ref={containerRef} className="w-full h-full min-h-[500px] rounded-2xl overflow-hidden shadow-2xl" />;
};

export default JitsiMeeting;

interface JitsiOptions {
  roomName: string;
  parentNode: HTMLElement;
  userInfo?: {
    displayName?: string;
    email?: string;
  };
  configOverwrite?: Record<string, unknown>;
  interfaceConfigOverwrite?: Record<string, unknown>;
}

interface JitsiMeetExternalAPIConstructor {
  new (domain: string, options: JitsiOptions): JitsiMeetExternalAPI;
}

interface JitsiMeetExternalAPI {
  addEventListener(event: string, callback: () => void): void;
  dispose(): void;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: JitsiMeetExternalAPIConstructor;
  }
}
