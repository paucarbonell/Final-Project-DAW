import React from 'react';
import './Window.css';

const Window = ({ 
  title, 
  children, 
  width = 'auto', 
  height = 'auto',
  onClose,
  isActive = true,
  isResizable = true,
  className = ''
}) => {
  return (
    <div className={`windows-window ${isActive ? 'active' : 'inactive'} ${className}`} style={{ width, height }}>
      <div className="windows-window-header">
        <div className="windows-window-title">{title}</div>
        <div className="windows-window-controls">
          <button className="windows-window-minimize">-</button>
          <button className="windows-window-maximize">□</button>
          <button className="windows-window-close" onClick={onClose}>×</button>
        </div>
      </div>
      <div className="windows-window-content">
        {children}
      </div>
    </div>
  );
};

export default Window; 