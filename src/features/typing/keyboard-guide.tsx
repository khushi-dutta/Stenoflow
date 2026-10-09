'use client';

import {useState} from 'react';
import {ArrowUp,Delete} from 'lucide-react';
import {getKeyMap,SHIFTED_KEYS} from './layouts';
import type {CourseLayoutId} from './course-config';

const rows = ['`1234567890-=','qwertyuiop[]\\',"asdfghjkl;'",'zxcvbnm,./'];
export function physicalCharacter(event: React.KeyboardEvent): string | null {
 const letters = /^Key([A-Z])$/.exec(event.code);
 if (letters) return event.shiftKey !== event.getModifierState('CapsLock') ? letters[1] : letters[1].toLowerCase();
 const digit = /^Digit([0-9])$/.exec(event.code);
 const punctuation: Record<string,string> = {Backquote:'`',Minus:'-',Equal:'=',BracketLeft:'[',BracketRight:']',Backslash:'\\',Semicolon:';',Quote:"'",Comma:',',Period:'.',Slash:'/'};
 const base = digit?.[1] ?? punctuation[event.code];
 if (base) return event.shiftKey ? SHIFTED_KEYS[base] ?? base : base;
 return event.code === 'Space' ? ' ' : null;
}

export default function KeyboardGuide({layoutId,focusKeys=[],activeKey='',onKey}:{layoutId:CourseLayoutId;focusKeys?:string[];activeKey?:string;onKey?:(key:string)=>void}) {
 const [shift,setShift]=useState(false); const [selected,setSelected]=useState('');
 const map=getKeyMap(layoutId);
 return <div className="typing-keyboard"><div className="typing-keyboard-caption"><span>{selected?`Key ${selected} produces ${map[selected]??selected}`:onKey?'Type on your keyboard or tap a key below.':'Keyboard reference · select Shift to see alternate characters.'}</span><span><i/> Lesson focus</span></div><div className="typing-keyboard-rows">{rows.map((row,index)=><div className={`typing-key-row typing-key-row-${index}`} key={row}>{Array.from(row).map(base=>{const key=shift?SHIFTED_KEYS[base]??base:base;const value=map[key]??(layoutId==='en_qwerty'?key:'');return <button type="button" key={base} className={`typing-key ${focusKeys.includes(base)||focusKeys.includes(key)?'is-focus':''} ${activeKey===key||selected===key?'is-pressed':''}`} aria-label={`Key ${key}: ${value||'unmapped'}`} title={`${key} → ${value||'not mapped'}`} onMouseDown={event=>event.preventDefault()} onClick={()=>{setSelected(key);onKey?.(key)}}><small>{key}</small><span lang={layoutId==='en_qwerty'?'en':'hi'}>{value||'·'}</span></button>})}{index===0&&<button type="button" className="typing-key typing-wide-key" aria-label="Backspace" onMouseDown={event=>event.preventDefault()} onClick={()=>onKey?.('Backspace')}><Delete size={17}/></button>}</div>)}<div className="typing-key-row"><button className={`typing-key typing-shift ${shift?'is-pressed':''}`} type="button" aria-pressed={shift} onClick={()=>setShift(!shift)}><ArrowUp size={15}/> Shift</button><button className="typing-key typing-space" type="button" onMouseDown={event=>event.preventDefault()} onClick={()=>onKey?.(' ')}>Space</button></div></div>{onKey&&layoutId!=='en_qwerty'&&<div className="typing-special-keys"><span>Extra characters for this tutor</span>{[['⁇','?'],['ँ','ँ'],['ॉ','ॉ']].map(([input,label])=><button type="button" key={input} onMouseDown={event=>event.preventDefault()} onClick={()=>onKey(input)}>{label}</button>)}</div>}<p className="typing-keyboard-note">Hindi key labels show character components. Consonants and vowel signs combine as you type.</p></div>;
}

