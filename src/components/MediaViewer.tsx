import React, { useState } from 'react';
import { X, Download, Share, RotateCcw, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface MediaViewerProps {
  mediaUrl: string;
  onClose: () => void;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({
  mediaUrl,
  onClose
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.25));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = mediaUrl;
    link.download = 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Shared Image',
          url: mediaUrl
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(mediaUrl);
    }
  };

  return (
    <div className="media-viewer-overlay" onClick={onClose}>
      <div className="media-viewer" onClick={(e) => e.stopPropagation()}>
        <div className="media-viewer-header">
          <div className="media-info">
            <span>Image Viewer</span>
          </div>
          <div className="media-controls">
            <button className="control-btn" onClick={handleZoomOut}>
              <ZoomOut size={20} />
            </button>
            <span className="zoom-level">{Math.round(zoom * 100)}%</span>
            <button className="control-btn" onClick={handleZoomIn}>
              <ZoomIn size={20} />
            </button>
            <button className="control-btn" onClick={handleRotate}>
              <RotateCcw size={20} />
            </button>
            <button className="control-btn" onClick={handleDownload}>
              <Download size={20} />
            </button>
            <button className="control-btn" onClick={handleShare}>
              <Share size={20} />
            </button>
            <button className="control-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="media-content">
          <img
            src={mediaUrl}
            alt="Media content"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease'
            }}
            className="media-image"
          />
        </div>

        <div className="media-viewer-footer">
          <div className="media-actions">
            <button className="action-btn">
              <Maximize size={16} />
              Fullscreen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};