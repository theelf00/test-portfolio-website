import React, { useState, useEffect, useCallback } from 'react';
import { ProjectData } from '../types';
import { INITIAL_PROJECT } from '../constants';
import { generateProjectSection } from '../services/geminiService';
import { Wand2, Loader2, Copy, Check } from 'lucide-react';

interface Props {
  onContentChange: (content: string) => void;
}

const ProjectGenerator: React.FC<Props> = ({ onContentChange }) => {
  const [data, setData] = useState<ProjectData>(INITIAL_PROJECT);
  const [loadingSection, setLoadingSection] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  const generateMarkdown = useCallback(() => {
    return `
# 📁 ${data.title}

[![View Report](https://img.shields.io/badge/View-PDF_Report-red?style=for-the-badge&logo=adobeacrobatreader)](${data.reportLink})
[![GitHub Repo](https://img.shields.io/badge/View-Repository-black?style=for-the-badge&logo=github)](${data.repoLink})

## 📝 Overview
${data.overview}

---

## 🚩 Problem (The Scenario)
${data.problem}

## ⚡ Action (Tools & Techniques)
${data.action}

**Tools Used:**
${data.toolsUsed.map(t => `- ${t}`).join('\n')}

## ✅ Outcome (Remediation & Impact)
${data.outcome}

---

## 📸 Visual Proof

### 1. Initial Reconnaissance
> *Place screenshot here (e.g., Nmap scan results showing open ports)*
\`![Nmap Scan](./screenshots/nmap_scan.png)\`

### 2. Exploitation
> *Place screenshot here (e.g., Metasploit shell or Burp Suite payload)*
\`![Exploit](./screenshots/exploit.png)\`

### 3. Proof of Concept (PoC)
> *Place screenshot here (e.g., reading /etc/passwd or Admin dashboard access)*
\`![PoC](./screenshots/poc.png)\`

---

## 📄 Sample Report
A detailed PDF report containing the executive summary, technical findings, and remediation steps can be found [here](${data.reportLink}).
`;
  }, [data]);

  useEffect(() => {
    onContentChange(generateMarkdown());
  }, [data, generateMarkdown, onContentChange]);

  const handleAiRefine = async (field: 'problem' | 'action' | 'outcome') => {
    setLoadingSection(field);
    try {
      const refined = await generateProjectSection(field, data[field]);
      setData(prev => ({ ...prev, [field]: refined }));
    } catch (e) {
      alert("Failed to refine content. Check API key.");
    } finally {
      setLoadingSection(null);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
       <div className="flex justify-between items-center border-b border-border/50 pb-4">
        <div>
           <h2 className="text-xl font-bold text-white">Project Details</h2>
           <p className="text-xs text-text-muted mt-1">Document your offensive security engagement</p>
        </div>
        <button 
          onClick={copyToClipboard}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            hasCopied 
            ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
            : 'bg-surface-highlight text-text hover:bg-border border border-border'
          }`}
        >
          {hasCopied ? <Check size={14} /> : <Copy size={14} />}
          {hasCopied ? "Copied" : "Copy Code"}
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Project Title</label>
        <input 
          type="text" 
          value={data.title} 
          onChange={e => setData({...data, title: e.target.value})}
          className="w-full bg-surface-highlight/50 border border-border rounded-lg p-3 text-text focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-gray-600 font-medium"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">High-Level Overview</label>
        <textarea 
          value={data.overview} 
          onChange={e => setData({...data, overview: e.target.value})}
          rows={3}
          className="w-full bg-surface-highlight/50 border border-border rounded-lg p-3 text-text focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all resize-y text-sm"
        />
      </div>

      {/* Problem Section */}
      <div className="space-y-2 p-1 rounded-xl bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/20">
        <div className="p-4">
            <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-red-400 flex items-center gap-2">
                <span className="p-1 bg-red-500/20 rounded">🚨</span> The Problem
            </label>
            <button 
                onClick={() => handleAiRefine('problem')}
                disabled={!!loadingSection}
                className="text-xs flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
            >
                {loadingSection === 'problem' ? <Loader2 size={12} className="animate-spin"/> : <Wand2 size={12} />}
                Enhance
            </button>
            </div>
            <textarea 
            value={data.problem} 
            onChange={e => setData({...data, problem: e.target.value})}
            rows={4}
            className="w-full bg-black/20 border border-red-500/10 rounded-lg p-3 text-text focus:border-red-500/50 outline-none text-sm transition-all"
            placeholder="Describe the target environment and the security gap..."
            />
        </div>
      </div>

      {/* Action Section */}
      <div className="space-y-2 p-1 rounded-xl bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20">
         <div className="p-4">
            <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-yellow-400 flex items-center gap-2">
                <span className="p-1 bg-yellow-500/20 rounded">⚡</span> The Action
            </label>
            <button 
                onClick={() => handleAiRefine('action')}
                disabled={!!loadingSection}
                className="text-xs flex items-center gap-1.5 text-yellow-400 hover:text-yellow-300 transition-colors px-2 py-1 rounded hover:bg-yellow-500/10"
            >
                {loadingSection === 'action' ? <Loader2 size={12} className="animate-spin"/> : <Wand2 size={12} />}
                Enhance
            </button>
            </div>
            <textarea 
            value={data.action} 
            onChange={e => setData({...data, action: e.target.value})}
            rows={4}
            className="w-full bg-black/20 border border-yellow-500/10 rounded-lg p-3 text-text focus:border-yellow-500/50 outline-none text-sm transition-all"
            placeholder="Detail the tools and techniques used to exploit the vulnerability..."
            />
        </div>
      </div>

      {/* Outcome Section */}
      <div className="space-y-2 p-1 rounded-xl bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20">
         <div className="p-4">
            <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-bold text-green-400 flex items-center gap-2">
                <span className="p-1 bg-green-500/20 rounded">✅</span> The Outcome
            </label>
            <button 
                onClick={() => handleAiRefine('outcome')}
                disabled={!!loadingSection}
                className="text-xs flex items-center gap-1.5 text-green-400 hover:text-green-300 transition-colors px-2 py-1 rounded hover:bg-green-500/10"
            >
                {loadingSection === 'outcome' ? <Loader2 size={12} className="animate-spin"/> : <Wand2 size={12} />}
                Enhance
            </button>
            </div>
            <textarea 
            value={data.outcome} 
            onChange={e => setData({...data, outcome: e.target.value})}
            rows={4}
            className="w-full bg-black/20 border border-green-500/10 rounded-lg p-3 text-text focus:border-green-500/50 outline-none text-sm transition-all"
            placeholder="What was the result? How was it fixed?"
            />
        </div>
      </div>

       <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Repository Link</label>
           <input 
            type="text" 
            value={data.repoLink} 
            onChange={e => setData({...data, repoLink: e.target.value})}
            className="w-full bg-surface-highlight/50 border border-border rounded-lg p-3 text-text focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Report PDF Link</label>
           <input 
            type="text" 
            value={data.reportLink} 
            onChange={e => setData({...data, reportLink: e.target.value})}
            className="w-full bg-surface-highlight/50 border border-border rounded-lg p-3 text-text focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm"
          />
        </div>
       </div>
    </div>
  );
};

export default ProjectGenerator;