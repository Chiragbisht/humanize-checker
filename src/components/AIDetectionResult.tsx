
import type { AIDetectionResult as AIDetectionResultType } from "@/services/ai-service";
import { motion } from "framer-motion";
import { CheckCircle, FileQuestion, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIDetectionResultProps {
  result: AIDetectionResultType | null;
  isLoading: boolean;
}

const ProgressRing = ({ 
  percentage, 
  size = 120, 
  strokeWidth = 8,
  className = "",
  animate = true
}: { 
  percentage: number; 
  size?: number; 
  strokeWidth?: number;
  className?: string;
  animate?: boolean;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <svg className={cn("progress-ring", className)} width={size} height={size}>
      <circle
        className="progress-track"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <motion.circle
        className={cn("progress-indicator", className)}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        initial={{ strokeDashoffset: circumference }}
        animate={animate ? { strokeDashoffset: offset } : undefined}
        transition={{ duration: 1, ease: "easeOut" }}
        strokeDasharray={`${circumference} ${circumference}`}
      />
    </svg>
  );
};

const AIDetectionResult: React.FC<AIDetectionResultProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="glass-card p-6 h-full flex flex-col items-center justify-center animate-pulse">
        <div className="w-24 h-24 rounded-full bg-muted mb-4"></div>
        <div className="h-6 bg-muted rounded w-32 mb-2"></div>
        <div className="h-4 bg-muted rounded w-24"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="glass-card p-6 h-full flex flex-col items-center justify-center text-muted-foreground">
        <FileQuestion className="w-12 h-12 mb-4" />
        <h3 className="text-xl font-medium">No results yet</h3>
        <p className="text-sm">Enter text and analyze to see results</p>
      </div>
    );
  }

  const isAI = result.aiProbability > result.humanProbability;
  const confidence = Math.max(result.aiProbability, result.humanProbability);
  
  return (
    <motion.div 
      className="glass-card p-6 h-full flex flex-col items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative mb-4">
        <ProgressRing 
          percentage={Math.round(confidence)}
          className={isAI ? "ai-indicator" : "human-indicator"}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          {isAI ? (
            <AlertCircle className="h-8 w-8 text-orange-500" />
          ) : (
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          )}
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-1">
        {isAI ? "AI-Generated" : "Human-Written"}
      </h3>
      
      <p className="text-sm text-muted-foreground mb-4">
        {confidence.toFixed(1)}% confidence
      </p>
      
      <div className="w-full space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>AI</span>
            <span>{result.aiProbability.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${result.aiProbability}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Human</span>
            <span>{result.humanProbability.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${result.humanProbability}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIDetectionResult;
