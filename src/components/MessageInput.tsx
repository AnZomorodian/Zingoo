import React, { useState, useRef } from 'react';
import { Send, Paperclip, Smile, Mic, Image, File } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string, type?: 'text' | 'image' | 'file') => void;
  onTyping: (isTyping: boolean) => void;
  onShowEmojiPicker: () => void;
  showEmojiPicker: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTyping,
  onShowEmojiPicker,
  showEmojiPicker
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      onTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
    onTyping(value.length > 0);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload the file and get a URL
      const fileUrl = URL.createObjectURL(file);
      onSendMessage(fileUrl, type);
      setShowAttachments(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording
      onTyping(true);
    } else {
      // Stop recording and send
      onSendMessage('🎤 Voice message', 'text');
      onTyping(false);
    }
  };

  return (
    <div className="message-input-container">
      <div className="input-wrapper">
        <div className="input-actions-left">
          <button
            className={`action-btn ${showAttachments ? 'active' : ''}`}
            onClick={() => setShowAttachments(!showAttachments)}
          >
            <Paperclip size={20} />
          </button>
          
          {showAttachments && (
            <div className="attachments-menu">
              <button
                className="attachment-option"
                onClick={() => imageInputRef.current?.click()}
              >
                <Image size={20} />
                <span>Photo</span>
              </button>
              <button
                className="attachment-option"
                onClick={() => fileInputRef.current?.click()}
              >
                <File size={20} />
                <span>File</span>
              </button>
            </div>
          )}
        </div>

        <div className="input-field">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="message-input"
          />
          
          <button
            className={`action-btn ${showEmojiPicker ? 'active' : ''}`}
            onClick={onShowEmojiPicker}
          >
            <Smile size={20} />
          </button>
        </div>

        <div className="input-actions-right">
          {message.trim() ? (
            <button className="send-btn" onClick={handleSend}>
              <Send size={20} />
            </button>
          ) : (
            <button
              className={`voice-btn ${isRecording ? 'recording' : ''}`}
              onClick={toggleRecording}
            >
              <Mic size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="*/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e, 'file')}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e, 'image')}
      />
    </div>
  );
};