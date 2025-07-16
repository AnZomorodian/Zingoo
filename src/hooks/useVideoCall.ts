import { useState, useCallback, useRef, useEffect } from 'react';
import { CallSession } from '../types';

export const useVideoCall = () => {
  const [isInCall, setIsInCall] = useState(false);
  const [currentCall, setCurrentCall] = useState<CallSession | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [callQuality, setCallQuality] = useState<'poor' | 'fair' | 'good' | 'excellent'>('good');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  const callTimer = useRef<NodeJS.Timeout | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const screenStream = useRef<MediaStream | null>(null);

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

  const startVideoCall = useCallback(async (chatId: string) => {
    try {
      // Request camera and microphone permission
      mediaStream.current = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream.current;
      }

      const call: CallSession = {
        id: Date.now().toString(),
        chatId,
        type: 'video',
        participants: ['current-user', chatId],
        status: 'ringing',
        startTime: new Date(),
        quality: 'good'
      };

      setCurrentCall(call);
      setIsInCall(true);
      setCallDuration(0);
      setIsVideoOn(true);
      
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
      console.error('Failed to start video call:', error);
      throw new Error('Camera/microphone access denied or not available');
    }
  }, [currentCall]);

  const endVideoCall = useCallback(() => {
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
      mediaStream.current = null;
    }

    if (screenStream.current) {
      screenStream.current.getTracks().forEach(track => track.stop());
      screenStream.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
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
    setIsVideoOn(true);
    setIsScreenSharing(false);
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

  const toggleVideo = useCallback(() => {
    if (mediaStream.current) {
      const videoTrack = mediaStream.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  }, [isVideoOn]);

  const toggleScreenShare = useCallback(async () => {
    try {
      if (isScreenSharing) {
        // Stop screen sharing
        if (screenStream.current) {
          screenStream.current.getTracks().forEach(track => track.stop());
          screenStream.current = null;
        }
        
        // Resume camera
        if (mediaStream.current && localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream.current;
        }
        
        setIsScreenSharing(false);
      } else {
        // Start screen sharing
        screenStream.current = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream.current;
        }
        
        setIsScreenSharing(true);
        
        // Handle screen share end
        screenStream.current.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          if (mediaStream.current && localVideoRef.current) {
            localVideoRef.current.srcObject = mediaStream.current;
          }
        };
      }
    } catch (error) {
      console.error('Screen sharing failed:', error);
    }
  }, [isScreenSharing]);

  const switchCamera = useCallback(async () => {
    try {
      if (mediaStream.current) {
        const videoTrack = mediaStream.current.getVideoTracks()[0];
        const constraints = videoTrack.getConstraints();
        
        // Toggle between front and back camera
        const newConstraints = {
          ...constraints,
          facingMode: constraints.facingMode === 'user' ? 'environment' : 'user'
        };
        
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: newConstraints,
          audio: true
        });
        
        // Replace video track
        videoTrack.stop();
        mediaStream.current.removeTrack(videoTrack);
        mediaStream.current.addTrack(newStream.getVideoTracks()[0]);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream.current;
        }
      }
    } catch (error) {
      console.error('Camera switch failed:', error);
    }
  }, []);

  const getCallStats = useCallback(() => {
    return {
      duration: callDuration,
      quality: callQuality,
      isMuted,
      isVideoOn,
      isScreenSharing,
      status: currentCall?.status || 'ended'
    };
  }, [callDuration, callQuality, isMuted, isVideoOn, isScreenSharing, currentCall]);

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
    isVideoOn,
    isScreenSharing,
    callDuration,
    callQuality,
    localVideoRef,
    remoteVideoRef,
    startVideoCall,
    endVideoCall,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    switchCamera,
    getCallStats,
    formatCallDuration: () => formatCallDuration(callDuration)
  };
};