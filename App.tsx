import React, { useState } from 'react';
import { Shield, FileText, User, Github } from 'lucide-react';
import ProfileGenerator from './components/ProfileGenerator';
import ProjectGenerator from './components/ProjectGenerator';
import MarkdownPreview from './components/MarkdownPreview';
import { AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.PROFILE);
  const [markdown, setMarkdown] = useState<string>("");

  return (
    <div className="min-h-screen bg-background text-text flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 border-b border-border flex items-center px-6 justify-between bg-surface sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Shield className="text-primary w-8 h-8" />
          <div>
            <h1 className="text-lg font-bold text-text tracking-tight">Red Team Portfolio <span className="text-accent">Builder</span></h1>
            <p className="text-xs text-text-muted">GitHub Professional Framework Generator</p>
          </div>
        </div>
        <div className="flex gap-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-text-muted hover:text-white transition-colors">
                <Github size={20} />
            </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar / Navigation */}
        <aside className="w-64 border-r border-border bg-surface flex flex-col hidden md:flex">
          <div className="p-4 space-y-2">
            <button 
              onClick={() => setMode(AppMode.PROFILE)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all ${mode === AppMode.PROFILE ? 'bg-primary/20 text-white border border-primary' : 'text-text-muted hover:bg-border'}`}
            >
              <User size={18} />
              <span className="font-medium text-sm">Landing Page</span>
            </button>
            <button 
               onClick={() => setMode(AppMode.PROJECT)}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all ${mode === AppMode.PROJECT ? 'bg-primary/20 text-white border border-primary' : 'text-text-muted hover:bg-border'}`}
            >
              <FileText size={18} />
              <span className="font-medium text-sm">Project Template</span>
            </button>
          </div>
          
          <div className="mt-auto p-6 border-t border-border">
            <div className="bg-background p-4 rounded border border-border text-xs text-text-muted">
                <p className="font-semibold mb-2 text-accent">Pro Tip:</p>
                Use the AI "Refine" buttons to transform rough notes into professional pentesting language.
            </div>
          </div>
        </aside>

        {/* Editor Area */}
        <section className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
            {/* Input Form Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-background">
                <div className="max-w-3xl mx-auto">
                    {mode === AppMode.PROFILE ? (
                        <ProfileGenerator onContentChange={setMarkdown} />
                    ) : (
                        <ProjectGenerator onContentChange={setMarkdown} />
                    )}
                </div>
            </div>

            {/* Preview Pane */}
            <div className="w-full md:w-1/2 lg:w-[45%] border-l border-border bg-[#0d1117] flex flex-col h-[50vh] md:h-full">
                <div className="h-10 border-b border-border flex items-center px-4 bg-surface justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">Preview (GitHub Render)</span>
                </div>
                <div className="flex-1 overflow-auto p-4">
                    <MarkdownPreview content={markdown} />
                </div>
            </div>
        </section>
      </main>
      
      {/* Mobile Nav Bottom */}
      <div className="md:hidden border-t border-border bg-surface p-2 flex justify-around">
            <button onClick={() => setMode(AppMode.PROFILE)} className={`flex flex-col items-center p-2 rounded ${mode === AppMode.PROFILE ? 'text-accent' : 'text-text-muted'}`}>
                <User size={20} />
                <span className="text-[10px] mt-1">Profile</span>
            </button>
            <button onClick={() => setMode(AppMode.PROJECT)} className={`flex flex-col items-center p-2 rounded ${mode === AppMode.PROJECT ? 'text-accent' : 'text-text-muted'}`}>
                <FileText size={20} />
                <span className="text-[10px] mt-1">Project</span>
            </button>
      </div>
    </div>
  );
};

export default App;