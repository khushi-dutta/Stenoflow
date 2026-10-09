'use client';

import {useState, type FormEvent} from 'react';
import Link from 'next/link';
import {ArrowUpRight, FileAudio, FileText, FolderPlus, Plus, Trash2, Upload} from 'lucide-react';
import {useProgress} from '@/lib/store';
import {deleteLocalAudio, saveLocalAudio} from '@/features/practice/audio-storage';

export default function PersonalPassages() {
  const progress = useProgress();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [folder, setFolder] = useState('');
  const [folderName, setFolderName] = useState('');
  const [language, setLanguage] = useState<'English'|'Hindi'>('English');
  const [audio, setAudio] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function importText(file?: File) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.txt') || file.size > 500_000) {setMessage('Choose a .txt file smaller than 500 KB.');return;}
    setText(await file.text());
    if (!title) setTitle(file.name.replace(/\.txt$/i, ''));
    setMessage('Text loaded. Review it, then save your dictation.');
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !text.trim()) {setMessage('Add a title and passage before saving.');return;}
    if (text.length > 30_000 || text.trim().split(/\s+/u).length > 3_000) {setMessage('Use a passage shorter than 30,000 characters and 3,000 words.');return;}
    if (audio && (!audio.type.startsWith('audio/') || audio.size > 100 * 1024 * 1024)) {setMessage('Choose an audio file of 100 MB or smaller.');return;}
    setBusy(true);
    const id = crypto.randomUUID();
    try {
      const audioRef = audio ? await saveLocalAudio(id, audio) : undefined;
      progress.addDictation({id, title:title.trim(), text:text.trim(), description:'Your personal practice passage', language, wpm:80, category:'Personal', difficulty:'Intermediate', premium:false, ...(folder ? {folderId:folder}:{}), ...(audioRef ? {audioRef}:{})});
      setTitle('');setText('');setAudio(null);
      setMessage(audioRef ? 'Passage and audio saved in this browser. They are ready to practice.' : 'Passage saved in this browser and ready to practice.');
    } catch(error) {setMessage(error instanceof Error ? error.message : 'Could not save the audio.');}
    finally {setBusy(false);}
  }

  async function remove(id: string, audioRef?: string) {
    if (deleteId !== id) {setDeleteId(id);return;}
    try {
      if (audioRef) await deleteLocalAudio(audioRef);
      progress.deleteDictation(id);
      setDeleteId(null);
      setMessage('Passage deleted from this browser.');
    } catch(error) {setMessage(error instanceof Error ? error.message : 'Could not delete this passage.');}
  }

  const visible = progress.state.customDictations.filter(item => !folder || item.folderId === folder);
  return <div className="learning-folder-layout">
    <div className="learning-panel">
      <div className="learning-panel-heading"><h2>Your folders</h2><FolderPlus size={20}/></div>
      <form className="learning-inline-form" onSubmit={event => {event.preventDefault();if(folderName.trim()){progress.addFolder(folderName.trim());setFolderName('');}}}><input aria-label="New folder name" placeholder="New folder name" maxLength={60} value={folderName} onChange={event => setFolderName(event.target.value)}/><button className="learning-icon-button" aria-label="Create folder" type="submit"><Plus size={18}/></button></form>
      <button className={`learning-folder-row ${folder === '' ? 'is-active' : ''}`} onClick={() => setFolder('')}>All dictations<span>{progress.state.customDictations.length}</span></button>
      {progress.state.folders.map(item => <div className="learning-folder-item" key={item.id}><button className={`learning-folder-row ${folder === item.id ? 'is-active' : ''}`} onClick={() => setFolder(item.id)}>{item.name}<span>{progress.state.customDictations.filter(d => d.folderId === item.id).length}</span></button><button className="learning-icon-button" aria-label={`Delete folder ${item.name}`} title="Delete folder; passages become unfiled" onClick={() => {progress.deleteFolder(item.id);if(folder===item.id)setFolder('');}}><Trash2 size={14}/></button></div>)}
    </div>
    <div>
      <div className="learning-panel"><h2>Add your own dictation</h2><p>Paste a passage or import a text file. Add an optional recording for local playback. Audio stays on this device.</p>
        <form className="learning-form" onSubmit={event => void save(event)}>
          <label>Title<input value={title} onChange={event => setTitle(event.target.value)} maxLength={120} placeholder="e.g. My daily editorial"/></label>
          <div className="learning-form-row"><label>Language<select value={language} onChange={event => setLanguage(event.target.value as 'English'|'Hindi')}><option>English</option><option>Hindi</option></select></label><label>Save in<select value={folder} onChange={event => setFolder(event.target.value)}><option value="">Unfiled</option>{progress.state.folders.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label></div>
          <label>Passage<textarea rows={6} value={text} onChange={event => setText(event.target.value)} placeholder="Paste your practice text here…"/></label>
          <div className="learning-form-row"><label className="learning-upload"><Upload size={16}/> Import .txt<input type="file" accept=".txt,text/plain" onChange={event => void importText(event.target.files?.[0])}/></label><label className="learning-upload"><FileAudio size={16}/> Optional audio (up to 100 MB)<input type="file" accept="audio/*,.mp3,.m4a,.wav,.ogg,.webm" onChange={event => setAudio(event.target.files?.[0] ?? null)}/></label></div>
          <button className="learning-primary" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save dictation'}<Plus size={16}/></button>
        </form>{message && <p role="status" className="learning-message">{message}</p>}
      </div>
      <div className="learning-panel" style={{marginTop:18}}><h2>Your saved passages</h2>{visible.map(item => <div className="learning-saved-row" key={item.id}>{item.audioRef ? <FileAudio size={19}/> : <FileText size={19}/>}<div><strong>{item.title}</strong><span>{item.language} · {item.text.split(/\s+/).length} words{item.audioRef ? ' · recording attached' : ''}</span></div><select aria-label={`Folder for ${item.title}`} value={item.folderId ?? ''} onChange={event => progress.moveToFolder(item.id,event.target.value)}><option value="">Unfiled</option>{progress.state.folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select><Link href={`/app/practice?id=${item.id}&mode=dictation`} className="learning-icon-button" aria-label={`Practice ${item.title}`}><ArrowUpRight size={18}/></Link><button className="learning-icon-button" aria-label={deleteId === item.id ? `Confirm delete ${item.title}` : `Delete ${item.title}`} title={deleteId === item.id ? 'Click again to confirm' : 'Delete passage'} onClick={() => void remove(item.id,item.audioRef)}><Trash2 size={17}/></button></div>)}{!visible.length && <p>{folder ? 'No passages in this folder.' : 'Your passages will appear here after you save one.'}</p>}</div>
    </div>
  </div>;
}
