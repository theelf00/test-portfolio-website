import React, { useState, useEffect, useCallback } from 'react';
import { ProfileData, Skill } from '../types';
import { AVAILABLE_SKILLS, POPULAR_TOOLS, BADGE_URLS, INITIAL_PROFILE } from '../constants';
import { refineBio } from '../services/geminiService';
import { Wand2, Loader2, Copy, Check, RefreshCw } from 'lucide-react';

interface Props {
  onContentChange: (content: string) => void;
}

const ProfileGenerator: React.FC<Props> = ({ onContentChange }) => {
  const [data, setData] = useState<ProfileData>(INITIAL_PROFILE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const generateMarkdown = useCallback(() => {
    const skillsTable = data.skills.map(s => {
      return `| **${s.category}** | ${s.items.join(', ')} |`;
    }).join('\n');

    const toolsBadges = data.tools.map(tool => {
      const url = BADGE_URLS[tool] || `https://img.shields.io/badge/${encodeURIComponent(tool)}-Tool-lightgrey`;
      return `![${tool}](${url})`;
    }).join(' ');

    const certBadges = data.certifications.map(cert => {
      return `![${cert}](https://img.shields.io/badge/${encodeURIComponent(cert)}-Certified-gold)`;
    }).join(' ');
    
    const socialLinks = data.socials.map(s => `[${s.platform}](${s.url})`).join(' • ');

    return `
# Hi there, I'm ${data.name} 👋

### ${data.title}

${data.bio}

---

## 🛡️ Skills

| Category | Skills |
|:--- |:--- |
${skillsTable}

## 🛠️ Tools

${toolsBadges}

## 📜 Certifications & Education

${certBadges}

---

## 🔗 Connect

${socialLinks}
`;
  }, [data]);

  useEffect(() => {
    onContentChange(generateMarkdown());
  }, [data, generateMarkdown, onContentChange]);

  const handleRefineBio = async () => {
    if (!data.bio) return;
    setIsGenerating(true);
    try {
      const refined = await refineBio(data.bio);
      setData(prev => ({ ...prev, bio: refined }));
    } catch (e) {
      alert("Failed to refine bio. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSkill = (category: string, item: string) => {
    setData(prev => {
      const existingCat = prev.skills.find(s => s.category === category);
      let newSkills = [...prev.skills];
      
      if (existingCat) {
        if (existingCat.items.includes(item)) {
          // Remove item
          const newItems = existingCat.items.filter(i => i !== item);
          if (newItems.length === 0) {
            newSkills = newSkills.filter(s => s.category !== category);
          } else {
            newSkills = newSkills.map(s => s.category === category ? { ...s, items: newItems } : s);
          }
        } else {
          // Add item
          newSkills = newSkills.map(s => s.category === category ? { ...s, items: [...s.items, item] } : s);
        }
      } else {
        // Add new category
        newSkills.push({ category, items: [item] });
      }
      return { ...prev, skills: newSkills };
    });
  };

  const toggleTool = (tool: string) => {
    setData(prev => {
      const exists = prev.tools.includes(tool);
      if (exists) return { ...prev, tools: prev.tools.filter(t => t !== tool) };
      return { ...prev, tools: [...prev.tools, tool] };
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-border">
        <h2 className="text-xl font-semibold text-accent">Profile Configuration</h2>
        <button 
          onClick={copyToClipboard}
          className="flex items-center gap-2 bg-surface hover:bg-border text-text px-3 py-1.5 rounded-md text-sm border border-border transition-colors"
        >
          {hasCopied ? <Check size={16} className="text-primary" /> : <Copy size={16} />}
          {hasCopied ? "Copied" : "Copy Markdown"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">Full Name</label>
          <input 
            type="text" 
            value={data.name} 
            onChange={e => setData({...data, name: e.target.value})}
            className="w-full bg-surface border border-border rounded p-2 text-text focus:border-accent outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">Professional Title</label>
          <input 
            type="text" 
            value={data.title} 
            onChange={e => setData({...data, title: e.target.value})}
            className="w-full bg-surface border border-border rounded p-2 text-text focus:border-accent outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-text-muted">Professional Bio</label>
            <button 
                onClick={handleRefineBio}
                disabled={isGenerating}
                className="text-xs flex items-center gap-1 text-accent hover:text-white transition-colors disabled:opacity-50"
            >
                {isGenerating ? <Loader2 size={12} className="animate-spin"/> : <Wand2 size={12} />}
                Refine with AI
            </button>
        </div>
        <textarea 
          value={data.bio} 
          onChange={e => setData({...data, bio: e.target.value})}
          rows={4}
          className="w-full bg-surface border border-border rounded p-2 text-text focus:border-accent outline-none"
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-text border-b border-border pb-1">Skills Selection</h3>
        <div className="space-y-4">
          {AVAILABLE_SKILLS.map(cat => (
            <div key={cat.category}>
              <h4 className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">{cat.category}</h4>
              <div className="flex flex-wrap gap-2">
                {cat.items.map(item => {
                  const isSelected = data.skills.some(s => s.category === cat.category && s.items.includes(item));
                  return (
                    <button
                      key={item}
                      onClick={() => toggleSkill(cat.category, item)}
                      className={`text-xs px-2 py-1 rounded border transition-colors ${isSelected ? 'bg-primary/20 border-primary text-primary-hover' : 'bg-surface border-border text-text-muted hover:border-text-muted'}`}
                    >
                      {item}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-text border-b border-border pb-1">Toolbox</h3>
        <div className="flex flex-wrap gap-2">
            {POPULAR_TOOLS.map(tool => {
                const isSelected = data.tools.includes(tool);
                return (
                    <button
                        key={tool}
                        onClick={() => toggleTool(tool)}
                        className={`text-xs px-2 py-1 rounded border transition-colors ${isSelected ? 'bg-accent/20 border-accent text-accent' : 'bg-surface border-border text-text-muted hover:border-text-muted'}`}
                    >
                        {tool}
                    </button>
                )
            })}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-text-muted">Certifications (Comma separated)</label>
        <input 
            type="text" 
            value={data.certifications.join(', ')} 
            onChange={e => setData({...data, certifications: e.target.value.split(',').map(s => s.trim())})}
            className="w-full bg-surface border border-border rounded p-2 text-text focus:border-accent outline-none"
            placeholder="e.g. eJPT, OSCP, CompTIA Security+"
        />
      </div>
    </div>
  );
};

export default ProfileGenerator;