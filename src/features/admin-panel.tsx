'use client';

import {useCallback,useEffect,useState,type FormEvent} from 'react';
import {RefreshCw,Search,ShieldCheck} from 'lucide-react';
import AdminDictationForm,{type CuratedDictation} from './admin-dictation-form';

type User={id:string;display_name:string;created_at:string;suspended:boolean};
type Dictation=CuratedDictation;
type AdminData={users:User[];userCount:number;userPage:number;attemptCount:number;dictations:Dictation[];dictationCount:number;dictationPage:number};
const PAGE_SIZE=20;

export default function AdminPanel(){
 const [data,setData]=useState<AdminData|null>(null);
 const [status,setStatus]=useState('Loading administrator data…');
 const [query,setQuery]=useState('');const [submitted,setSubmitted]=useState('');
 const [userPage,setUserPage]=useState(0);const [dictationPage,setDictationPage]=useState(0);
 const [busy,setBusy]=useState('');const [loading,setLoading]=useState(false);
 const [editing,setEditing]=useState<CuratedDictation|null>(null);
 const load=useCallback(async()=>{
  setLoading(true);
  try{const params=new URLSearchParams({userPage:String(userPage),dictationPage:String(dictationPage),q:submitted});const response=await fetch(`/api/admin?${params}`,{cache:'no-store'});const body=await response.json();if(!response.ok){setStatus(body.error||'Administrator access unavailable.');setData(null);return;}setData(body);setStatus('');}
  catch{setStatus('Could not reach the administrator service.');setData(null);}
  finally{setLoading(false);}
 },[userPage,dictationPage,submitted]);
 useEffect(()=>{void load();},[load]);
 async function change(input:object,id:string){setBusy(id);setStatus('');try{const response=await fetch('/api/admin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input)});const result=await response.json();if(!response.ok)throw new Error(result.error||'Change could not be saved.');await load();setStatus('Change saved.');}catch(error){setStatus(error instanceof Error?error.message:'Change could not be saved.');}finally{setBusy('');}}
 function search(event:FormEvent){event.preventDefault();setUserPage(0);setDictationPage(0);setSubmitted(query.trim());}
 const userPages=Math.max(1,Math.ceil((data?.userCount??0)/PAGE_SIZE));const dictationPages=Math.max(1,Math.ceil((data?.dictationCount??0)/PAGE_SIZE));
 return <section className="learning-root"><div className="learning-header"><span className="learning-eyebrow">PROTECTED WORKSPACE</span><h1>Administration</h1><p>Review account and dictation records from your connected database.</p></div>
  {status&&<div className="notice-bar" role="status">{status}</div>}
  {!data?<div className="learning-empty"><ShieldCheck size={30}/><h2>Administrator account required</h2><p>Connect the server and sign in as a configured administrator to manage content.</p><button className="learning-secondary" onClick={()=>void load()}><RefreshCw size={14}/> Try again</button></div>:<>
   <form className="learning-resource-toolbar" onSubmit={search}><label className="learning-resource-search"><Search size={16}/><input aria-label="Search users and dictations" placeholder="Search users or dictation titles" value={query} onChange={event=>setQuery(event.target.value)}/></label><button className="learning-primary" type="submit">Search</button>{submitted&&<button className="learning-secondary" type="button" onClick={()=>{setQuery('');setSubmitted('');setUserPage(0);setDictationPage(0);}}>Clear</button>}</form>
   <div className="learning-stats"><div><span>Matching users</span><strong>{data.userCount}</strong></div><div><span>Recorded attempts</span><strong>{data.attemptCount??0}</strong></div><div><span>Curated dictations</span><strong>{data.dictationCount}</strong></div></div>
   <div className="learning-panel"><div className="learning-panel-heading"><div><h2>Learners</h2><p>Page {userPage+1} of {userPages} · 20 per page</p></div></div><div className="learning-table-wrap"><table><thead><tr><th>Name</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead><tbody>{data.users.map(user=><tr key={user.id}><td><strong>{user.display_name||'Unnamed learner'}</strong><br/><small>{user.id}</small></td><td>{new Date(user.created_at).toLocaleDateString()}</td><td>{user.suspended?'Suspended':'Active'}</td><td><button className="learning-secondary" disabled={busy===user.id} onClick={()=>void change({action:'suspend',userId:user.id,suspended:!user.suspended},user.id)}>{user.suspended?'Restore':'Suspend'}</button></td></tr>)}</tbody></table>{!data.users.length&&<p>No matching users.</p>}</div><div className="learning-pager"><button className="learning-secondary" disabled={loading||userPage===0} onClick={()=>setUserPage(page=>page-1)}>Previous</button><span>{userPage+1} / {userPages}</span><button className="learning-secondary" disabled={loading||userPage+1>=userPages} onClick={()=>setUserPage(page=>page+1)}>Next</button></div></div>
   <AdminDictationForm editing={editing} onSaved={load} onCancel={()=>setEditing(null)}/><div className="learning-panel" style={{marginTop:18}}><div className="learning-panel-heading"><div><h2>Curated dictations</h2><p>Page {dictationPage+1} of {dictationPages} · 20 per page</p></div></div><div className="learning-table-wrap"><table><thead><tr><th>Title</th><th>Visibility</th><th>Access</th><th>Actions</th></tr></thead><tbody>{data.dictations.map(item=><tr key={item.id}><td><strong>{item.title}</strong></td><td>{item.published?'Published':'Private'}</td><td>{item.premium?'Premium':'Free'}</td><td><button className="learning-secondary" disabled={busy===item.id} onClick={()=>void change({action:'publish',dictationId:item.id,published:!item.published,premium:item.premium},item.id)}>{item.published?'Unpublish':'Publish'}</button> <button className="learning-secondary" disabled={busy===item.id} onClick={()=>void change({action:'publish',dictationId:item.id,published:item.published,premium:!item.premium},item.id)}>{item.premium?'Make free':'Make premium'}</button> {!item.owner_id&&<button className="learning-secondary" onClick={()=>setEditing(item)}>Edit</button>}</td></tr>)}</tbody></table>{!data.dictations.length&&<p>No matching curated dictations.</p>}</div><div className="learning-pager"><button className="learning-secondary" disabled={loading||dictationPage===0} onClick={()=>setDictationPage(page=>page-1)}>Previous</button><span>{dictationPage+1} / {dictationPages}</span><button className="learning-secondary" disabled={loading||dictationPage+1>=dictationPages} onClick={()=>setDictationPage(page=>page+1)}>Next</button></div></div>
  </>}
 </section>;
}



