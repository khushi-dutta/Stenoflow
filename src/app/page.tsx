import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Headphones, Menu, Play, SlidersHorizontal } from 'lucide-react';
import { Brand } from '@/components/brand';
import { dictations, wordCount } from '@/lib/data';
import './home.css';

const disciplines = [
  { number: '01', title: 'Dictation', detail: 'Listen closely. Write with control.', text: 'Build your shorthand rhythm with English and Hindi passages, adjustable playback, and a quiet place to transcribe.', href: '/app/library' },
  { number: '02', title: 'Typing', detail: 'Accuracy before speed.', text: 'Work through focused lessons, find the words that slow you down, and turn them into your next practice session.', href: '/app/typing' },
  { number: '03', title: 'Exam practice', detail: 'Get familiar with the clock.', text: 'Rehearse listening and transcription in timed practice sessions, with a detailed review when you finish.', href: '/app/exams' },
];

export default function Home() {
  return <div className="editorial-home">
    <a className="home-skip" href="#main-content">Skip to content</a>
    <header className="home-header">
      <Brand />
      <nav className="home-navigation" aria-label="Main navigation"><a href="#practice">Practice</a><Link href="/app/exams">Exam preparation</Link><Link href="/app/resources">Study resources</Link><Link href="/pricing">Plans</Link></nav>
      <div className="home-account"><Link href="/login">Log in</Link><Link className="home-button home-button-dark" href="/app/dashboard">Open workspace <ArrowUpRight size={16}/></Link></div>
      <details className="home-mobile-menu"><summary aria-label="Open navigation"><Menu size={23}/></summary><nav aria-label="Mobile navigation"><a href="#practice">Practice</a><Link href="/app/exams">Exam preparation</Link><Link href="/app/resources">Study resources</Link><Link href="/pricing">Plans</Link><Link href="/login">Log in</Link></nav></details>
    </header>
    <main id="main-content">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="home-kicker"><span/> THE STENOGRAPHY PRACTICE STUDIO</p>
          <h1>A steady hand.<br/>A sharper mind.<br/><em>A stronger start.</em></h1>
          <p className="home-hero-description">A considered space to master stenography, build typing speed, and prepare for your skill test. One focused session at a time.</p>
          <div className="home-hero-actions"><Link className="home-button home-button-dark" href="/app/dashboard">Start practicing <ArrowUpRight size={18}/></Link><Link className="home-text-link" href="/app/exams">Find your exam <ArrowRight size={16}/></Link></div>
          <div className="home-hero-note"><span>Free practice. No card required.</span><span className="home-language-note">English <i/> हिंदी</span></div>
        </div>
        <div className="home-studio">
          <div className="home-studio-label"><span>THE DAILY PRACTICE</span><span>01 / DICTATION</span></div>
          <div className="home-studio-sheet">
            <div className="home-sheet-top"><span><Headphones size={16}/> Listening room</span><SlidersHorizontal size={17}/></div>
            <div className="home-sheet-title"><span className="home-small-label">ENGLISH · INTERMEDIATE</span><h2>The foundations<br/>of progress</h2><p>Public service &amp; community</p></div>
            <div className="home-recording"><Link href="/app/practice?id=community-progress&mode=dictation" aria-label="Practice The foundations of progress" className="home-recording-play"><Play size={17} fill="currentColor"/></Link><div className="home-recording-wave" aria-hidden="true">{Array.from({length:44},(_,i)=><i key={i} style={{height:`${7+Math.abs(Math.sin(i*1.8)*Math.cos(i*.22))*32}px`}}/>)}</div><span>80<small>WPM</small></span></div>
            <div className="home-sheet-excerpt"><span className="home-small-label">FROM THE PASSAGE</span><p>“The true strength of a community lies in the willingness of its people to work together.”</p></div>
            <Link className="home-sheet-link" href="/app/practice?id=community-progress&mode=dictation"><span>Open this dictation</span><ArrowUpRight size={19}/></Link>
          </div>
          <div className="home-studio-foot"><span>Listen. Transcribe. Refine.</span><span>YOUR SPACE TO IMPROVE</span></div>
        </div>
      </section>
      <div className="home-exam-index"><span>PREPARE WITH PURPOSE</span><div><Link href="/app/exams">SSC Stenographer</Link><Link href="/app/exams">DSSSB</Link><Link href="/app/exams">High Court</Link><Link href="/app/exams">CPCT</Link><Link href="/app/exams">AHC</Link></div><span>Independent practice platform</span></div>
      <section className="home-discipline-section" id="practice">
        <div className="home-section-heading"><p className="home-kicker">A PRACTICE THAT WORKS FOR YOU</p><div><h2>Three disciplines.<br/><em>One place to get better.</em></h2><p>From the first keystroke to a full timed session, give every part of your preparation the attention it needs.</p></div></div>
        <div className="home-disciplines">{disciplines.map(item=><Link href={item.href} className="home-discipline" key={item.number}><div className="home-discipline-heading"><span>{item.number}</span><ArrowUpRight size={22}/></div><h3>{item.title}</h3><strong>{item.detail}</strong><p>{item.text}</p><span className="home-discipline-link">Explore {item.title.toLowerCase()} <ArrowRight size={15}/></span></Link>)}</div>
      </section>
      <section className="home-review-section">
        <div className="home-review-copy"><p className="home-kicker">THE WORK AFTER THE WORDS</p><h2>Don’t just finish<br/>a passage.<br/><em>Learn from it.</em></h2><p>See exactly where your transcription went off track. Review missing words, spelling, and punctuation, then practice the words that need another look.</p><Link className="home-text-link" href="/app/mistakes">A closer look at your practice <ArrowRight size={17}/></Link></div>
        <div className="home-review-example"><div className="home-review-example-top"><span>TRANSCRIPTION REVIEW</span><span>Illustrative example</span></div><div className="home-proof"><span className="home-small-label">YOUR TRANSCRIPTION</span><p>The <span className="proof-error">commitee</span> reviewed the documents <span className="proof-missing">submitted</span> by the department.</p></div><div className="home-correction"><span className="home-correction-number">01</span><div><span className="home-small-label">SPELLING</span><p><del>commitee</del><ArrowRight size={14}/><strong>committee</strong></p></div><span className="home-correction-tag">Review word</span></div><div className="home-correction"><span className="home-correction-number">02</span><div><span className="home-small-label">MISSING WORD</span><p><strong>submitted</strong></p></div><span className="home-correction-tag">Try again</span></div><div className="home-review-bottom">A clearer picture of what to practice next.<ArrowUpRight size={17}/></div></div>
      </section>
      <section className="home-library-section"><div className="home-library-heading"><div><p className="home-kicker">PICK UP WHERE YOU ARE</p><h2>Your next passage<br/><em>is waiting.</em></h2></div><Link className="home-text-link" href="/app/library">Browse the library <ArrowUpRight size={17}/></Link></div><div className="home-catalog">{[dictations[0],dictations[1],dictations[3]].map((item,index)=><Link className="home-catalog-row" href={`/app/practice?id=${item.id}&mode=dictation`} key={item.id}><span className="home-catalog-number">0{index+1}</span><div className="home-catalog-title"><span>{item.language} / {item.category}</span><h3 lang={item.language==='Hindi'?'hi':'en'}>{item.title}</h3></div><span className="home-catalog-level">{item.difficulty}</span><span className="home-catalog-speed">{item.wpm}<small> WPM</small></span><span className="home-catalog-words">{wordCount(item.text)} words</span><ArrowUpRight size={22}/></Link>)}</div><p className="home-catalog-note">Original passages. Adjustable practice. A fresh opportunity to improve.</p></section>
      <section className="home-closing"><span className="home-kicker">MAKE TIME FOR YOUR CRAFT</span><h2>A little more focused.<br/><em>Every single day.</em></h2><Link className="home-button home-button-dark" href="/app/dashboard">Make today your first session <ArrowUpRight size={18}/></Link><p>Your workspace is ready when you are.</p></section>
    </main>
    <footer className="home-footer"><div className="home-footer-top"><div><Brand/><p>A space for serious practice.</p></div><nav aria-label="Footer navigation"><Link href="/about">About</Link><Link href="/pricing">Plans</Link><Link href="/app/resources">Resources</Link><Link href="/contact">Contact</Link></nav></div><div className="home-footer-bottom"><span>© {new Date().getFullYear()} StenoFlow</span><span>Independent learning. Original content.</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/refunds">Refunds</Link></div></div></footer>
  </div>;
}
