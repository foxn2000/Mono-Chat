import React, { useState, useEffect, useRef } from 'react';
import { useApi } from '../contexts/ApiContext';

export const ModelSelector: React.FC = () => {
  const { modelId, availableModels, changeModel } = useApi();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  
  // 外部クリックでドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div 
      className="model-selector-container"
      ref={selectorRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        if (!isOpen) {
          setTimeout(() => {
            if (!isHovering && !isOpen) {
              setIsOpen(false);
            }
          }, 300);
        }
      }}
    >
      <button 
        className="model-selector-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="モデルを選択"
      >
        {modelId || 'モデルを選択'}
      </button>
      
      <div className={`model-dropdown ${isOpen ? 'visible' : ''}`}>
        {availableModels.map(model => (
          <div 
            key={model}
            className={`model-option ${model === modelId ? 'active' : ''}`}
            onClick={() => {
              changeModel(model);
              setIsOpen(false);
            }}
          >
            {model}
          </div>
        ))}
      </div>
    </div>
  );
};
