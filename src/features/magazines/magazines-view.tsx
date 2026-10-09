'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Bookmark, ChevronRight, Download, Filter, Folder, Search, Sparkles, X, LayoutGrid } from 'lucide-react';
import { magazines, magazineFolders } from '@/lib/magazines';
import dynamic from 'next/dynamic';
import './magazines.css';

const ReaderView = dynamic(() => import('./reader-view'), { ssr: false });

export default function MagazinesView({ folderId, magazineId }: { folderId?: string, magazineId?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  
  if (magazineId) {
    const issue = magazines.find(m => m.id === magazineId);
    if (!issue) return <div className="learning-empty"><h2>Magazine not found</h2><button className="btn btn-primary" onClick={() => router.push('/app/magazines')}>Back to Library</button></div>;
    return <ReaderView issue={issue} onClose={() => router.push(folderId ? `/app/magazines?folder=${folderId}` : '/app/magazines')} />;
  }

  if (folderId) {
    const folder = magazineFolders.find(f => f.id === folderId);
    if (!folder) return <div className="learning-empty"><h2>Folder not found</h2><button className="btn btn-primary" onClick={() => router.push('/app/magazines')}>Back to Library</button></div>;
    
    const issues = magazines.filter(m => m.folderId === folderId);
    const filteredIssues = issues.filter(m => m.title.toLowerCase().includes(query.toLowerCase()));

    return (
      <div className="magazine-root">
        <div className="magazine-header">
          <Link href="/app/magazines" className="practice-back" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted)', textDecoration: 'none', marginBottom: '1rem' }}><ArrowLeft size={16}/> Back to Magazine Library</Link>
          <h1>{folder.name}</h1>
          <p>{folder.description}</p>
        </div>
        
        <div className="magazine-toolbar">
          <label className="magazine-search">
            <Search size={16} color="var(--muted)"/>
            <input placeholder="Search this collection..." value={query} onChange={e => setQuery(e.target.value)}/>
            {query && <button className="icon-btn" style={{border: 'none', background: 'transparent'}} onClick={() => setQuery('')}><X size={14}/></button>}
          </label>
        </div>

        <div className="magazine-grid">
          {filteredIssues.map(issue => (
            <div key={issue.id} className="issue-card">
              <div className="issue-cover">
                <span className="issue-cover-title">{issue.title}</span>
                <div className="issue-cover-meta">
                  <span>{issue.month} {issue.year}</span>
                  <span>{issue.category}</span>
                </div>
              </div>
              <div className="issue-content">
                <h3>{issue.title}</h3>
                <div className="issue-details">
                  <span>{issue.pages} Pages</span>
                  <span>Added: {new Date(issue.addedAt).toLocaleDateString()}</span>
                </div>
                <div className="issue-actions">
                  <Link href={`/app/magazines?folder=${folderId}&id=${issue.id}`} className="learning-primary">Read Now</Link>
                  <button className="icon-btn" aria-label="Bookmark"><Bookmark size={16}/></button>
                  <a href={issue.pdfUrl} download className="icon-btn" aria-label="Download PDF"><Download size={16}/></a>
                </div>
              </div>
            </div>
          ))}
          {filteredIssues.length === 0 && <p>No issues match your search.</p>}
        </div>
      </div>
    );
  }

  const categories = ['All', ...Array.from(new Set(magazineFolders.map(f => f.category)))];
  
  const filteredFolders = magazineFolders.filter(f => {
    if (category !== 'All' && f.category !== category) return false;
    if (query && !f.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="magazine-root">
      <div className="magazine-header">
        <span className="magazine-eyebrow">PREMIUM READING</span>
        <h1>Magazine Collections</h1>
        <p>Explore progressive monthly dictations, previous year papers, and specialized legal magazines in an interactive reader.</p>
      </div>

      <div className="magazine-toolbar">
        <label className="magazine-search">
          <Search size={16} color="var(--muted)"/>
          <input placeholder="Search folders, magazines, issues..." value={query} onChange={e => setQuery(e.target.value)}/>
          {query && <button className="icon-btn" style={{border: 'none', background: 'transparent'}} onClick={() => setQuery('')}><X size={14}/></button>}
        </label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
        </select>
        <button className="learning-secondary"><Filter size={14}/> Advanced Filters</button>
      </div>

      <div>
        <h2 className="magazine-section-title"><LayoutGrid size={20}/> Folders</h2>
        <div className="magazine-grid">
          {filteredFolders.map(folder => (
            <Link key={folder.id} href={`/app/magazines?folder=${folder.id}`} className="folder-card">
              <div className="folder-icon"><Folder size={24}/></div>
              <h3>{folder.name}</h3>
              <div className="folder-meta">
                <span>{folder.magazineCount} Issues</span>
                <span>•</span>
                <span>{folder.year} Collection</span>
              </div>
              <ChevronRight className="folder-arrow" size={20}/>
            </Link>
          ))}
          {filteredFolders.length === 0 && <p>No folders match your search.</p>}
        </div>
      </div>

      <div>
        <h2 className="magazine-section-title"><Sparkles size={20}/> Recently Added Issues</h2>
        <div className="magazine-grid">
          {magazines.slice(0, 4).map(issue => (
            <div key={issue.id} className="issue-card">
              <div className="issue-cover" style={{ aspectRatio: '16/9' }}>
                <span className="issue-cover-title">{issue.title}</span>
                <div className="issue-cover-meta">
                  <span style={{background: 'var(--primary)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px'}}>NEW</span>
                </div>
              </div>
              <div className="issue-content">
                <h3>{issue.title}</h3>
                <div className="issue-details">
                  <span>{issue.category} • {issue.month} {issue.year}</span>
                </div>
                <div className="issue-actions">
                  <Link href={`/app/magazines?id=${issue.id}`} className="btn btn-primary" style={{width: '100%'}}>Read</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
