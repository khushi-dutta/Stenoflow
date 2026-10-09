'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Bookmark, ChevronLeft, ChevronRight, Download, Maximize, MessageSquare, Search, Sparkles, X, ZoomIn, ZoomOut } from 'lucide-react';
import { Magazine } from '@/lib/magazines';
import { Document, Page, pdfjs } from 'react-pdf';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

if (typeof document !== 'undefined') {
  document.documentElement.style.setProperty('--react-pdf-text-layer', '1');
  document.documentElement.style.setProperty('--react-pdf-annotation-layer', '1');
}

export default function ReaderView({ issue, onClose }: { issue: Magazine, onClose: () => void }) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState(1.0);
  const [aiPanel, setAiPanel] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  // Persist reading progress
  useEffect(() => {
    const saved = localStorage.getItem(`reading_progress_${issue.id}`);
    if (saved) setPageNumber(parseInt(saved, 10));
  }, [issue.id]);

  useEffect(() => {
    localStorage.setItem(`reading_progress_${issue.id}`, pageNumber.toString());
  }, [pageNumber, issue.id]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function handleAiAction(prompt: string) {
    setAiLoading(true);
    setAiResponse('');
    setTimeout(() => {
      setAiLoading(false);
      setAiResponse(`Here is a simulated AI response for "${prompt}" based on Page ${pageNumber}. In a full integration, this would call your backend AI service to process the extracted text of this specific page.`);
    }, 1500);
  }

  return (
    <div className="reader-overlay">
      <div className="reader-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="icon-btn" onClick={onClose} aria-label="Close reader"><ArrowLeft size={18}/></button>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600 }}>{issue.title}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{issue.category} • {issue.month} {issue.year}</span>
          </div>
        </div>
        
        <div className="reader-header-actions">
          <button className="icon-btn" onClick={() => setAiPanel(!aiPanel)} aria-label="Ask AI"><Sparkles size={16}/></button>
          <button className="icon-btn" aria-label="Search inside"><Search size={16}/></button>
          <button className="icon-btn" aria-label="Bookmark page"><Bookmark size={16}/></button>
          <a href={issue.pdfUrl} download className="icon-btn" aria-label="Download"><Download size={16}/></a>
          <button className="icon-btn" aria-label="Fullscreen" onClick={() => document.documentElement.requestFullscreen().catch(()=>{})}><Maximize size={16}/></button>
        </div>
      </div>

      <div className="reader-content">
        <div className="reader-page-container">
          <Document 
            file={issue.pdfUrl} 
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div style={{padding: '4rem'}}>Loading PDF...</div>}
            error={<div style={{padding: '4rem'}}>Failed to load PDF.</div>}
          >
            <Page 
              pageNumber={pageNumber} 
              scale={scale} 
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        </div>

        {aiPanel && (
          <div className="reader-ai-panel">
            <div className="ai-header">
              <Sparkles size={16} color="var(--primary)"/> Ask AI (Page {pageNumber})
              <button className="icon-btn" style={{marginLeft: 'auto', border: 'none'}} onClick={() => setAiPanel(false)}><X size={14}/></button>
            </div>
            <div className="ai-body">
              {aiLoading ? <span style={{color: 'var(--muted)'}}>AI is reading the page...</span> : aiResponse || <span style={{color: 'var(--muted)'}}>Select an action below to ask the AI assistant about this page.</span>}
            </div>
            <div className="ai-actions">
              <button className="btn btn-secondary" style={{fontSize: '0.8rem', padding: '0.25rem 0.5rem'}} onClick={() => handleAiAction("Summarize this page")}>Summarize</button>
              <button className="btn btn-secondary" style={{fontSize: '0.8rem', padding: '0.25rem 0.5rem'}} onClick={() => handleAiAction("Explain in simple language")}>Explain</button>
              <button className="btn btn-secondary" style={{fontSize: '0.8rem', padding: '0.25rem 0.5rem'}} onClick={() => handleAiAction("Generate MCQs")}>Generate MCQs</button>
            </div>
          </div>
        )}
      </div>

      <div className="reader-controls">
        <button className="icon-btn" style={{border:'none'}} disabled={pageNumber <= 1} onClick={() => setPageNumber(p => Math.max(1, p - 1))}><ChevronLeft size={20}/></button>
        <span style={{ fontSize: '0.9rem', minWidth: '80px', textAlign: 'center' }}>Page {pageNumber} / {numPages || '?'}</span>
        <button className="icon-btn" style={{border:'none'}} disabled={numPages !== undefined && pageNumber >= numPages} onClick={() => setPageNumber(p => Math.min(numPages || p, p + 1))}><ChevronRight size={20}/></button>
        
        <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 0.5rem' }}/>
        
        <button className="icon-btn" style={{border:'none'}} onClick={() => setScale(s => Math.max(0.5, s - 0.25))}><ZoomOut size={18}/></button>
        <span style={{ fontSize: '0.9rem', minWidth: '50px', textAlign: 'center' }}>{Math.round(scale * 100)}%</span>
        <button className="icon-btn" style={{border:'none'}} onClick={() => setScale(s => Math.min(3.0, s + 0.25))}><ZoomIn size={18}/></button>
      </div>
    </div>
  );
}
