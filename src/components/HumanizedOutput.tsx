
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface HumanizedOutputProps {
  text: string;
  isLoading: boolean;
}

const HumanizedOutput: React.FC<HumanizedOutputProps> = ({ text, isLoading }) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    if (!text) return;
    
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        toast.error("Failed to copy");
      });
  };
  
  if (isLoading) {
    return (
      <div className="glass-card p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="glass-card p-6 h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Humanized Version</h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-2"
          onClick={copyToClipboard}
          disabled={!text}
        >
          {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      
      <ScrollArea className="flex-1 pr-4">
        {text ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
        ) : (
          <div className="text-sm text-muted-foreground italic">
            Humanized text will appear here after analysis
          </div>
        )}
      </ScrollArea>
    </motion.div>
  );
};

export default HumanizedOutput;
