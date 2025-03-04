
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, FileText, AlertTriangle, UploadCloud, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import AIDetectionResult from "./AIDetectionResult";
import HumanizedOutput from "./HumanizedOutput";
import { detectAIContent, humanizeText, AIDetectionResult as AIResult } from "@/services/ai-service";

const TextAnalyzer = () => {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<AIResult | null>(null);
  const [humanizedText, setHumanizedText] = useState("");
  const [activeTab, setActiveTab] = useState("detect");

  const handleAnalyze = async () => {
    if (!text || text.trim().length < 50) {
      toast.error("Please enter at least 50 characters for accurate analysis");
      return;
    }

    setIsAnalyzing(true);
    setDetectionResult(null);
    
    try {
      const result = await detectAIContent(text);
      setDetectionResult(result);
    } catch (error) {
      console.error("Error during analysis:", error);
      toast.error("An error occurred during analysis. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleHumanize = async () => {
    if (!text || text.trim().length < 50) {
      toast.error("Please enter at least 50 characters for humanization");
      return;
    }

    setIsHumanizing(true);
    setHumanizedText("");
    
    try {
      const result = await humanizeText(text);
      setHumanizedText(result);
      setActiveTab("humanize");
    } catch (error) {
      console.error("Error during humanization:", error);
      toast.error("An error occurred during humanization. Please try again.");
    } finally {
      setIsHumanizing(false);
    }
  };

  const handleReset = () => {
    setText("");
    setDetectionResult(null);
    setHumanizedText("");
    setActiveTab("detect");
    toast.success("Text and results have been reset");
  };

  const uploadFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt,.doc,.docx,.pdf";
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      // Only handle .txt files for simplicity
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setText(content);
        };
        reader.readAsText(file);
      } else {
        toast.error("Only plain text (.txt) files are supported");
      }
    };
    
    input.click();
  };

  return (
    <div className="flex flex-col h-full">
      <motion.div 
        className="glass-card p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium">AI Text Analyzer & Humanizer</h2>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
        
        <div className="text-area-container mb-4">
          <ScrollArea className="h-[200px] rounded-xl overflow-hidden">
            <Textarea
              placeholder="Enter or paste text to analyze (minimum 50 characters)..."
              className="min-h-[200px] resize-none border rounded-xl p-4 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </ScrollArea>
        </div>
        
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div className="flex gap-3">
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || text.trim().length < 50}
              className="bg-primary hover:bg-primary/90"
            >
              <FileText className="h-4 w-4 mr-2" />
              {isAnalyzing ? "Analyzing..." : "Detect AI Content"}
            </Button>
            
            <Button 
              onClick={handleHumanize} 
              disabled={isHumanizing || text.trim().length < 50}
              variant="outline"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              {isHumanizing ? "Humanizing..." : "Humanize Text"}
            </Button>
          </div>
          
          <Button variant="ghost" onClick={uploadFile}>
            <UploadCloud className="h-4 w-4 mr-2" />
            Upload Text
          </Button>
        </div>
        
        {text.trim().length > 0 && text.trim().length < 50 && (
          <motion.div 
            className="flex items-center mt-4 text-amber-600 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Enter at least 50 characters for accurate analysis
          </motion.div>
        )}
      </motion.div>
      
      <Tabs 
        defaultValue="detect" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="flex-1"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="detect">Detection Results</TabsTrigger>
          <TabsTrigger value="humanize">Humanized Version</TabsTrigger>
        </TabsList>
        
        <div className="h-[calc(100%-50px)]">
          <TabsContent value="detect" className="mt-0 h-full">
            <AIDetectionResult result={detectionResult} isLoading={isAnalyzing} />
          </TabsContent>
          
          <TabsContent value="humanize" className="mt-0 h-full">
            <HumanizedOutput text={humanizedText} isLoading={isHumanizing} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default TextAnalyzer;
