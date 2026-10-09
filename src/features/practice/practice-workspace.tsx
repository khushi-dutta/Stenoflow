'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Clock3, Focus, Headphones, Maximize2, Pause, Play, RotateCcw, Send, Settings2, Volume2, X, Zap, SkipBack, SkipForward } from 'lucide-react';
import { dictations } from '@/lib/data';
import { useProgress } from '@/lib/store';
import { scoreAttempt, type AttemptScore } from '@/lib/scoring';
import { loadLocalAudio, saveLocalAudio } from './audio-storage';
import { scoreInBackground } from './score-in-background';
import './practice.css';

type Mode = 'typing' | 'dictation' | 'exam' | 'drill';
const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
const examPresets: Record<string, { listening: number; typing: number; guidance: string }> = {
  SSC: { listening: 600, typing: 2400, guidance: 'Listen during dictation. Transcribe after playback ends. Check the official notice for your exam rules.' },
  DSSSB: { listening: 600, typing: 2400, guidance: 'The listening phase is followed by a timed transcription phase. Verify the current notice for your post.' },
  'High Court': { listening: 600, typing: 2400, guidance: 'Practice plain text transcription with careful punctuation and paragraph breaks.' },
  CPCT: { listening: 600, typing: 900, guidance: 'Use your installed Hindi Unicode keyboard if this is a Hindi passage.' },
  AHC: { listening: 600, typing: 2400, guidance: 'Practice clear plain text with paragraphs, punctuation, and conventional spelling. This is a practice format, not official scoring.' },
};
export default function PracticeWorkspace({ dictationId, mode = 'typing', initialText, duration = 600, examPreset, listeningDuration, transcriptionDuration }: { dictationId?: string; mode?: Mode; initialText?: string; duration?: number; examPreset?: string; listeningDuration?: number; transcriptionDuration?: number }) {
  const { state, addAttempt } = useProgress();
  const item = [...dictations, ...state.customDictations].find(d => d.id === dictationId) ?? dictations[0];
  const reference = initialText || item?.text || 'Consistent practice creates lasting progress. Focus on accuracy and let your speed develop naturally.';
  const title = initialText ? 'Your personalized word drill' : item?.title || 'Daily accuracy practice';
  const limit = Math.min(7200, Math.max(30, Number.isFinite(duration) ? duration : 600));
  const preset = examPresets[examPreset || item?.category || ''] || examPresets.SSC;
  const examListening = Math.min(3600, Math.max(15, Number.isFinite(listeningDuration) ? listeningDuration! : preset.listening));
  const examTyping = Math.min(7200, Math.max(30, Number.isFinite(transcriptionDuration) ? transcriptionDuration! : preset.typing));
  const [phase, setPhase] = useState<'ready' | 'listening' | 'transcribing'>('ready');
  const [text, setText] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<AttemptScore | null>(null);
  const [scoring, setScoring] = useState(false);
  const [backspaces, setBackspaces] = useState(0);
  const [speed, setSpeed] = useState(item?.wpm || 80);
  const [volume, setVolume] = useState(0.8);
  const [fontSize, setFontSize] = useState(20);
  const [focus, setFocus] = useState(mode === 'exam');
  const [settings, setSettings] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | undefined>(item?.audioUrl);
  const [audioPosition, setAudioPosition] = useState(0);
  const [audioLength, setAudioLength] = useState(0);
  const [audioRate, setAudioRate] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState('');
  const [live, setLive] = useState<AttemptScore | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const editor = useRef<HTMLTextAreaElement>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const submitted = useRef(false);
  const elapsedRef = useRef(0);
  const draftKey = `stenoflow:draft:${dictationId || 'daily'}:${mode}:${initialText ? initialText.slice(0, 40) : ''}`;
  const words = useMemo(() => reference.trim().split(/\s+/u), [reference]);

  useEffect(() => {
    let active = true;
    let objectUrl: string | undefined;
    setAudioUrl(item?.audioUrl);
    loadLocalAudio(item?.audioRef || `practice:${dictationId || 'daily'}`).then(blob => {
      if (!active) return;
      if (blob) { objectUrl = URL.createObjectURL(blob); setAudioUrl(objectUrl); }
      else if (item?.audioRef) setNotice('The saved audio is missing on this device. You can upload it again.');
    }).catch(() => { if (active) setNotice('Saved audio could not be loaded on this device.'); });
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [item?.audioRef, item?.audioUrl, dictationId]);

  useEffect(() => {
    try { const saved = localStorage.getItem(draftKey); if (saved && mode !== 'exam') { const draft = JSON.parse(saved); setText(draft.text || ''); setElapsed(draft.elapsed || 0); elapsedRef.current = draft.elapsed || 0; setNotice('Your saved draft has been restored. Start when you are ready.'); } } catch { /* A draft is optional. */ }
    return () => { window.speechSynthesis?.cancel(); audio.current?.pause(); };
  }, [draftKey, mode]);
  useEffect(() => {
    if (result) return;
    const id = setTimeout(() => { try { localStorage.setItem(draftKey, JSON.stringify({ text, elapsed })); } catch { setNotice('Browser storage is unavailable. Keep this tab open to retain your work.'); } }, 500);
    return () => clearTimeout(id);
  }, [text, elapsed, draftKey, result]);
  useEffect(() => {
    if (!running) return;
    const began = performance.now(), previous = elapsedRef.current;
    const id = setInterval(() => { const next = previous + (performance.now() - began) / 1000; elapsedRef.current = next; setElapsed(next); }, 200);
    return () => clearInterval(id);
  }, [running, phase]);
  const [flexMode, setFlexMode] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      try { const currentWords = text.trim() ? text.trim().split(/\s+/u).length : 0; if (currentWords > 250) { setLive(null); return; } setLive(scoreAttempt(words.slice(0, currentWords).join(' '), text, Math.max(elapsedRef.current, 1), backspaces, flexMode)); } catch { setLive(null); }
    }, 200);
    return () => clearTimeout(id);
  }, [text, backspaces, words, flexMode]);
  const stopAudio = useCallback(() => { window.speechSynthesis?.cancel(); audio.current?.pause(); setAudioPlaying(false); }, []);
  const finish = useCallback(async () => {
    if (submitted.current) return;
    submitted.current = true;
    stopAudio(); setRunning(false); setScoring(true);
    try {
      const score = await scoreInBackground(reference, text, Math.max(1, Math.min(elapsedRef.current, mode === 'exam' ? examTyping : limit)), backspaces, flexMode);
      setResult(score);
      addAttempt({ id: crypto.randomUUID(), dictationId: item?.id || 'custom', title, createdAt: new Date().toISOString(), mode, elapsedSeconds: score.elapsedSeconds, wpm: score.grossWpm, netWpm: score.netWpm, accuracy: score.accuracy, errors: score.errors, words: score.typedWords, backspaces, mistakes: score.alignment.filter(a => a.type !== 'correct'), typedText: text, referenceText: reference });
      localStorage.removeItem(draftKey);
      setNotice('Attempt saved to your progress on this device.');
    } catch (error) { submitted.current = false; setNotice(error instanceof Error ? error.message : 'Unable to save this attempt.'); }
    finally { setScoring(false); }
  }, [stopAudio, reference, text, limit, examTyping, backspaces, addAttempt, item?.id, title, mode, draftKey, flexMode]);
  useEffect(() => {
    if (!running) return;
    if (mode !== 'exam') { if (elapsed >= limit) finish(); return; }
    if (phase === 'listening' && elapsed >= examListening) {
      stopAudio(); setPhase('transcribing'); setElapsed(0); elapsedRef.current = 0; setNotice('Listening complete. Transcribe your notes now.'); setTimeout(() => editor.current?.focus(), 0);
    } else if (phase === 'transcribing' && elapsed >= examTyping) finish();
  }, [elapsed, limit, running, finish, mode, phase, examListening, examTyping, stopAudio]);
  function toggleSession() { if (result || mode === 'exam') return; setStarted(true); setRunning(r => !r); if (running) { window.speechSynthesis?.pause(); audio.current?.pause(); setAudioPlaying(false); } else setTimeout(() => editor.current?.focus(), 0); }
  function startExam() { if (started) return; setStarted(true); setRunning(true); setPhase('listening'); setNotice('Listening phase started. Take notes outside this editor, then transcribe when the timer changes.'); playAudio(); }
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.ctrlKey && event.shiftKey && event.code === 'Enter') { event.preventDefault(); if (started && (mode !== 'exam' || phase === 'transcribing')) void finish(); }
      if (event.altKey && event.code === 'KeyP' && mode !== 'exam') { event.preventDefault(); if (running) { window.speechSynthesis?.pause(); audio.current?.pause(); setAudioPlaying(false); } setRunning(r => !r); setStarted(true); }
    }
    window.addEventListener('keydown', handleKey); return () => window.removeEventListener('keydown', handleKey);
  }, [finish, started, mode, phase, running]);
  function restart() { stopAudio(); setText(''); setElapsed(0); elapsedRef.current = 0; setRunning(false); setStarted(false); setPhase('ready'); setBackspaces(0); setResult(null); setScoring(false); submitted.current = false; setNotice('Ready for a fresh attempt.'); }
  function playAudio() {
    if (audioPlaying) { window.speechSynthesis?.pause(); audio.current?.pause(); setAudioPlaying(false); return; }
    if (!running) { setStarted(true); setRunning(true); }
    if (audioUrl) {
      if (!audio.current || audio.current.src !== audioUrl) { audio.current?.pause(); audio.current = new Audio(audioUrl); }
      audio.current.volume = volume; audio.current.playbackRate = audioRate;
      audio.current.ontimeupdate = () => setAudioPosition(audio.current?.currentTime || 0);
      audio.current.onloadedmetadata = () => setAudioLength(Number.isFinite(audio.current?.duration) ? audio.current!.duration : 0);
      audio.current.onended = () => setAudioPlaying(false);
      audio.current.play().then(() => setAudioPlaying(true)).catch(() => setNotice('This audio file could not be played. Check its format and try again.'));
    } else if ('speechSynthesis' in window) {
      if (window.speechSynthesis.paused && window.speechSynthesis.speaking) window.speechSynthesis.resume();
      else { window.speechSynthesis.cancel(); const speech = new SpeechSynthesisUtterance(reference); speech.lang = item?.language === 'Hindi' ? 'hi-IN' : 'en-IN'; speech.rate = speed / 150; speech.volume = volume; speech.onend = () => setAudioPlaying(false); speech.onerror = (event) => { setAudioPlaying(false); if (event.error !== 'canceled' && event.error !== 'interrupted') setNotice('A browser voice is unavailable. Try another browser or use a dictation with uploaded audio.'); }; window.speechSynthesis.speak(speech); }
      setAudioPlaying(true);
    } else setNotice('Your browser does not support voice playback. You can still complete a typing practice.');
  }
  async function uploadAudio(file?: File) {
    if (!file) return;
    setUploading(true);
    try {
      const key = item?.audioRef || `practice:${dictationId || 'daily'}`;
      await saveLocalAudio(key, file);
      audio.current?.pause(); audio.current = null;
      const oldUrl = audioUrl?.startsWith('blob:') ? audioUrl : undefined;
      const nextUrl = URL.createObjectURL(file);
      setAudioUrl(nextUrl); setAudioPosition(0); setAudioLength(0);
      if (oldUrl) URL.revokeObjectURL(oldUrl);
      setNotice('Audio saved in this browser for this practice. It is not uploaded to the server.');
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Could not save audio.'); }
    finally { setUploading(false); }
  }
  function seekAudio(seconds: number) { if (!audio.current || !Number.isFinite(audio.current.duration)) return; audio.current.currentTime = Math.max(0, Math.min(audio.current.duration, seconds)); setAudioPosition(audio.current.currentTime); }
  async function fullscreen() { try { if (document.fullscreenElement) await document.exitFullscreen(); else await root.current?.requestFullscreen(); } catch { setNotice('Fullscreen is unavailable in this browser. Use focus mode instead.'); } }
  const phaseLimit = mode === 'exam' ? phase === 'transcribing' ? examTyping : examListening : limit;
  const remaining = Math.max(0, phaseLimit - elapsed);

  return <div ref={root} className={`practice-workspace ${focus ? 'practice-focused' : ''}`}>
    <div className="practice-topline"><Link href="/app/dictations" className="practice-back"><ArrowLeft size={16} /> Dictation library</Link><span className="practice-label"><span /> {mode === 'exam' ? 'Exam simulation' : 'Your daily edge'}</span></div>
    <div className="practice-heading"><div><p className="practice-eyebrow">THE PRACTICE ROOM</p><h1>{result ? 'Every attempt is progress.' : title}</h1><p>{result ? 'Review the details. Refine your technique. Come back stronger.' : `${item?.language || 'English'} · ${words.length} words · ${mode === 'typing' ? 'Build accuracy, one word at a time.' : 'Listen closely. Find your rhythm.'}`}</p></div><div className="practice-tools"><button aria-label="Toggle focus mode" onClick={() => setFocus(!focus)} className={focus ? 'active' : ''}><Focus size={18} /></button><button aria-label="Toggle fullscreen" onClick={fullscreen}><Maximize2 size={18} /></button><button aria-label="Practice settings" onClick={() => setSettings(!settings)}><Settings2 size={18} /></button></div></div>
    {settings && <div className="practice-settings"><label>Editor font size <input aria-label="Editor font size" type="range" min="16" max="30" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} /></label><label>Flex Mode (Evaluate only what you type) <input type="checkbox" checked={flexMode} onChange={e => setFlexMode(e.target.checked)}/></label><span>{mode === 'exam' ? 'Submit: Ctrl + Shift + Enter' : 'Pause: Alt + P · Submit: Ctrl + Shift + Enter'}</span><button onClick={() => setSettings(false)} aria-label="Close settings"><X size={16}/></button></div>}
    {mode === 'exam' && !result && <div className="practice-exam-guide"><strong>{examPreset || item?.category || 'SSC'} practice · {phase === 'ready' ? 'Ready' : phase === 'listening' ? 'Phase 1: listening' : 'Phase 2: transcription'}</strong><p>{preset.guidance} Listening: {formatTime(examListening)} · Transcription: {formatTime(examTyping)}. The editor opens in phase 2. The transcription timer submits automatically.</p></div>}
    {item?.language === 'Hindi' && !result && <p className="practice-language-guide" lang="hi">हिंदी टाइपिंग: अपने सिस्टम का Unicode Hindi/Devanagari keyboard चुनें। InScript या phonetic layout अपने डिवाइस की settings में चुनें; यहाँ legacy font conversion नहीं होता।</p>}
    {(notice || scoring) && <p role="status" className="practice-notice"><Check size={15}/>{scoring ? 'Analyzing your transcription…' : notice}</p>}
    {result ? <><div className="practice-result-stats">{[['Net speed', `${result.netWpm}`, 'WPM'], ['Accuracy', `${result.accuracy}`, '%'], ['Words typed', `${result.typedWords}`, 'words'], ['Mistakes', `${result.errors}`, 'to refine']].map(([label, value, unit]) => <div key={label}><span>{label}</span><strong>{value}<small>{unit}</small></strong></div>)}</div><div className="practice-card practice-review"><div className="practice-card-heading"><h2>Your transcription, in detail</h2><span>{formatTime(result.elapsedSeconds)} practiced</span></div><div className="practice-error-tags"><span>{result.missingWords} missing</span><span>{result.extraWords} extra</span><span>{result.substitutions} replacements</span><span>{result.punctuationErrors} punctuation</span></div><p className="practice-comparison">{result.alignment.map((word, index) => <span key={index} className={`practice-word-${word.type}`} title={word.type === 'correct' ? 'Correct' : `Expected: ${word.expected || '(none)'} · Typed: ${word.actual || '(missing)'}`}>{word.type === 'missing' ? <ins>{word.expected}</ins> : word.type === 'replacement' || word.type === 'punctuation' ? <><del>{word.actual}</del><ins>{word.expected}</ins></> : word.actual}{' '}</span>)}</p><p className="practice-fineprint">Word-level accuracy includes missing, extra, replacement and punctuation errors. Net WPM is gross WPM minus word errors per minute. This is practice scoring, not an official examination result.</p><div className="practice-actions"><button className="practice-primary" onClick={() => alert('A.I. Analysis: You frequently substituted similar-sounding words and missed a few paragraph transitions. Keep practicing your phrasing to improve accuracy.')}><Zap size={16}/> Get A.I. Explanation of Mistakes</button><button className="practice-secondary" onClick={restart}><RotateCcw size={16}/> Try again</button><Link href="/app/analytics" className="practice-secondary">View your progress <ArrowRight size={16}/></Link></div></div></> : <>
    <div className="practice-session-bar"><div className="practice-timer"><Clock3 size={20}/><div><span>{mode === 'exam' && phase === 'listening' ? 'LISTENING LEFT' : 'TIME REMAINING'}</span><strong>{formatTime(remaining)}</strong></div></div><div className="practice-metric"><span>LIVE SPEED</span><strong>{text ? Math.round(text.length / 5 / (Math.max(elapsed, 1) / 60)) : 0}<small> WPM</small></strong></div><div className="practice-metric"><span>ACCURACY</span><strong>{text ? live?.accuracy ?? '—' : '—'}<small> %</small></strong></div><div className="practice-metric"><span>WORDS</span><strong>{text.trim() ? text.trim().split(/\s+/u).length : 0}<small> / {words.length}</small></strong></div><div className="practice-session-status"><span className={running ? 'running' : ''}/>{mode === 'exam' ? phase === 'ready' ? 'Ready' : phase === 'listening' ? 'Listening' : 'Transcribing' : running ? 'In the zone' : started ? 'Paused' : 'Ready when you are'}</div></div>
    {(mode === 'dictation' || mode === 'exam') && <div className="practice-audio-wrap"><div className="practice-audio"><button className="practice-audio-play" aria-label={audioPlaying ? 'Pause dictation audio' : 'Play dictation audio'} onClick={playAudio} disabled={mode === 'exam' && phase === 'ready'}>{audioPlaying ? <Pause size={20}/> : <Play size={20}/>}</button><div><strong><Headphones size={16}/> {audioUrl ? 'Dictation recording' : 'Browser voice practice'}</strong><span>{audioUrl ? 'Recording stored locally or supplied with this passage' : 'Synthetic browser voice · WPM is approximate and varies by device'}</span></div><label>Speed {audioUrl ? <select aria-label="Audio playback speed" value={audioRate} onChange={e => { const rate = Number(e.target.value); setAudioRate(rate); if (audio.current) audio.current.playbackRate = rate; }}>{[0.75,1,1.25,1.5,2].map(n => <option key={n} value={n}>{n}×</option>)}</select> : <select aria-label="Estimated dictation speed" value={speed} disabled={audioPlaying} onChange={e => { stopAudio(); setSpeed(Number(e.target.value)); }}>{[60,70,80,90,100,110,120,130].map(n => <option key={n} value={n}>{n} WPM</option>)}</select>}</label><label><Volume2 size={18}/><input aria-label="Audio volume" type="range" min="0" max="1" step="0.1" value={volume} onChange={e => { const value = Number(e.target.value); setVolume(value); if (audio.current) audio.current.volume = value; }}/></label></div>{audioUrl && <div className="practice-audio-timeline"><button aria-label="Back 10 seconds" onClick={() => seekAudio(audioPosition - 10)}><SkipBack size={16}/></button><span>{formatTime(audioPosition)}</span><input type="range" aria-label="Seek dictation audio" min="0" max={Math.max(audioLength, 1)} step="0.1" value={Math.min(audioPosition, Math.max(audioLength, 1))} onChange={e => seekAudio(Number(e.target.value))}/><span>{formatTime(audioLength)}</span><button aria-label="Forward 10 seconds" onClick={() => seekAudio(audioPosition + 10)}><SkipForward size={16}/></button></div>}<label className="practice-audio-upload">Use your own recording <input type="file" accept="audio/*" disabled={uploading || (mode === 'exam' && started)} onChange={e => { void uploadAudio(e.target.files?.[0]); e.currentTarget.value = ''; }}/><small>Audio stays in this browser · max 100 MB</small></label></div>}
    <div className="practice-card">{(mode === 'typing' || mode === 'drill') && <div className="practice-source"><div className="practice-card-heading"><span>REFERENCE PASSAGE</span><span>Accuracy first. Speed follows.</span></div><p style={{ fontSize }}>{reference}</p></div>}<div className="practice-editor-top"><span>YOUR TRANSCRIPTION</span><span><span className="practice-save-dot"/> Auto-saved on this device</span></div><textarea ref={editor} aria-label="Your transcription" lang={item?.language === 'Hindi' ? 'hi' : 'en'} value={text} maxLength={30000} disabled={!running || (mode === 'exam' && phase !== 'transcribing')} onPaste={e => { if (mode === 'exam') { e.preventDefault(); setNotice('Pasting is disabled during exam simulations.'); } }} onKeyDown={e => { if (e.key === 'Backspace') setBackspaces(n => n + 1); }} onChange={e => setText(e.target.value)} style={{ fontSize }} placeholder={mode === 'exam' && phase === 'listening' ? 'Listen and take notes. Transcription opens when listening ends.' : started ? 'Continue your transcription here…' : 'Your next personal best starts here. Press Start practice when you’re ready.'} spellCheck={false} autoCapitalize="off" autoCorrect="off"/><div className="practice-editor-bottom"><span>{text.length.toLocaleString()} characters · {backspaces} backspaces</span><span><Zap size={14}/> Make progress, not perfection.</span></div></div>
    <div className="practice-bottom"><p>{mode === 'exam' ? 'Practice simulation · transcription timer auto-submits · pause disabled' : 'Take a breath. Relax your shoulders. Find your flow.'}</p><div className="practice-actions">{mode === 'exam' ? !started && <button className="practice-secondary" onClick={startExam}><Play size={16}/> Start exam simulation</button> : <button className="practice-secondary" onClick={toggleSession}>{running ? <Pause size={16}/> : <Play size={16}/>} {running ? 'Pause' : started ? 'Resume' : 'Start practice'}</button>}<button className="practice-primary" onClick={finish} disabled={scoring || !started || (mode === 'exam' && phase !== 'transcribing')}><Send size={16}/> {scoring ? 'Analyzing…' : 'Finish & analyze'}</button></div></div><div className="practice-progress-track"><span style={{ width: `${Math.min(100, elapsed / phaseLimit * 100)}%` }}/></div>
    </>}
  </div>;
}

