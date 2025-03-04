import React from 'react';
import { Toaster } from 'sonner';

interface AppContainerProps {
  children: React.ReactNode;
}

export default function AppContainer({ children }: AppContainerProps) {
  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="container">
        <header className="text-center mb-2">
          <h1>AI Text Humanizer</h1>
          <p className="subtitle">Make AI-generated text sound more natural and human</p>
        </header>
        <main>
          {children}
        </main>
        <footer className="text-center mt-2">
          <p>© 2023 AI Text Humanizer. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
