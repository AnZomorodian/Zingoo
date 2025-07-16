import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, MoreVertical } from 'lucide-react';

interface VoiceCallModalProps {
  chatName: string;
  onEndCall: () => void;
}

export const VoiceCallModal: React.FC<VoiceCallModalProps> = ({
  chatName,
  onEndCall
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'connecting' | 'ringing' | 'connected'>('connecting');

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
    <div className="call-modal-overlay">
      <div className="voice-call-modal">
        <div className="call-header">
          <div className="call-status">
            <div className={`status-indicator ${callStatus}`}></div>
            <span>{getStatusText()}</span>
          </div>
        </div>

        <div className="call-content">
          <div className="caller-info">
            <div className="caller-avatar">
              <div className="avatar-placeholder">
                {chatName.charAt(0).toUpperCase()}
              </div>
              <div className="audio-waves">
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
              </div>
            </div>
            <h2 className="caller-name">{chatName}</h2>
            <p className="call-type">Voice Call</p>
          </div>

          <div className="call-controls">
            <button
              className={`control-btn ${isMuted ? 'active' : ''}`}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>

            <button
              className={`control-btn ${isSpeakerOn ? 'active' : ''}`}
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            >
              {isSpeakerOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </button>

            <button className="control-btn">
              <MoreVertical size={24} />
            </button>

            <button className="end-call-btn" onClick={onEndCall}>
              <PhoneOff size={24} />
            </button>
          </div>
        </div>

        <div className="call-info">
          <div className="connection-quality">
            <div className="quality-bars">
              <div className="bar active"></div>
              <div className="bar active"></div>
              <div className="bar active"></div>
              <div className="bar"></div>
            </div>
            <span>Good connection</span>
          </div>
        </div>
      </div>
    </div>
  );
};