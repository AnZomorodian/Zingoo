import { useState, useCallback, useRef, useEffect } from 'react';
import { CallSession } from '../types';

export const useVoiceCall = () => {
  const [isInCall, setIsInCall] = useState(false);
  const [currentCall, setCurrentCall] = useState<CallSession | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callQuality, setCallQuality] = useState<'poor' | 'fair' | 'good' | 'excellent'>('good');
  
  const callTimer = useRef<NodeJS.Timeout | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isInCall && currentCall) {
      callTimer.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimer.current) {
        clearInterval(callTimer.current);
        callTimer.current = null;
      }
      setCallDuration(0);
    }

    return () => {
      if (callTimer.current) {
        clearInterval(callTimer.current);
      }
    };
  }, [isInCall, currentCall]);

  const startCall = useCallback(async (chatId: string) => {
    try {
      // Request microphone permission
      mediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const call: CallSession = {
        id: Date.now().toString(),
        chatId,
        type: 'voice',
        participants: ['current-user', chatId],
        status: 'ringing',
        startTime: new Date(),
        quality: 'good'
      };

      setCurrentCall(call);
      setIsInCall(true);
      setCallDuration(0);
      
      // Simulate call connection after 2-5 seconds
      setTimeout(() => {
        if (currentCall?.status === 'ringing') {
          setCurrentCall(prev => prev ? { ...prev, status: 'active' } : null);
        }
      }, Math.random() * 3000 + 2000);

      // Simulate call quality changes
      const qualityInterval = setInterval(() => {
        const qualities: Array<'poor' | 'fair' | 'good' | 'excellent'> = ['poor', 'fair', 'good', 'excellent'];
        setCallQuality(qualities[Math.floor(Math.random() * qualities.length)]);
      }, 10000);

      return () => clearInterval(qualityInterval);
    } catch (error) {
      console.error('Failed to start voice call:', error);
      throw new Error('Microphone access denied or not available');
    }
  }, [currentCall]);

  const endCall = useCallback(() => {
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
      mediaStream.current = null;
    }

    if (audioContext.current) {
      audioContext.current.close();
      audioContext.current = null;
    }

    if (currentCall) {
      setCurrentCall(prev => prev ? {
        ...prev,
        status: 'ended',
        endTime: new Date(),
        duration: callDuration
      } : null);
    }

    setIsInCall(false);
    setIsMuted(false);
    setIsSpeakerOn(false);
    setCallDuration(0);
  }, [currentCall, callDuration]);

  const toggleMute = useCallback(() => {
    if (mediaStream.current) {
      const audioTrack = mediaStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
      }
    }
  }, [isMuted]);

  const toggleSpeaker = useCallback(() => {
    setIsSpeakerOn(!isSpeakerOn);
    // In a real app, this would change audio output device
  }, [isSpeakerOn]);

  const adjustVolume = useCallback((volume: number) => {
    if (audioContext.current) {
      // Adjust audio volume (0-1)
      const gainNode = audioContext.current.createGain();
      gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }, []);

  const getCallStats = useCallback(() => {
    return {
      duration: callDuration,
      quality: callQuality,
      isMuted,
      isSpeakerOn,
      status: currentCall?.status || 'ended'
    };
  }, [callDuration, callQuality, isMuted, isSpeakerOn, currentCall]);

  const formatCallDuration = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    isInCall,
    currentCall,
    isMuted,
    isSpeakerOn,
    callDuration,
    callQuality,
    startCall,
    endCall,
    toggleMute,
    toggleSpeaker,
    adjustVolume,
    getCallStats,
    formatCallDuration: () => formatCallDuration(callDuration)
  };
};