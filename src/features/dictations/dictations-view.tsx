'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Book, BookOpen, Crown, FileText, Filter, Headphones, Lock, Mic, Search, Shield, Target, Trophy } from 'lucide-react';
import './dictations.css';

const dictationCategories = [
  { id: 'SUPER_60', title: 'Super-60 Dictations', description: 'Covers 1000+ Dictations content in 60 Dictations', badge: 'Pro Level', pro: true, lang: 'English', speed: 'All Speeds', count: 60, icon: <Crown size={24}/> },
  { id: 'Eduquity_100', title: 'Most Important Dictations', description: 'Eduquity series specifically curated for skill tests', badge: '', pro: false, lang: 'English', speed: '840 Words', count: 100, icon: <Target size={24}/> },
  { id: 'KC_1000', title: 'Kailash Chandra (1000 Words)', description: 'Best for SSC Grade C', badge: '', pro: false, lang: 'English', speed: '1000 Words', count: 240, icon: <Book size={24}/> },
  { id: 'KC_840', title: 'Kailash Chandra (840 Words)', description: 'All Speeds - Standard Format', badge: '', pro: false, lang: 'English', speed: '840 Words', count: 240, icon: <Book size={24}/> },
  { id: 'KC_400', title: 'Kailash Chandra (400 Words)', description: 'Best for Beginners', badge: '', pro: false, lang: 'English', speed: '400 Words', count: 480, icon: <BookOpen size={24}/> },
  { id: 'DSSSB_IMP', title: 'DSSSB Most Important', description: 'Best for DSSSB Exam preparation', badge: '', pro: false, lang: 'English', speed: 'All Speeds', count: 85, icon: <Trophy size={24}/> },
  { id: 'KC_400_PUNC', title: 'Kailash Chandra (with Punctuation)', description: 'Practice with exact punctuation marks', badge: '', pro: false, lang: 'English', speed: '400 Words', count: 120, icon: <FileText size={24}/> },
  { id: 'Progressive', title: 'Progressive Dictations', description: 'Monthly difficulty progression • Year-wise', badge: '', pro: false, lang: 'English', speed: '80–120 WPM', count: 150, icon: <ArrowRight size={24}/> },
  { id: 'SSC_Previous_Year', title: 'SSC Previous Year', description: 'Grade C & D past papers', badge: '', pro: false, lang: 'English', speed: 'All Speeds', count: 95, icon: <Headphones size={24}/> },
  { id: 'President_Speech', title: "President's Speech", description: 'Formal speeches and parliamentary debates', badge: '', pro: false, lang: 'English', speed: '1000 Words', count: 45, icon: <Mic size={24}/> },
  { id: 'Current_Affairs', title: 'Current Affairs', description: 'Latest topics and current events', badge: '', pro: false, lang: 'English', speed: '1000 Words', count: 60, icon: <BookOpen size={24}/> },
  { id: 'GD_Bisht_Legal', title: 'GD Bisht Legal', description: 'Legal terminology and court judgments', badge: '', pro: false, lang: 'English', speed: '400-800 Words', count: 110, icon: <Shield size={24}/> },
  { id: 'Legal_OLD', title: 'Legal Dictations', description: 'Standard court dictations', badge: '', pro: false, lang: 'English', speed: '400-800 Words', count: 80, icon: <Shield size={24}/> },
  { id: 'vap_legal', title: 'Legal Dictations (Vishnu Art)', description: 'Vishnu Art Press legal collections', badge: '', pro: false, lang: 'English', speed: 'All Speeds', count: 150, icon: <Shield size={24}/> },
  { id: 'Pitman_New_Era', title: 'Pitman New Era Book', description: 'Foundational Pitman shorthand practice', badge: '', pro: false, lang: 'English', speed: 'Slow to High Speed', count: 200, icon: <Book size={24}/> },
];

export default function DictationsView() {
  const [query, setQuery] = useState('');

  const filtered = dictationCategories.filter(c => c.title.toLowerCase().includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="dictations-root">
      <div className="dictations-header">
        <h1>English Dictations</h1>
        <p>Daily-use practice library — KC, Progressive, SSC PYQs, Legal, and more.</p>
        
        <div className="dictations-toolbar">
          <label className="dictations-search">
            <Search size={16} color="var(--muted)"/>
            <input placeholder="Search dictation libraries..." value={query} onChange={e => setQuery(e.target.value)} />
          </label>
        </div>
      </div>

      <div className="dictations-grid">
        {filtered.map(cat => (
          <Link href={`/app/dictations?type=${cat.id}`} key={cat.id} className="dictation-category-card">
            <div className="dictation-card-icon">
              {cat.icon}
            </div>
            
            {cat.pro && <div className="dictation-pro-badge"><Lock size={12}/> {cat.badge}</div>}
            {!cat.pro && cat.badge && <div className="dictation-badge">{cat.badge}</div>}
            
            <h3>{cat.title}</h3>
            <p>{cat.description}</p>
            
            <div className="dictation-meta">
              <span>{cat.lang}</span>
              <span>•</span>
              <span>{cat.speed}</span>
            </div>
            
            <div className="dictation-action">
              Practice Now <ArrowRight size={16}/>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
