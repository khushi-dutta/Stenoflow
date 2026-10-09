'use client';

import Link from 'next/link';
import {ArrowUpRight,CalendarDays,Target} from 'lucide-react';
import {useProgress} from '@/lib/store';

function localDate(value:string){const [year,month,day]=value.split('-').map(Number);return new Date(year,month-1,day);}
function format(value:Date){return value.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});}
export default function StudyPlan(){
 const {state}=useProgress();const profile=state.profile;
 const recent=state.attempts.slice(0,5);const measured=recent.length?Math.round(recent.reduce((sum,attempt)=>sum+attempt.netWpm,0)/recent.length):null;
 const start=new Date();start.setHours(0,0,0,0);
 const examDate=profile.examDate?localDate(profile.examDate):null;
 const days=examDate?Math.ceil((examDate.getTime()-start.getTime())/86_400_000):null;
 const weeks=days!==null&&days>0?Math.max(1,Math.ceil(days/7)):8;
 const visibleWeeks=Math.min(weeks,12);
 const minutes=Math.max(5,profile.dailyMinutes||20);
 const baseline=measured??profile.currentWpm;
 const phases=[
  {name:'Foundation',description:'Practice clean words and posture. Review mistakes before adding speed.',ratio:.35},
  {name:'Build fluency',description:'Use longer passages and repeat words that slow you down.',ratio:.4},
  {name:'Timed sessions',description:'Alternate timed sessions with detailed review and recovery.',ratio:.2},
  {name:'Final review',description:'Keep the routine familiar. Check instructions and rest before the test.',ratio:.05},
 ];
 const schedule=Array.from({length:visibleWeeks},(_,index)=>{
  const from=new Date(start);from.setDate(start.getDate()+index*7);
  const to=new Date(from);to.setDate(from.getDate()+6);
  const fraction=(index+.5)/weeks;let cumulative=0;const phase=phases.find(item=>{cumulative+=item.ratio;return fraction<=cumulative;})??phases[3];
  const benchmark=baseline>0&&profile.targetWpm>baseline?Math.round(baseline+(profile.targetWpm-baseline)*(index+1)/weeks):null;
  return {index,from,to,phase,benchmark};
 });
 return <><div className="learning-banner"><div><span className="learning-eyebrow">YOUR PRACTICE ROUTINE</span><h2>{minutes} minutes a day, with a clear focus.</h2><p>{days===null?'Add an exam date to see a dated plan. This eight-week routine can begin today.':days<=0?'Your selected exam date has passed. Update it to make a new dated plan.':`${days} day${days===1?'':'s'} until ${format(examDate!)}. Plan spans ${weeks} week${weeks===1?'':'s'}.`}</p></div><CalendarDays size={46}/></div>
  <div className="learning-stats"><div><span>Recent measured speed</span><strong>{measured===null?'—':`${measured} WPM`}</strong></div><div><span>Your target</span><strong>{profile.targetWpm} WPM</strong></div><div><span>Daily time</span><strong>{minutes} min</strong></div></div>
  <div className="learning-notice"><Target size={18}/><p>Weekly speed figures are planning benchmarks, not predicted results. This routine uses your saved goals and recent local sessions. Adjust the difficulty to preserve accuracy.</p></div>
  <div className="learning-plan-list">{schedule.map(week=><article className="learning-panel" key={week.index}><div className="learning-card-top"><span className="learning-eyebrow">WEEK {week.index+1} · {week.phase.name.toUpperCase()}</span><span className="learning-tag">{format(week.from)} – {format(week.to)}</span></div><h2>{week.phase.name}</h2><p>{week.phase.description}</p><div className="learning-plan-meta"><span>{Math.max(1,Math.round(minutes*.2))} min warm-up</span><span>{Math.max(1,Math.round(minutes*.6))} min passage</span><span>{Math.max(1,Math.round(minutes*.2))} min review</span>{week.benchmark!==null&&<span>Optional benchmark: {week.benchmark} WPM</span>}</div><Link className="learning-secondary" href={week.phase.name==='Foundation'?'/app/lessons':week.phase.name==='Final review'?'/app/mistakes':'/app/practice'}>Open this week’s practice<ArrowUpRight size={15}/></Link></article>)}</div>
  {weeks>visibleWeeks&&<p className="learning-plan-more">Showing the next {visibleWeeks} weeks of a {weeks}-week plan. As time passes, the plan updates around the current date.</p>}
  <div className="learning-panel" style={{marginTop:18}}><h2>Keep the plan realistic</h2><p>A target is a direction. Increase pace only when your transcription remains accurate. Update your exam date, daily time, and target in your profile.</p><Link className="learning-secondary" href="/app/profile">Adjust my goal<ArrowUpRight size={15}/></Link></div>
 </>;
}
