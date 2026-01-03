import React, { useState, useEffect, useCallback } from 'react';
import { ProfileData, Skill } from '../types';
import { AVAILABLE_SKILLS, POPULAR_TOOLS, BADGE_URLS, INITIAL_PROFILE } from '../constants';
import { refineBio } from '../services/geminiService';
import { Wand2, Loader2, Copy, Check } from 'lucide-react';

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
      if (!cert) return '';
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
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-border/50 pb-4">
        <div>
           <h2 className="text-xl font-bold text-white">Profile Configuration</h2>
           <p className="text-xs text-text-muted mt-1">Craft your professional GitHub landing page</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Full Name</label>
          <input 
            type="text" 
            value={data.name} 
            onChange={e => setData({...data, name: e.target.value})}
            className="w-full bg-surface-highlight/50 border border-border rounded-lg p-3 text-text focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
            placeholder="e.g. John Doe"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Professional Title</label>
          <input 
            type="text" 
            value={data.title} 
            onChange={e => setData({...data, title: e.target.value})}
            className="w-full bg-surface-highlight/50 border border-border rounded-lg p-3 text-text focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
            placeholder="e.g. Red Teamer"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Professional Bio</label>
            <button 
                onClick={handleRefineBio}
                disabled={isGenerating}
                className="text-xs flex items-center gap-1.5 text-accent hover:text-accent-hover transition-colors disabled:opacity-50 font-medium px-2 py-1 rounded hover:bg-accent/10"
            >
                {isGenerating ? <Loader2 size={12} className="animate-spin"/> : <Wand2 size={12} />}
                Refine with AI
            </button>
        </div>
        <textarea 
          value={data.bio} 
          onChange={e => setData({...data, bio: e.target.value})}
          rows={4}
          className="w-full bg-surface-highlight/50 border border-border rounded-lg p-3 text-text focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-y text-sm leading-relaxed"
          placeholder="Write a short bio about yourself..."
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="w-1 h-4 bg-primary rounded-full"></span>
          Skills Selection
        </h3>
        <div className="grid gap-4">
          {AVAILABLE_SKILLS.map(cat => (
            <div key={cat.category} className="glass-card p-3 rounded-lg">
              <h4 className="text-[10px] font-bold text-text-muted mb-3 uppercase tracking-widest">{cat.category}</h4>
              <div className="flex flex-wrap gap-2">
                {cat.items.map(item => {
                  const isSelected = data.skills.some(s => s.category === cat.category && s.items.includes(item));
                  return (
                    <button
                      key={item}
                      onClick={() => toggleSkill(cat.category, item)}
                      className={`text-xs px-2.5 py-1.5 rounded-md border transition-all duration-200 font-medium ${
                        isSelected 
                          ? 'bg-primary/10 border-primary/50 text-primary-hover shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                          : 'bg-surface/50 border-border/50 text-text-muted hover:border-text-muted hover:text-text'
                      }`}
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

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
           <span className="w-1 h-4 bg-accent rounded-full"></span>
           Toolbox
        </h3>
        <div className="glass-card p-4 rounded-lg flex flex-wrap gap-2">
            {POPULAR_TOOLS.map(tool => {
                const isSelected = data.tools.includes(tool);
                return (
                    <button
                        key={tool}
                        onClick={() => toggleTool(tool)}
                        className={`text-xs px-2.5 py-1.5 rounded-md border transition-all duration-200 font-medium ${
                          isSelected 
                            ? 'bg-accent/10 border-accent/50 text-accent shadow-[0_0_10px_rgba(59,130,246,0.1)]' 
                            : 'bg-surface/50 border-border/50 text-text-muted hover:border-text-muted hover:text-text'
                        }`}
                    >
                        {tool}
                    </button>
                )
            })}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Certifications (Comma separated)</label>
        <input 
            type="text" 
            value={data.certifications.join(', ')} 
            onChange={e => setData({...data, certifications: e.target.value.split(',').map(s => s.trim())})}
            className="w-full bg-surface-highlight/50 border border-border rounded-lg p-3 text-text focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-600"
            placeholder="e.g. eJPT, OSCP, CompTIA Security+"
        />
      </div>
    </div>
  );
};

export default ProfileGenerator;