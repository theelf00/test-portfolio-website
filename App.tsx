import React, { useState } from 'react';
import { Shield, FileText, User, Github, Sparkles } from 'lucide-react';
import ProfileGenerator from './components/ProfileGenerator';
import ProjectGenerator from './components/ProjectGenerator';
import MarkdownPreview from './components/MarkdownPreview';
import { AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.PROFILE);
  const [markdown, setMarkdown] = useState<string>("");

  return (
    <div className="min-h-screen flex flex-col font-sans text-text selection:bg-primary/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="h-16 border-b border-border/40 glass sticky top-0 z-50">
        <div className="container mx-auto h-full flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-accent p-1.5 rounded-lg shadow-lg shadow-primary/20">
              <Shield className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">Red Team <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Portfolio</span></h1>
            </div>
          </div>
          <div className="flex gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-text-muted hover:text-white transition-colors p-2 hover:bg-surface-highlight rounded-full">
              <Github size={20} />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row container mx-auto p-4 lg:p-6 gap-6 h-[calc(100vh-4rem)]">
        
        {/* Navigation / Input Area */}
        <div className="flex flex-col gap-4 lg:w-1/2 h-full">
          
          {/* Mode Switcher */}
          <nav className="glass p-1 rounded-xl flex gap-1 shrink-0">
            <button 
              onClick={() => setMode(AppMode.PROFILE)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                mode === AppMode.PROFILE 
                  ? 'bg-surface-highlight text-white shadow-sm ring-1 ring-white/10' 
                  : 'text-text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <User size={16} />
              <span>Profile</span>
            </button>
            <button 
              onClick={() => setMode(AppMode.PROJECT)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                mode === AppMode.PROJECT 
                  ? 'bg-surface-highlight text-white shadow-sm ring-1 ring-white/10' 
                  : 'text-text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText size={16} />
              <span>Project Report</span>
            </button>
          </nav>

          {/* Generator Component */}
          <div className="glass flex-1 rounded-xl overflow-hidden flex flex-col border border-border/50 shadow-2xl shadow-black/20">
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
              {mode === AppMode.PROFILE ? (
                <ProfileGenerator onContentChange={setMarkdown} />
              ) : (
                <ProjectGenerator onContentChange={setMarkdown} />
              )}
            </div>
            {/* Footer Tip */}
            <div className="p-4 bg-surface/50 border-t border-border/50 backdrop-blur-sm">
               <div className="flex gap-3 items-start text-xs text-text-muted">
                  <Sparkles size={14} className="text-accent mt-0.5 shrink-0" />
                  <p>Pro Tip: Use the <span className="text-accent font-medium">AI Refine</span> features to automatically translate rough notes into professional cybersecurity terminology.</p>
               </div>
            </div>
          </div>
        </div>

        {/* Preview Pane */}
        <div className="lg:w-1/2 h-full flex flex-col gap-2">
           <div className="flex items-center justify-between px-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-2">
                <Github size={12} /> Live Preview
              </span>
           </div>
           <div className="flex-1 overflow-hidden rounded-xl border border-border/50 shadow-2xl shadow-black/40 bg-[#0d1117]">
              <MarkdownPreview content={markdown} />
           </div>
        </div>

      </main>
    </div>
  );
};

export default App;