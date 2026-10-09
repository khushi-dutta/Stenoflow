'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {createBrowserClient} from '@supabase/ssr';
import type {User} from '@supabase/supabase-js';
import {ChevronDown,LogOut} from 'lucide-react';
import './account-control.css';
const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const client=url&&key?createBrowserClient(url,key):null;
export default function AccountControl(){const [user,setUser]=useState<User|null>(null);const [open,setOpen]=useState(false);const [ready,setReady]=useState(false);const router=useRouter();useEffect(()=>{if(!client){setReady(true);return}client.auth.getUser().then(({data})=>{setUser(data.user);setReady(true)});const {data:{subscription}}=client.auth.onAuthStateChange((_event,session)=>setUser(session?.user??null));return()=>subscription.unsubscribe()},[]);async function signOut(){if(!client)return;await client.auth.signOut();setOpen(false);router.refresh()};if(!client)return <Link className="account-link" href="/login">Local mode · Sign in</Link>;if(!ready)return null;if(!user)return <Link className="account-link" href="/login">Log in</Link>;return <div className="account-menu"><button className="account-trigger" onClick={()=>setOpen(v=>!v)} aria-expanded={open}><span className="avatar">{(user.email||'U')[0].toUpperCase()}</span><span className="account-email">{user.email}</span><ChevronDown size={13}/></button>{open&&<div className="account-popover"><span>{user.email}</span><Link href="/app/profile" onClick={()=>setOpen(false)}>My profile</Link><Link href="/pricing" onClick={()=>setOpen(false)}>Billing</Link><button onClick={()=>void signOut()}><LogOut size={14}/> Sign out</button></div>}</div>}
