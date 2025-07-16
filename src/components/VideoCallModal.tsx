import React, { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Monitor, RotateCcw, MoreVertical, Maximize, Minimize } from 'lucide-react';

interface VideoCallModalProps {
  chatName: string;
  onEndCall: () => void;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  chatName,
  onEndCall
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'connecting' | 'ringing' | 'connected'>('connecting');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Simulate call connection
    const timer1 = setTimeout(() => setCallStatus('ringing'), 1000);
    const timer2 = setTimeout(() => setCallStatus('connected'), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getStatusText = () => {
    switch (callStatus) {
      case 'connecting':
        return 'Connecting...';
      case 'ringing':
        return 'Ringing...';
      case 'connected':
        return formatDuration(callDuration);
      default:
        return '';
    }
  };

  return (
    <div className={`call-modal-overlay ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="video-call-modal">
        <div className="call-header">
          <div className="call-info">
            <span className="caller-name">{chatName}</span>
            <div className="call-status">
              <div className={`status-indicator ${callStatus}`}></div>
              <span>{getStatusText()}</span>
            </div>
          </div>
          <div className="header-controls">
            <button className="control-btn" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>

        <div className="video-container">
          {/* Remote video */}
          <div className="remote-video">
            <video
              ref={remoteVideoRef}
              className="video-element"
              autoPlay
              playsInline
            />
            {!isVideoOn && (
              <div className="video-placeholder">
                <div className="avatar-placeholder">
                  {chatName.charAt(0).toUpperCase()}
                </div>
                <p>Camera is off</p>
              </div>
            )}
            <div className="video-overlay">
              <div className="participant-name">{chatName}</div>
            </div>
          </div>

          {/* Local video */}
          <div className="local-video">
            <video
              ref={localVideoRef}
              className="video-element"
              autoPlay
              playsInline
              muted
            />
            {!isVideoOn && (
              <div className="video-placeholder small">
                <div className="avatar-placeholder small">
                  You
                </div>
              </div>
            )}
            <div className="video-controls-mini">
              {isMuted && <MicOff size={12} />}
              {!isVideoOn && <VideoOff size={12} />}
            </div>
          </div>
        </div>

        <div className="call-controls">
          <button
            className={`control-btn ${isMuted ? 'active danger' : ''}`}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>

          <button
            className={`control-btn ${!isVideoOn ? 'active danger' : ''}`}
            onClick={() => setIsVideoOn(!isVideoOn)}
          >
            {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
          </button>

          <button
            className={`control-btn ${isScreenSharing ? 'active' : ''}`}
            onClick={() => setIsScreenSharing(!isScreenSharing)}
          >
            <Monitor size={24} />
          </button>

          <button className="control-btn">
            <RotateCcw size={24} />
          </button>

          <button className="control-btn">
            <MoreVertical size={24} />
          </button>

          <button className="end-call-btn" onClick={onEndCall}>
            <PhoneOff size={24} />
          </button>
        </div>

        <div className="call-stats">
          <div className="connection-quality">
            <div className="quality-indicator good"></div>
            <span>HD Quality</span>
          </div>
          {isScreenSharing && (
            <div className="screen-share-indicator">
              <Monitor size={16} />
              <span>Screen sharing</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};