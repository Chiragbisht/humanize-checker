import React from 'react';
import { AIDetectionResult } from '../services/ai-service';

interface ResultDisplayProps {
  result?: AIDetectionResult | null;
  humanizedText?: string | null;
  originalText?: string | null;
}

export default function ResultDisplay({ 
  result, 
  humanizedText,
  originalText
}: ResultDisplayProps) {
  if (!result && !humanizedText) return null;

  return (
    <div className="result-container card">
      {result && (
        <div className="detection-results">
          <h2>AI Detection Results</h2>
          <div className="probability-bars">
            <div className="probability-item">
              <label>AI Probability:</label>
              <div className="progress-bar">
                <div 
                  className="progress-fill ai-fill" 
                  style={{ width: `${result.aiProbability}%` }}
                ></div>
                <span className="progress-text">{Math.round(result.aiProbability)}%</span>
              </div>
            </div>
            
            <div className="probability-item">
              <label>Human Probability:</label>
              <div className="progress-bar">
                <div 
                  className="progress-fill human-fill" 
                  style={{ width: `${result.humanProbability}%` }}
                ></div>
                <span className="progress-text">{Math.round(result.humanProbability)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {humanizedText && (
        <div className="humanized-text mt-2">
          <h2>Humanized Version</h2>
          <div className="text-comparison">
            {originalText && (
              <div className="text-panel float-sm-none">
                <h3>Original</h3>
                <div className="text-content">{originalText}</div>
              </div>
            )}
            <div className="text-panel float-sm-none">
              <h3>Humanized</h3>
              <div className="text-content">{humanizedText}</div>
            </div>
          </div>
          <div className="actions mt-2">
            <button 
              onClick={() => navigator.clipboard.writeText(humanizedText)}
              className="secondary-button"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
