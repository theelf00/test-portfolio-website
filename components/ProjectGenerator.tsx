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
    <div className="space-y-6">
       <div className="flex justify-between items-center pb-4 border-b border-border">
        <h2 className="text-xl font-semibold text-accent">Project Details</h2>
        <button 
          onClick={copyToClipboard}
          className="flex items-center gap-2 bg-surface hover:bg-border text-text px-3 py-1.5 rounded-md text-sm border border-border transition-colors"
        >
          {hasCopied ? <Check size={16} className="text-primary" /> : <Copy size={16} />}
          {hasCopied ? "Copied" : "Copy Markdown"}
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-text-muted">Project Title</label>
        <input 
          type="text" 
          value={data.title} 
          onChange={e => setData({...data, title: e.target.value})}
          className="w-full bg-surface border border-border rounded p-2 text-text focus:border-accent outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-text-muted">High-Level Overview</label>
        <textarea 
          value={data.overview} 
          onChange={e => setData({...data, overview: e.target.value})}
          rows={3}
          className="w-full bg-surface border border-border rounded p-2 text-text focus:border-accent outline-none"
        />
      </div>

      {/* Problem Section */}
      <div className="space-y-2 p-4 bg-surface/50 rounded-lg border border-border">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-bold text-red-400">🚨 The Problem (Scenario)</label>
          <button 
            onClick={() => handleAiRefine('problem')}
            disabled={!!loadingSection}
            className="text-xs flex items-center gap-1 text-accent hover:text-white transition-colors"
          >
             {loadingSection === 'problem' ? <Loader2 size={12} className="animate-spin"/> : <Wand2 size={12} />}
             Enhance
          </button>
        </div>
        <textarea 
          value={data.problem} 
          onChange={e => setData({...data, problem: e.target.value})}
          rows={4}
          className="w-full bg-background border border-border rounded p-2 text-text focus:border-accent outline-none text-sm"
          placeholder="Describe the target environment and the security gap..."
        />
      </div>

      {/* Action Section */}
      <div className="space-y-2 p-4 bg-surface/50 rounded-lg border border-border">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-bold text-yellow-400">⚡ The Action (Methodology)</label>
          <button 
            onClick={() => handleAiRefine('action')}
            disabled={!!loadingSection}
            className="text-xs flex items-center gap-1 text-accent hover:text-white transition-colors"
          >
            {loadingSection === 'action' ? <Loader2 size={12} className="animate-spin"/> : <Wand2 size={12} />}
             Enhance
          </button>
        </div>
        <textarea 
          value={data.action} 
          onChange={e => setData({...data, action: e.target.value})}
          rows={4}
          className="w-full bg-background border border-border rounded p-2 text-text focus:border-accent outline-none text-sm"
          placeholder="Detail the tools and techniques used to exploit the vulnerability..."
        />
      </div>

      {/* Outcome Section */}
      <div className="space-y-2 p-4 bg-surface/50 rounded-lg border border-border">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-bold text-green-400">✅ The Outcome (Remediation)</label>
          <button 
            onClick={() => handleAiRefine('outcome')}
            disabled={!!loadingSection}
            className="text-xs flex items-center gap-1 text-accent hover:text-white transition-colors"
          >
            {loadingSection === 'outcome' ? <Loader2 size={12} className="animate-spin"/> : <Wand2 size={12} />}
             Enhance
          </button>
        </div>
        <textarea 
          value={data.outcome} 
          onChange={e => setData({...data, outcome: e.target.value})}
          rows={4}
          className="w-full bg-background border border-border rounded p-2 text-text focus:border-accent outline-none text-sm"
          placeholder="What was the result? How was it fixed?"
        />
      </div>

       <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">Repository Link</label>
           <input 
            type="text" 
            value={data.repoLink} 
            onChange={e => setData({...data, repoLink: e.target.value})}
            className="w-full bg-surface border border-border rounded p-2 text-text focus:border-accent outline-none text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">Report PDF Link</label>
           <input 
            type="text" 
            value={data.reportLink} 
            onChange={e => setData({...data, reportLink: e.target.value})}
            className="w-full bg-surface border border-border rounded p-2 text-text focus:border-accent outline-none text-sm"
          />
        </div>
       </div>
    </div>
  );
};

export default ProjectGenerator;