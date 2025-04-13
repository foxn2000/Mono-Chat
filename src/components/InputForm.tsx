import React, { useState, FormEvent, KeyboardEvent, useEffect, useRef } from 'react';

interface InputFormProps {
  onSubmit: (content: string) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const computedStyle = getComputedStyle(textarea);
    const lineHeight = parseFloat(computedStyle.lineHeight);
    const effectiveLineHeight = isNaN(lineHeight)
      ? parseFloat(computedStyle.fontSize) * 1.2
      : lineHeight;
    const padding = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
    const maxLines = 2;
    const maxHeight = effectiveLineHeight * maxLines + padding;
    const contentHeight = textarea.scrollHeight;
    const newHeight = Math.min(contentHeight, maxHeight);
    
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = (contentHeight > maxHeight) ? 'auto' : 'hidden';
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput && !isLoading) {
      onSubmit(trimmedInput);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      if (e.shiftKey) return; // Shift+Enterは改行
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ctrl+Enter"
          disabled={isLoading}
          rows={1}
          aria-label="メッセージ入力"
        />
        <div className="input-background"></div>
      </div>
    </form>
  );
};
