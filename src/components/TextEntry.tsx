import React, { useState } from 'react';

interface TextEntryProps {
  onTextSubmit: (text: string) => void;
  isLoading: boolean;
  placeholder?: string;
  buttonText?: string;
}

export default function TextEntry({ 
  onTextSubmit, 
  isLoading, 
  placeholder = "Enter text to analyze or humanize...",
  buttonText = "Submit"
}: TextEntryProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length > 0) {
      onTextSubmit(text);
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            rows={6}
            className="text-input"
            disabled={isLoading}
          />
        </div>
        <div className="button-group">
          <button 
            type="submit" 
            disabled={isLoading || text.trim().length === 0}
            className="primary-button"
          >
            {isLoading ? "Processing..." : buttonText}
          </button>
          <button
            type="button"
            onClick={() => setText('')}
            disabled={isLoading || text.trim().length === 0}
            className="secondary-button"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
