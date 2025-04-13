import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import type { Message } from '../types/chat';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(err => {
      console.error('コピーに失敗しました:', err);
    });
  };

  const components: Partial<Components> = {
    code(props) {
      const {children, className, node, ...rest} = props;
      const isInline = !className;
      
      if (isInline) {
        return (
          <code
            {...rest}
            onClick={(e) => {
              e.stopPropagation();
              handleCopy(String(children));
            }}
          >
            {children}
          </code>
        );
      }

      return (
        <pre>
          <code
            {...rest}
            onClick={(e) => {
              e.stopPropagation();
              handleCopy(String(children));
            }}
          >
            {children}
          </code>
        </pre>
      );
    }
  };

  return (
    <div className={`flex mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`message-wrapper ${isUser ? 'user-message' : 'ai-message'}`}
        onClick={() => handleCopy(message.content)}
      >
        <span className="message-text">
          <ReactMarkdown components={components}>
            {message.content}
          </ReactMarkdown>
        </span>
        <div className="message-background"></div>
      </div>
    </div>
  );
};
