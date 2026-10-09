'use client';

import {useState,type FormEvent} from 'react';
import Link from 'next/link';
import {ArrowUpRight,Bell,CheckCircle2} from 'lucide-react';
import {useProgress} from '@/lib/store';

export default function NotificationsView(){
 const progress=useProgress();const [time,setTime]=useState(progress.state.profile.reminderTime??'');const [message,setMessage]=useState('');
 function save(event:FormEvent){event.preventDefault();progress.updateProfile({reminderTime:time});setMessage(time?`Daily reminder set for ${time}. It appears while StenoFlow is open.`:'Daily reminder turned off.');}
 return <><div className="learning-panel"><div className="learning-panel-heading"><div><h2>Daily practice reminder</h2><p>Choose a time for an in-app reminder. The site must be open for it to appear.</p></div><Bell size={20}/></div><form className="learning-inline-form" onSubmit={save}><input aria-label="Daily reminder time" type="time" value={time} onChange={event=>setTime(event.target.value)}/><button className="learning-primary" type="submit">Save reminder</button>{time&&<button className="learning-secondary" type="button" onClick={()=>{setTime('');progress.updateProfile({reminderTime:''});setMessage('Daily reminder turned off.');}}>Turn off</button>}</form>{message&&<p className="learning-message" role="status">{message}</p>}</div>
 <div className="learning-panel" style={{marginTop:18}}><div className="learning-panel-heading"><div><h2>{progress.state.notifications.length?'Your recent activity':'No recent activity'}</h2><p>Practice results and reminders saved in this browser.</p></div>{progress.state.notifications.some(item=>!item.read)&&<button className="learning-secondary" onClick={progress.markNotificationsRead}>Mark all as read</button>}</div>{progress.state.notifications.length?progress.state.notifications.map(item=><div className="learning-saved-row" key={item.id}><CheckCircle2 size={18}/><div><strong>{item.title}</strong><span>{item.read?'Read':'New'}</span></div></div>):<><p>Complete a session to see a result here, or set a daily reminder above.</p><Link className="learning-secondary" href="/app/practice">Start practice<ArrowUpRight size={16}/></Link></>}</div></>;
}
