
import TextAnalyzer from "@/components/TextAnalyzer";
import { motion } from "framer-motion";
import { FileText, RotateCcw, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import appImg from "/lovable-uploads/29e9e257-42ec-4c98-98d4-cc0aa980e99f.png";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950">
      <header className="w-full py-6 px-8 flex justify-between items-center">
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FileText className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Humanize
          </h1>
        </motion.div>
        
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Button 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground"
            onClick={() => toast.info("Reset example text", { description: "Coming soon!" })}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground" 
            onClick={() => toast.info("Documentation", { description: "Coming soon!" })}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Guide
          </Button>
        </motion.div>
      </header>
      
      <main className="flex-1 px-8 pb-8">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TextAnalyzer />
          </motion.div>
          
          <motion.div 
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-medium mb-4">About Humanize</h2>
            
            <p className="text-sm text-muted-foreground mb-4">
              Humanize uses advanced AI to detect if text was written by a human or AI, and can transform AI-generated content into more natural, human-like writing.
            </p>
            
            <div className="rounded-xl overflow-hidden mb-4 bg-white/50 p-2">
              <img 
                src={appImg} 
                alt="AI Detection Example" 
                className="w-full h-auto rounded-lg object-cover"
                style={{ maxHeight: "200px" }}
              />
            </div>
            
            <h3 className="text-md font-medium mb-2">How it works</h3>
            
            <ul className="text-sm text-muted-foreground space-y-2 mb-4">
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                <span>Paste text or upload a document</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                <span>Analyze for AI detection with Groq's advanced AI model</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                <span>Transform AI text into natural human writing with Gemini</span>
              </li>
            </ul>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800 text-xs dark:bg-amber-950 dark:border-amber-900 dark:text-amber-200">
              <div className="flex items-start">
                <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                <p>
                  No AI detector is 100% accurate. Results should be used as guidance, not definitive proof of AI or human authorship.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <footer className="w-full py-4 px-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <p className="text-xs text-muted-foreground">
            Powered by Groq and Gemini AI
          </p>
          <p className="text-xs text-muted-foreground">
            AI content detection & humanization
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
