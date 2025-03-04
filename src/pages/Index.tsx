
import TextAnalyzer from "@/components/TextAnalyzer";
import { motion } from "framer-motion";
import { FileText, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
      </header>
      
      <main className="flex-1 px-8 pb-8">
        <div className="w-full max-w-5xl mx-auto">
          <motion.div 
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TextAnalyzer />
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
