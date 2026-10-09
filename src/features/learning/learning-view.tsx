"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, BookOpen, Check, CheckCircle2, ChevronRight, Clock3, GraduationCap, LockKeyhole, Medal, Sparkles, Target, Trophy, WandSparkles } from 'lucide-react';
import { useProgress } from '@/lib/store';
import {dictations} from '@/lib/data';
import { examPresets } from './content';
import ResourceView from './resource-view';
import PersonalPassages from './personal-passages';
import ProfileView from './profile-view';
import StudyPlan from './study-plan';
import WeakReview from './weak-review';
import NotificationsView from './notifications-view';

import './learning.css';

type Progress = ReturnType<typeof useProgress>;
const titles: Record<string, [string, string]> = {
  lessons: ['Small lessons. Lasting progress.', 'Build a strong foundation, one focused session at a time.'],
  drills: ['Turn your weak spots into strengths.', 'Focused practice, built from the words in your completed sessions.'],
  mistakes: ['Every mistake is a next step.', 'Understand what needs attention and make your next session count.'],
  spellings: ['Make the right spelling second nature.', 'Review your words with simple, distraction-free flashcards.'],
  exams: ['Practice with a little more pressure.', 'Build confidence in a focused, timed practice environment.'],
  resources: ['Your learning bookshelf.', 'Original guides to help you practice with purpose.'],
  folders: ['A space for your practice material.', 'Bring your own passages and keep everything neatly organized.'],
  leaderboard: ['Progress is better together.', 'Your personal best is the first benchmark worth beating.'],
  achievements: ['Celebrate the work you put in.', 'Small milestones that recognize real practice.'],
  coach: ['A clearer path to your next milestone.', 'Practical recommendations grounded in your own results.'],
  'study-plan': ['Make time for your ambition.', 'A manageable practice routine built around your goals.'],
  profile: ['Make this space yours.', 'Set your starting point, choose a goal, and find your rhythm.'],
  notifications: ['You’re up to date.', 'A quiet place for your practice updates.'],
  admin: ['Content administration', 'Manage your local content and check your service connection.'],
};

function Empty({ title, text, href = '/app/practice', action = 'Start a practice session' }: {title: string; text: string; href?: string; action?: string}) {
  return <div className="learning-empty"><div className="learning-empty-icon"><BookOpen size={26}/></div><h2>{title}</h2><p>{text}</p><Link className="learning-primary" href={href}>{action}<ArrowUpRight size={16}/></Link></div>;
}

function Exams({start}: {start:(text:string,title:string,mode?:string,duration?:number)=>void}) {
  const [selected,setSelected]=useState('ssc'); const [duration,setDuration]=useState(5);
 return <><div className="learning-notice"><Target size={18}/><p>These are configurable practice presets, not official exam rules or certified simulations. Always check your current examination notice.</p></div><div className="learning-grid learning-two">{examPresets.map(exam=><button className={`learning-card learning-exam ${selected===exam.id?'is-selected':''}`} key={exam.id} onClick={()=>setSelected(exam.id)}><div className="learning-card-top"><span className="learning-course-icon"><GraduationCap size={24}/></span><span className="learning-radio">{selected===exam.id&&<Check size={14}/>}</span></div><span className="learning-eyebrow">{exam.category}</span><h2>{exam.name}</h2><p>{exam.description}</p><span className="learning-meta">Suggested listening practice: {exam.speed} WPM</span></button>)}</div><div className="learning-panel learning-panel-heading"><div><h2>Ready for a focused session?</h2><p>The session starts when you begin typing. Submit anytime or let the timer finish.</p></div><label className="learning-inline-label">Duration<select value={duration} onChange={e=>setDuration(Number(e.target.value))}><option value={1}>1 minute</option><option value={5}>5 minutes</option><option value={10}>10 minutes</option></select></label><button className="learning-primary" onClick={()=>{const category:Record<string,string>={ssc:'SSC Stenographer','high-court':'High Court',dsssb:'DSSSB',cpct:'CPCT',ahc:'Legal',custom:'Accuracy'};const source=dictations.find(d=>d.category===category[selected])??dictations[0];start(source.text,`${examPresets.find(e=>e.id===selected)?.name} practice`,'exam',duration*60)}}>Enter practice<ArrowUpRight size={16}/></button></div></>;
}

function Coach({progress,plan=false}: {progress:Progress;plan?:boolean}) {
 const [message,setMessage]=useState('');const [answer,setAnswer]=useState('');const [busy,setBusy]=useState(false);
 const recent=progress.state.attempts.slice(0,5);const average=recent.length?recent.reduce((n,a)=>n+a.accuracy,0)/recent.length:null;const minutes=progress.state.profile.dailyMinutes||20;
 async function ask(){if(!message.trim())return;setBusy(true);try{const res=await fetch('/api/coach',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message})});const data=await res.json();setAnswer(data.reply||data.message||data.error||'The coach service is not available yet. Use the local recommendations above.');}catch{setAnswer('The coach service could not be reached. Your local practice recommendations are still available.');}finally{setBusy(false);}}
 return <><div className="learning-banner"><div><span className="learning-eyebrow">YOUR PERSONAL PRACTICE ROUTINE</span><h2>{minutes} minutes. One step closer.</h2><p>{average===null?'Start with a baseline session to discover your strongest next step.':average<95?`Your recent average accuracy is ${average.toFixed(1)}%. Slow down and make clean transcription your priority.`:`Your recent average accuracy is ${average.toFixed(1)}%. Keep that control as you gradually build speed.`}</p></div><WandSparkles size={46}/></div><div className="learning-notice"><Sparkles size={18}/><p>This routine uses local rules and your saved preferences. It is not AI-generated and does not predict exam success.</p></div><div className="learning-grid">{[{title:'Warm up with intention',time:Math.max(1,Math.round(minutes*.2)),text:'Start with a home-row exercise. Focus on posture, light keystrokes, and rhythm.',href:'/app/lessons'},{title:average!==null&&average<95?'Choose accuracy over pace':'Build a steady rhythm',time:Math.max(1,Math.round(minutes*.6)),text:'Complete a focused practice passage at a comfortable speed. Review your result before moving on.',href:'/app/practice'},{title:'Close the feedback loop',time:Math.max(1,minutes-Math.round(minutes*.2)-Math.round(minutes*.6)),text:'Revisit missed words. Repeat them slowly and finish with a clean transcription.',href:'/app/mistakes'}].map((step,i)=><article className="learning-card" key={step.title}><div className="learning-card-top"><span className="learning-number">0{i+1}</span><span className="learning-tag">{step.time} min</span></div><h2>{step.title}</h2><p>{step.text}</p><Link className="learning-secondary" href={step.href}>Get started<ArrowUpRight size={16}/></Link></article>)}</div>{plan?<div className="learning-panel"><h2>Your target: {progress.state.profile.targetWpm} WPM</h2><p>Review your routine weekly. Increase the challenge only when you can sustain accuracy. Adjust your daily availability and exam date in your profile.</p><Link className="learning-secondary" href="/app/profile">Adjust my goal<ChevronRight size={16}/></Link></div>:<div className="learning-panel"><div className="learning-panel-heading"><div><h2>Ask Steno Coach</h2><p>AI responses require the configured server service and an authenticated account.</p></div><span className="learning-tag">Optional service</span></div><form className="learning-inline-form" onSubmit={e=>{e.preventDefault();void ask();}}><input aria-label="Question for Steno Coach" maxLength={1200} value={message} onChange={e=>setMessage(e.target.value)} placeholder="How can I improve my transcription accuracy?"/><button className="learning-primary" disabled={busy||!message.trim()}>{busy?'Checking…':'Ask coach'}<Sparkles size={16}/></button></form>{answer&&<p className="learning-message" role="status">{answer}</p>}</div>}</>;
}

function Achievements({progress}: {progress:Progress}) {
 const attempts=progress.state.attempts;const achievements=[{title:'The first step',description:'Complete your first practice session.',earned:attempts.length>=1,icon:BookOpen},{title:'Finding your rhythm',description:'Complete 10 practice sessions.',earned:attempts.length>=10,icon:Target},{title:'Precision matters',description:'Finish a session with at least 98% accuracy and 20 words.',earned:attempts.some(a=>a.accuracy>=98&&a.words>=20),icon:Medal},{title:'A little, often',description:'Practice on five different days.',earned:new Set(attempts.map(a=>a.createdAt.slice(0,10))).size>=5,icon:Trophy},{title:'Learning mindset',description:'Complete six typing lessons.',earned:progress.state.lessonIds.length>=6,icon:GraduationCap},{title:'Going the distance',description:'Accumulate one hour of practice.',earned:attempts.reduce((n,a)=>n+a.elapsedSeconds,0)>=3600,icon:Clock3}];
 return <><div className="learning-toolbar"><p>{achievements.filter(a=>a.earned).length} of {achievements.length} milestones earned</p><span className="learning-tag">Based on your real sessions</span></div><div className="learning-grid">{achievements.map(a=><article className={`learning-card learning-achievement ${a.earned?'is-earned':''}`} key={a.title}><div className="learning-medal"><a.icon size={33}/></div><h2>{a.title}</h2><p>{a.description}</p><span className="learning-tag">{a.earned?<><CheckCircle2 size={14}/>Earned</>:<><LockKeyhole size={13}/>Keep practicing</>}</span></article>)}</div></>;
}

export default function LearningView({section}: {section:string}) {
 const progress=useProgress(); const router=useRouter(); const [title,subtitle]=titles[section]??titles.lessons;
 function start(text:string,title:string,mode='typing',duration=300){const id=crypto.randomUUID();progress.addDictation({id,title,text,description:'Original guided practice exercise',language:/[\u0900-\u097F]/.test(text)?'Hindi':'English',wpm:80,category:'Learning',difficulty:'Beginner',premium:false});router.push(`/app/practice?id=${id}&mode=${mode}&duration=${duration}`);}
 if(!progress.ready)return <div className="learning-root" aria-busy="true"><div className="learning-skeleton"/><div className="learning-skeleton"/></div>;
 return <section className="learning-root"><header className="learning-header"><span className="learning-eyebrow">YOUR LEARNING SPACE</span><h1>{title}</h1><p>{subtitle}</p></header>{['drills','mistakes','spellings'].includes(section)?<WeakReview progress={progress} start={start} section={section}/>:section==='exams'?<Exams start={start}/>:section==='resources'?<ResourceView/>:section==='folders'?<PersonalPassages/>:section==='profile'?<ProfileView/>:section==='coach'?<Coach progress={progress}/>:section==='study-plan'?<StudyPlan/>:section==='achievements'?<Achievements progress={progress}/>:section==='leaderboard'?<Empty title="Your personal best comes first" text="Community rankings will be available when the shared leaderboard service is connected. For now, every session builds your own practice history." href="/app/analytics" action="See my progress"/>:section==='admin'?<Empty title="Administrator access required" text="Cloud content management requires a configured backend and an authenticated administrator role. You can manage your own local passages now." href="/app/folders" action="Manage my passages"/>:section==='notifications'?<NotificationsView/>:null}</section>;
}







