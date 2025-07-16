import React, { useState } from 'react';
import { X, Palette, Sun, Moon, Monitor, Download, Upload, RotateCcw } from 'lucide-react';

interface ThemeCustomizerProps {
  currentTheme: any;
  onUpdateTheme: (theme: any) => void;
  onClose: () => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  currentTheme,
  onUpdateTheme,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('colors');
  const [customTheme, setCustomTheme] = useState(currentTheme || {
    primaryColor: '#2196f3',
    accentColor: '#4caf50',
    backgroundColor: '#ffffff',
    surfaceColor: '#f8f9fa',
    textColor: '#212529',
    borderColor: '#dee2e6'
  });

  const colorPresets = [
    {
      name: 'Ocean Blue',
      colors: {
        primaryColor: '#2196f3',
        accentColor: '#03dac6',
        backgroundColor: '#ffffff',
        surfaceColor: '#f8f9fa'
      }
    },
    {
      name: 'Forest Green',
      colors: {
        primaryColor: '#4caf50',
        accentColor: '#8bc34a',
        backgroundColor: '#ffffff',
        surfaceColor: '#f1f8e9'
      }
    },
    {
      name: 'Sunset Orange',
      colors: {
        primaryColor: '#ff9800',
        accentColor: '#ff5722',
        backgroundColor: '#ffffff',
        surfaceColor: '#fff3e0'
      }
    },
    {
      name: 'Purple Dream',
      colors: {
        primaryColor: '#9c27b0',
        accentColor: '#e91e63',
        backgroundColor: '#ffffff',
        surfaceColor: '#f3e5f5'
      }
    },
    {
      name: 'Dark Mode',
      colors: {
        primaryColor: '#2196f3',
        accentColor: '#4caf50',
        backgroundColor: '#0d1117',
        surfaceColor: '#161b22'
      }
    },
    {
      name: 'Midnight',
      colors: {
        primaryColor: '#6366f1',
        accentColor: '#8b5cf6',
        backgroundColor: '#111827',
        surfaceColor: '#1f2937'
      }
    }
  ];

  const handleColorChange = (property: string, value: string) => {
    setCustomTheme(prev => ({
      ...prev,
      [property]: value
    }));
  };

  const applyPreset = (preset: typeof colorPresets[0]) => {
    setCustomTheme(prev => ({
      ...prev,
      ...preset.colors
    }));
  };

  const handleSave = () => {
    onUpdateTheme(customTheme);
    onClose();
  };

  const handleReset = () => {
    setCustomTheme({
      primaryColor: '#2196f3',
      accentColor: '#4caf50',
      backgroundColor: '#ffffff',
      surfaceColor: '#f8f9fa',
      textColor: '#212529',
      borderColor: '#dee2e6'
    });
  };

  const exportTheme = () => {
    const themeData = JSON.stringify(customTheme, null, 2);
    const blob = new Blob([themeData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom-theme.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTheme = JSON.parse(e.target?.result as string);
          setCustomTheme(importedTheme);
        } catch (error) {
          alert('Invalid theme file');
        }
      };
      reader.readAsText(file);
    }
  };

  const tabs = [
    { id: 'colors', label: 'Colors', icon: <Palette size={16} /> },
    { id: 'presets', label: 'Presets', icon: <Sun size={16} /> },
    { id: 'advanced', label: 'Advanced', icon: <Monitor size={16} /> }
  ];

  return (
    <div className="modal-overlay">
      <div className="theme-customizer-modal">
        <div className="customizer-header">
          <h2>Theme Customizer</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="customizer-body">
          <div className="customizer-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`customizer-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="customizer-content">
            {activeTab === 'colors' && (
              <div className="colors-section">
                <h3>Color Customization</h3>
                
                <div className="color-controls">
                  <div className="color-control">
                    <label>Primary Color</label>
                    <div className="color-input-group">
                      <input
                        type="color"
                        value={customTheme.primaryColor}
                        onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                        className="color-picker"
                      />
                      <input
                        type="text"
                        value={customTheme.primaryColor}
                        onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                        className="color-text-input"
                      />
                    </div>
                  </div>
                  
                  <div className="color-control">
                    <label>Accent Color</label>
                    <div className="color-input-group">
                      <input
                        type="color"
                        value={customTheme.accentColor}
                        onChange={(e) => handleColorChange('accentColor', e.target.value)}
                        className="color-picker"
                      />
                      <input
                        type="text"
                        value={customTheme.accentColor}
                        onChange={(e) => handleColorChange('accentColor', e.target.value)}
                        className="color-text-input"
                      />
                    </div>
                  </div>
                  
                  <div className="color-control">
                    <label>Background Color</label>
                    <div className="color-input-group">
                      <input
                        type="color"
                        value={customTheme.backgroundColor}
                        onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                        className="color-picker"
                      />
                      <input
                        type="text"
                        value={customTheme.backgroundColor}
                        onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                        className="color-text-input"
                      />
                    </div>
                  </div>
                  
                  <div className="color-control">
                    <label>Surface Color</label>
                    <div className="color-input-group">
                      <input
                        type="color"
                        value={customTheme.surfaceColor}
                        onChange={(e) => handleColorChange('surfaceColor', e.target.value)}
                        className="color-picker"
                      />
                      <input
                        type="text"
                        value={customTheme.surfaceColor}
                        onChange={(e) => handleColorChange('surfaceColor', e.target.value)}
                        className="color-text-input"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="theme-preview">
                  <h4>Preview</h4>
                  <div 
                    className="preview-card"
                    style={{
                      backgroundColor: customTheme.backgroundColor,
                      border: `1px solid ${customTheme.borderColor || '#dee2e6'}`
                    }}
                  >
                    <div 
                      className="preview-header"
                      style={{ backgroundColor: customTheme.surfaceColor }}
                    >
                      <div 
                        className="preview-avatar"
                        style={{ backgroundColor: customTheme.primaryColor }}
                      ></div>
                      <div className="preview-text">
                        <div className="preview-name">John Doe</div>
                        <div className="preview-status">Online</div>
                      </div>
                    </div>
                    <div className="preview-message">
                      <div 
                        className="preview-bubble"
                        style={{ backgroundColor: customTheme.primaryColor }}
                      >
                        Hello! This is a preview message.
                      </div>
                    </div>
                    <div className="preview-input">
                      <button 
                        className="preview-button"
                        style={{ backgroundColor: customTheme.accentColor }}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'presets' && (
              <div className="presets-section">
                <h3>Theme Presets</h3>
                <div className="preset-grid">
                  {colorPresets.map((preset, index) => (
                    <div
                      key={index}
                      className="preset-card"
                      onClick={() => applyPreset(preset)}
                    >
                      <div className="preset-colors">
                        <div 
                          className="preset-color primary"
                          style={{ backgroundColor: preset.colors.primaryColor }}
                        ></div>
                        <div 
                          className="preset-color accent"
                          style={{ backgroundColor: preset.colors.accentColor }}
                        ></div>
                        <div 
                          className="preset-color background"
                          style={{ backgroundColor: preset.colors.backgroundColor }}
                        ></div>
                        <div 
                          className="preset-color surface"
                          style={{ backgroundColor: preset.colors.surfaceColor }}
                        ></div>
                      </div>
                      <div className="preset-name">{preset.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'advanced' && (
              <div className="advanced-section">
                <h3>Advanced Options</h3>
                
                <div className="advanced-controls">
                  <div className="control-group">
                    <label>Border Radius</label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={customTheme.borderRadius || 8}
                      onChange={(e) => handleColorChange('borderRadius', e.target.value)}
                      className="range-input"
                    />
                    <span>{customTheme.borderRadius || 8}px</span>
                  </div>
                  
                  <div className="control-group">
                    <label>Shadow Intensity</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={customTheme.shadowIntensity || 20}
                      onChange={(e) => handleColorChange('shadowIntensity', e.target.value)}
                      className="range-input"
                    />
                    <span>{customTheme.shadowIntensity || 20}%</span>
                  </div>
                  
                  <div className="control-group">
                    <label>Animation Speed</label>
                    <select
                      value={customTheme.animationSpeed || 'normal'}
                      onChange={(e) => handleColorChange('animationSpeed', e.target.value)}
                      className="select-input"
                    >
                      <option value="slow">Slow</option>
                      <option value="normal">Normal</option>
                      <option value="fast">Fast</option>
                      <option value="none">Disabled</option>
                    </select>
                  </div>
                </div>
                
                <div className="import-export">
                  <h4>Import/Export</h4>
                  <div className="import-export-buttons">
                    <button className="export-btn" onClick={exportTheme}>
                      <Download size={16} />
                      Export Theme
                    </button>
                    <label className="import-btn">
                      <Upload size={16} />
                      Import Theme
                      <input
                        type="file"
                        accept=".json"
                        onChange={importTheme}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="customizer-actions">
          <button className="reset-btn" onClick={handleReset}>
            <RotateCcw size={16} />
            Reset
          </button>
          <div className="action-buttons">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button className="save-btn" onClick={handleSave}>
              Apply Theme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};