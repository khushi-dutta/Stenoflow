const fs = require('fs');
let code = fs.readFileSync('src/features/typing/typing-course.tsx', 'utf8');

const searchFnStart = "function start(){if(finished)return;setRunning(true);setTimeout(()=>input.current?.focus(),30)}";
const replaceFnStart = `function start(){
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
}`;

const searchFnFinish = "function finish(){if(finished)return;setRunning(false);";
const replaceFnFinish = `function finish(){if(finished)return;window.speechSynthesis.cancel();setRunning(false);`;

const searchFnReset = "function reset(){setRaw('');setUnicode('');setElapsed(0);setFinished(false);setRunning(false);setBackspaces(0);setNotice('')}";
const replaceFnReset = `function reset(){window.speechSynthesis.cancel();setRaw('');setUnicode('');setElapsed(0);setFinished(false);setRunning(false);setBackspaces(0);setNotice('')}`;

code = code.replace(searchFnStart, replaceFnStart);
code = code.replace(searchFnFinish, replaceFnFinish);
code = code.replace(searchFnReset, replaceFnReset);

// Replace UI Block
const searchUiBlock = `<div className="typing-exercise monkey-type">`;

// Find where typing-live-bar starts
const endUiBlockStr = `<div className="typing-live-bar">`;
const startIndex = code.indexOf(searchUiBlock);
if (startIndex === -1) { console.log('UI Block start not found'); process.exit(1); }
const endIndex = code.indexOf(endUiBlockStr, startIndex);

const oldUiBlock = code.substring(startIndex, endIndex);

const newUiBlock = `
  {(!lesson.mode || lesson.mode === 'practice') && (
    <div className="typing-exercise monkey-type">
      <div className="typing-exercise-head"><span>TYPE THE PASSAGE</span><span>{metrics.completion}% complete</span></div>
      <div className={\`monkey-text \${running ? 'is-running' : ''}\`} onClick={() => { if (!finished) { if (!running) start(); else input.current?.focus(); } }} lang={layoutId==='en_qwerty'?'en':'hi'}>
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
                  <span key={i} className={\`char \${state}\`}>
                    {i === displayed.length && running && <span className="caret"></span>}
                    {char}
                  </span>
                );
              })}
              {wordIdx < wordsArr.length - 1 && (
                <span className={\`char space \${wordStartIdx + word.length < displayed.length ? (displayed[wordStartIdx + word.length] === ' ' ? 'correct' : 'incorrect') : ''}\`}>
                  {wordStartIdx + word.length === displayed.length && running && <span className="caret"></span>}
                  {' '}
                </span>
              )}
            </div>
          );
        })}
        {displayed.length === lesson.text.length && running && <span className="caret end-caret"></span>}
      </div>
      <textarea ref={input} value={inputMode==='keys'?raw:unicode} onChange={event=>{if(inputMode==='keys')setRaw(event.target.value);else setUnicode(event.target.value)}} onKeyDown={onKeyDown} onPaste={event=>{event.preventDefault();setNotice('Paste is disabled in lessons so the result measures your typing.')}} disabled={!running||finished} aria-label={inputMode==='keys'?'Type physical keyboard keys':'Type Unicode text'} lang={inputMode==='unicode'&&layoutId!=='en_qwerty'?'hi':'en'} spellCheck={false} autoCorrect="off" autoCapitalize="off" className="monkey-hidden-input"/>
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
  `;

code = code.replace(oldUiBlock, newUiBlock + "\n  ");
fs.writeFileSync('src/features/typing/typing-course.tsx', code);
console.log("Successfully implemented Dictation and Exam UI");
