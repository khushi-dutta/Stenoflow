'use client';
import {useEffect,useMemo,useRef,useState,type KeyboardEvent} from 'react';
import Link from 'next/link';
import {ArrowLeft,ArrowRight,CheckCircle2,Clock3,Keyboard,RotateCcw,Target} from 'lucide-react';
import {useProgress} from '@/lib/store';
import {scoreAttempt} from '@/lib/scoring';
import {courseLayouts,courseUrl,isCourseLayout,type CourseLayoutId} from './course-config';
import {typingLessons,type CourseLesson} from './curriculum';
import {convertKeystrokes,getTypingLayout} from './layouts';
import KeyboardGuide,{physicalCharacter} from './keyboard-guide';
import {lessonMetrics,passesLesson} from './lesson-metrics';
import './typing-course.css';

type InputMode='keys'|'unicode';
const displayTime=(seconds:number)=>`${Math.floor(seconds/60).toString().padStart(2,'0')}:${Math.floor(seconds%60).toString().padStart(2,'0')}`;

export default function TypingCourse({layoutParam,lessonParam}:{layoutParam:string|null;lessonParam:string|null}){
 const progress=useProgress();
 const layoutId:CourseLayoutId=isCourseLayout(layoutParam)?layoutParam:'en_qwerty';
 const layout=courseLayouts.find(item=>item.id===layoutId)!;
 const lessons=typingLessons.filter(item=>item.layoutId===layoutId);
 const lesson=lessonParam?lessons.find(item=>item.id===lessonParam):undefined;
 const complete=lessons.filter(item=>progress.state.lessonIds.includes(item.id)).length;
 const [selectedModule,setSelectedModule]=useState('All modules');
 if(!progress.ready)return <div className="loading-shell"><div className="skeleton"/><div className="skeleton"/></div>;
 return <section className="typing-course">
  <div className="typing-course-head"><div><p className="typing-overline">TYPING SCHOOL / {layout.language.toUpperCase()}</p><h1>{lesson?lesson.title:layout.name}</h1><p>{lesson?lesson.description:layout.description}</p></div>{lesson&&<Link className="typing-back" href={courseUrl(layoutId)}><ArrowLeft size={16}/> All lessons</Link>}</div>
  <nav className="typing-layout-picker" aria-label="Keyboard layout courses">{courseLayouts.map(item=><Link key={item.id} href={courseUrl(item.id)} className={item.id===layoutId?'is-active':''} aria-current={item.id===layoutId?'page':undefined}><span>{item.label}</span><small>{item.language}</small></Link>)}</nav>
  {lesson?<LessonPlayer key={lesson.id} lesson={lesson} layoutId={layoutId}/>:<>
   <div className="typing-course-intro"><div><p className="typing-overline">YOUR COURSE</p><h2>Learn the keys.<br/><em>Build your rhythm.</em></h2><p>{layout.note}</p></div><div className="typing-course-progress"><strong>{complete}<span> / {lessons.length}</span></strong><span>Lessons completed</span><div className="typing-progress-track"><i style={{width:`${lessons.length?complete/lessons.length*100:0}%`}}/></div></div></div>
   <KeyboardGuide layoutId={layoutId}/>
   <div className="typing-modules"><div><h2>Lessons</h2><p>Start at the beginning or choose the skill you want to strengthen.</p></div><div className="typing-module-tabs" role="group" aria-label="Filter lessons by module">{['All modules',...new Set(lessons.map(item=>item.module))].map(module=><button type="button" className={module===selectedModule?'is-active':''} key={module} onClick={()=>setSelectedModule(module)}>{module}</button>)}</div></div>
   {Array.from(new Set(lessons.map(item=>item.module))).filter(module=>selectedModule==='All modules'||module===selectedModule).map((module,index)=><section className="typing-module" key={module}><div className="typing-module-heading"><div><span>MODULE {String(index+1).padStart(2,'0')}</span><h3>{module}</h3></div><span>{lessons.filter(item=>item.module===module&&progress.state.lessonIds.includes(item.id)).length} / {lessons.filter(item=>item.module===module).length} complete</span></div><div className="typing-lesson-list">{lessons.filter(item=>item.module===module).map((item,order)=><Link key={item.id} href={courseUrl(layoutId,item.id)} className="typing-lesson-row"><span className={`typing-lesson-index ${progress.state.lessonIds.includes(item.id)?'is-complete':''}`}>{progress.state.lessonIds.includes(item.id)?<CheckCircle2 size={18}/>:String(order+1).padStart(2,'0')}</span><div><h4>{item.title}</h4><p>{item.description}</p></div><span className="typing-lesson-meta">{Math.round(item.durationSeconds/60)} min · {item.targetAccuracy}% accuracy</span><ArrowRight size={18}/></Link>)}</div></section>)}
  </>}
 </section>;
}

function LessonPlayer({lesson,layoutId}:{lesson:CourseLesson;layoutId:CourseLayoutId}){
 const progress=useProgress();
 const input=useRef<HTMLTextAreaElement>(null);
 const [inputMode,setInputMode]=useState<InputMode>('keys');
 const [raw,setRaw]=useState('');const [unicode,setUnicode]=useState('');const [activeKey,setActiveKey]=useState('');const [running,setRunning]=useState(false);const [elapsed,setElapsed]=useState(0);const [finished,setFinished]=useState(false);const [backspaces,setBackspaces]=useState(0);
 const [notice,setNotice]=useState('');
 const displayed=inputMode==='keys'?convertKeystrokes(layoutId,raw):unicode;
 const metrics=useMemo(()=>lessonMetrics(lesson.text,displayed,Math.max(1,elapsed),finished),[lesson.text,displayed,elapsed,finished]);
 const passed=finished&&passesLesson(metrics,lesson.targetWpm,lesson.targetAccuracy);
 useEffect(()=>{if(!running)return;const timer=window.setInterval(()=>setElapsed(value=>value+1),1000);return()=>window.clearInterval(timer)},[running]);
 useEffect(()=>{if(running&&elapsed>=lesson.durationSeconds)finish();},[elapsed,running,lesson.durationSeconds]);
 useEffect(()=>{if(running&&displayed.length>=lesson.text.length&&metrics.accuracy>=95)finish();},[displayed,running,lesson.text.length,metrics.accuracy]);

 useEffect(() => {
   const container = document.querySelector('.monkey-text') as HTMLElement;
   const caret = document.querySelector('.caret') as HTMLElement;
   if (container && caret) {
     const containerRect = container.getBoundingClientRect();
     const caretRect = caret.getBoundingClientRect();
     const offset = caretRect.top - containerRect.top + container.scrollTop;
     container.scrollTop = offset - container.clientHeight / 2;
   }
 }, [displayed, running]);
 function start(){
  if(finished)return;
  setRunning(true);
  setTimeout(()=>input.current?.focus(),30);
  if(lesson.mode === 'dictation') {
    const u = new SpeechSynthesisUtterance(lesson.text);
    u.lang = layoutId === 'en_qwerty' ? 'en-US' : 'hi-IN';
    u.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }
}
 function finish(){if(finished)return;window.speechSynthesis.cancel();setRunning(false);setFinished(true);const seconds=Math.max(1,elapsed);const result=lessonMetrics(lesson.text,displayed,seconds,true);const scored=scoreAttempt(lesson.text,displayed,seconds,backspaces);progress.addAttempt({id:crypto.randomUUID(),dictationId:lesson.id,title:lesson.title,createdAt:new Date().toISOString(),mode:'typing',elapsedSeconds:seconds,wpm:result.wpm,netWpm:result.wpm,accuracy:result.accuracy,errors:result.errors,words:scored.typedWords,backspaces,mistakes:scored.alignment.filter(word=>word.type!=='correct').map(word=>({expected:word.expected,actual:word.actual,type:word.type})),typedText:displayed,referenceText:lesson.text});if(passesLesson(result,lesson.targetWpm,lesson.targetAccuracy))progress.completeLesson(lesson.id)}
 function reset(){window.speechSynthesis.cancel();setRaw('');setUnicode('');setElapsed(0);setFinished(false);setRunning(false);setBackspaces(0);setNotice('')}
 function changeMode(mode:InputMode){if(running||raw||unicode){setNotice('Restart this lesson before changing input mode.');return}setInputMode(mode);setNotice('')}
 function addKey(key:string){if(!running||finished)return;if(key==='Backspace'){setRaw(value=>value.slice(0,-1));setBackspaces(value=>value+1)}else setRaw(value=>value+key);setActiveKey(key);input.current?.focus()}
 function onKeyDown(event:KeyboardEvent<HTMLTextAreaElement>){if(inputMode!=='keys'||!running)return;if(event.ctrlKey||event.metaKey||event.altKey)return;if(event.key==='Backspace'){event.preventDefault();addKey('Backspace');return}const key=physicalCharacter(event);if(key){event.preventDefault();addKey(key);return}if(event.key==='Enter'){event.preventDefault();addKey('\n')}}
 return <>
  <div className="typing-lesson-intro"><div><p className="typing-overline">{lesson.module.toUpperCase()}</p><h2>{lesson.title}</h2><p>{lesson.description}</p><ul>{lesson.instructions.map(item=><li key={item}>{item}</li>)}</ul></div><div className="typing-lesson-goal"><span>LESSON TARGET</span><strong>{lesson.targetAccuracy}%</strong><small>accuracy &middot; {lesson.targetWpm} WPM</small><p>Complete at least 95% of the passage within {Math.round(lesson.durationSeconds/60)} minutes.</p></div></div>
  <div className="typing-lesson-toolbar"><div className="typing-mode-select" role="group" aria-label="Input method"><button type="button" className={inputMode==='keys'?'is-active':''} onClick={()=>changeMode('keys')}>Built-in {layoutId==='hi_krutidev'?'legacy keys':'keyboard'}</button><button type="button" className={inputMode==='unicode'?'is-active':''} onClick={()=>changeMode('unicode')}>System Unicode input</button></div><span><Clock3 size={16}/>{displayTime(Math.max(0,lesson.durationSeconds-elapsed))} remaining</span></div>
  {notice&&<p className="typing-notice" role="status">{notice}</p>}
  {layoutId==='hi_krutidev'&&<p className="typing-notice">KrutiDev uses legacy glyph order. Type its physical key sequence below; the preview converts it to Unicode for feedback. Results do not export a KrutiDev font document.</p>}
  
  {(!lesson.mode || lesson.mode === 'practice') && (
    <div className="typing-exercise monkey-type">
      <div className="typing-exercise-head"><span>TYPE THE PASSAGE</span><span>{metrics.completion}% complete</span></div>
      <div className={`monkey-text ${running ? 'is-running' : ''}`} onClick={() => { if (!finished) { if (!running) start(); else input.current?.focus(); } }} lang={layoutId==='en_qwerty'?'en':'hi'}>
        {lesson.text.split(' ').map((word, wordIdx, wordsArr) => {
          const wordStartIdx = wordsArr.slice(0, wordIdx).reduce((acc, w) => acc + w.length + 1, 0);
          return (
            <div key={wordIdx} className="monkey-word">
              {word.split('').map((char, charIdx) => {
                const i = wordStartIdx + charIdx;
                let state = '';
                if (i < displayed.length) {
                  state = displayed[i] === char ? 'correct' : 'incorrect';
                }
                return (
                  <span key={i} className={`char ${state}`}>
                    {i === displayed.length && running && <span className="caret"></span>}
                    {char}
                  </span>
                );
              })}
              {wordIdx < wordsArr.length - 1 && (
                <span className={`char space ${wordStartIdx + word.length < displayed.length ? (displayed[wordStartIdx + word.length] === ' ' ? 'correct' : 'incorrect') : ''}`}>
                  {wordStartIdx + word.length === displayed.length && running && <span className="caret"></span>}
                  {' '}
                </span>
              )}
            </div>
          );
        })}
        {displayed.length === lesson.text.length && running && <span className="caret end-caret"></span>}
      </div>
      <textarea ref={input} value={inputMode==='keys'?raw:unicode} onChange={event=>{if(inputMode==='keys')setRaw(event.target.value);else setUnicode(event.target.value)}} onKeyDown={onKeyDown} onPaste={event=>{event.preventDefault();setNotice('Paste is disabled in lessons so the result measures your typing.')}} disabled={!running||finished} aria-label={inputMode==='keys'?'Type physical keyboard keys':'Type Unicode text'} lang={inputMode==='unicode'&&layoutId!=='en_qwerty'?'hi':'en'} spellCheck={false} autoCorrect="off" autoCapitalize="off" className="monkey-hidden-input" style={{ top: 0, left: 0 }}/>
      {inputMode==='keys'&&layoutId!=='en_qwerty'&&<div className="typing-preview"><span>UNICODE PREVIEW</span><p lang="hi">{displayed||'आपकी टाइपिंग यहाँ दिखेगी'}</p></div>}
    </div>
  )}

  {lesson.mode === 'dictation' && (
    <div className="typing-exercise">
      <div className="typing-exercise-head">
        <span>AUDIO DICTATION</span>
        <span>{metrics.completion}% complete</span>
      </div>
      <div style={{ padding: '40px 23px', textAlign: 'center', background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: '24px', marginBottom: '10px', color: running ? 'var(--primary)' : 'var(--ink)' }}>
          {running ? '🔊 Dictation playing...' : '🎧 Ready for dictation'}
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
          {running ? 'Type exactly what you hear in the box below.' : 'Press "Start lesson" to begin the audio.'}
        </p>
      </div>
      <textarea ref={input} value={inputMode==='keys'?raw:unicode} onChange={event=>{if(inputMode==='keys')setRaw(event.target.value);else setUnicode(event.target.value)}} onKeyDown={onKeyDown} onPaste={event=>{event.preventDefault();setNotice('Paste is disabled.')}} disabled={!running||finished} aria-label="Type what you hear" lang={inputMode==='unicode'&&layoutId!=='en_qwerty'?'hi':'en'} spellCheck={false} autoCorrect="off" autoCapitalize="off" placeholder={running?'Start typing here...':''} />
      {inputMode==='keys'&&layoutId!=='en_qwerty'&&<div className="typing-preview"><span>UNICODE PREVIEW</span><p lang="hi">{displayed||'आपकी टाइपिंग यहाँ दिखेगी'}</p></div>}
    </div>
  )}

  {lesson.mode === 'exam' && (
    <div className="typing-exercise">
      <div className="typing-exercise-head">
        <span>EXAM SIMULATION - NO LIVE FEEDBACK</span>
        <span>{metrics.completion}% complete</span>
      </div>
      <p className="typing-reference" lang={layoutId==='en_qwerty'?'en':'hi'}>
        {lesson.text}
      </p>
      <div className="typing-exercise-head">
        <span>YOUR TRANSCRIPTION</span>
        <span>{inputMode==='keys'?'Physical key sequence':'Unicode text'}</span>
      </div>
      <textarea ref={input} value={inputMode==='keys'?raw:unicode} onChange={event=>{if(inputMode==='keys')setRaw(event.target.value);else setUnicode(event.target.value)}} onKeyDown={onKeyDown} onPaste={event=>{event.preventDefault();setNotice('Paste is disabled.')}} disabled={!running||finished} aria-label="Type your transcription" lang={inputMode==='unicode'&&layoutId!=='en_qwerty'?'hi':'en'} spellCheck={false} autoCorrect="off" autoCapitalize="off" placeholder={running?'Start transcribing here...':'Press Start lesson to begin.'} />
      {inputMode==='keys'&&layoutId!=='en_qwerty'&&<div className="typing-preview"><span>UNICODE PREVIEW</span><p lang="hi">{displayed||'आपकी टाइपिंग यहाँ दिखेगी'}</p></div>}
    </div>
  )}
  
  <div className="typing-live-bar"><div><span>ACCURACY</span><strong>{metrics.accuracy.toFixed(1)}%</strong></div><div><span>SPEED</span><strong>{metrics.wpm.toFixed(1)} <small>WPM</small></strong></div><div><span>COMPLETION</span><strong>{metrics.completion}%</strong></div><div><span>ERRORS</span><strong>{metrics.errors}</strong></div></div>
  <KeyboardGuide layoutId={layoutId} focusKeys={lesson.focusKeys} activeKey={activeKey} onKey={inputMode==='keys'?addKey:undefined}/>
  <div className="typing-lesson-actions">{!running&&!finished?<button className="typing-action-primary" onClick={start}><Keyboard size={17}/> {elapsed?'Resume lesson':'Start lesson'}</button>:null}{running&&<button className="typing-action-secondary" onClick={()=>setRunning(false)}>Pause</button>}{running&&<button className="typing-action-primary" onClick={finish}>Finish &amp; review <ArrowRight size={16}/></button>}{(finished||elapsed>0)&&<button className="typing-action-secondary" onClick={reset}><RotateCcw size={15}/> Try again</button>}</div>
  {finished&&<div className={`typing-result ${passed?'is-pass':'is-retry'}`} role="status"><div>{passed?<CheckCircle2 size={30}/>:<Target size={30}/>}<div><h2>{passed?'Lesson complete':'Another round will help'}</h2><p>{passed?'Your result met both accuracy and speed targets. This lesson is saved as complete.':`Reach ${lesson.targetAccuracy}% accuracy and ${lesson.targetWpm} WPM while completing 95% of the passage. Your attempt has been saved for review.`}</p></div></div><Link href={courseUrl(layoutId)} className="typing-action-secondary">Back to course <ArrowRight size={16}/></Link></div>}
 </>;
}
