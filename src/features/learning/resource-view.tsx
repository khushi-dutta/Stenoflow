'use client';

import {useMemo, useState} from 'react';
import {Bookmark, Download, FileText, Search, X} from 'lucide-react';
import {useProgress} from '@/lib/store';
import {studyResources} from './resources';

export default function ResourceView() {
  const {state, toggleFavorite} = useProgress();
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('All resources');
  const [bookmarked, setBookmarked] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const kinds = ['All resources', ...new Set(studyResources.map(resource => resource.kind))];
  const shown = useMemo(() => studyResources.filter(resource => {
    const matchesQuery = `${resource.title} ${resource.description} ${resource.kind}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesQuery && (kind === 'All resources' || kind === resource.kind) && (!bookmarked || state.favorites.includes(`resource:${resource.id}`));
  }), [query, kind, bookmarked, state.favorites]);
  const active = studyResources.find(resource => resource.id === preview);

  return <>
    <div className="learning-notice"><FileText size={18}/><p>Original StenoFlow study guides. Open a preview or download the PDF for offline reading and printing.</p></div>
    <div className="learning-resource-toolbar">
      <label className="learning-resource-search"><Search size={16}/><input aria-label="Search resources" placeholder="Search guides" value={query} onChange={event => setQuery(event.target.value)}/></label>
      <select aria-label="Resource type" value={kind} onChange={event => setKind(event.target.value)}>{kinds.map(item => <option key={item}>{item}</option>)}</select>
      <label className="learning-resource-check"><input type="checkbox" checked={bookmarked} onChange={event => setBookmarked(event.target.checked)}/> Bookmarked only</label>
    </div>
    <div className="learning-grid">{shown.map(resource => {
      const saved = state.favorites.includes(`resource:${resource.id}`);
      return <article className="learning-card" key={resource.id}>
        <div className="learning-resource-cover"><FileText size={44}/><span>STENOFLOW<br/>FIELD NOTES</span></div>
        <div className="learning-card-top"><span className="learning-eyebrow">{resource.kind} · {resource.pages} pages</span><button className="learning-icon-button" aria-label={`${saved ? 'Remove' : 'Add'} bookmark for ${resource.title}`} aria-pressed={saved} onClick={() => toggleFavorite(`resource:${resource.id}`)}><Bookmark size={16} fill={saved ? 'currentColor' : 'none'}/></button></div>
        <h2>{resource.title}</h2><p>{resource.description}</p>
        <div className="learning-card-actions"><button className="learning-secondary" onClick={() => setPreview(resource.id)}>Preview</button><a className="learning-primary" href={resource.href} download><Download size={15}/> Download PDF</a></div>
      </article>;
    })}</div>
    {!shown.length && <div className="learning-empty"><FileText size={27}/><h2>No guides match these filters</h2><p>Try a different search or show all resources.</p><button className="learning-secondary" onClick={() => {setQuery('');setKind('All resources');setBookmarked(false);}}>Show all</button></div>}
    {active && <div className="learning-preview-backdrop" role="presentation" onMouseDown={event => {if(event.target === event.currentTarget) setPreview(null);}}><div className="learning-preview" role="dialog" aria-modal="true" aria-label={`Preview ${active.title}`}><div className="learning-preview-header"><strong>{active.title}</strong><div><a className="learning-secondary" href={active.href} download><Download size={14}/> Download</a><button className="learning-icon-button" aria-label="Close preview" onClick={() => setPreview(null)}><X size={17}/></button></div></div><iframe src={`${active.href}#toolbar=0`} title={`PDF preview: ${active.title}`}/></div></div>}
  </>;
}
