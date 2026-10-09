const fs = require('fs');
const file = 'src/features/typing/typing-course.tsx';
let code = fs.readFileSync(file, 'utf8');

// The exact string in typing-course.tsx that we want to replace
const searchBlock = `<div className="typing-exercise"><div className="typing-exercise-head"><span>01 / COPY THE PASSAGE</span><span>{metrics.completion}% complete</span></div><p className="typing-reference" lang={layoutId==='en_qwerty'?'en':'hi'}>{lesson.text}</p><div className="typing-exercise-head"><span>02 / YOUR INPUT</span><span>{inputMode==='keys'?'Physical key sequence':'Unicode text'}</span></div><textarea ref={input} value={inputMode==='keys'?raw:unicode} onChange={event=>{if(inputMode==='keys')setRaw(event.target.value);else setUnicode(event.target.value)}} onKeyDown={onKeyDown} onPaste={event=>{event.preventDefault();setNotice('Paste is disabled in lessons so the result measures your typing.')}} disabled={!running||finished} aria-label={inputMode==='keys'?'Type physical keyboard keys':'Type Unicode text'} lang={inputMode==='unicode'&&layoutId!=='en_qwerty'?'hi':'en'} spellCheck={false} autoCorrect="off" autoCapitalize="off" placeholder={running?'Start typing the passage here…':'Press Start lesson to begin.'}/>{inputMode==='keys'&&layoutId!=='en_qwerty'&&<div className="typing-preview"><span>UNICODE PREVIEW</span><p lang="hi">{displayed||'यहाॅ प्रीव्यू दिखेगा'}</p></div>}</div>`;

const replaceBlock = `<div className="typing-exercise monkey-type">
    <div className="typing-exercise-head"><span>TYPE THE PASSAGE</span><span>{metrics.completion}% complete</span></div>
    
    <div 
      className={\`monkey-text \${running ? 'is-running' : ''}\`}
      onClick={() => { if (!finished) { if (!running) start(); else input.current?.focus(); } }}
      lang={layoutId==='en_qwerty'?'en':'hi'}
    >
      {lesson.text.split(' ').map((word, wordIdx, wordsArr) => {
        // Calculate the starting index of this word in the full string
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
    
    <textarea 
      ref={input} 
      value={inputMode==='keys'?raw:unicode} 
      onChange={event=>{if(inputMode==='keys')setRaw(event.target.value);else setUnicode(event.target.value)}} 
      onKeyDown={onKeyDown} 
      onPaste={event=>{event.preventDefault();setNotice('Paste is disabled in lessons so the result measures your typing.')}} 
      disabled={!running||finished} 
      aria-label={inputMode==='keys'?'Type physical keyboard keys':'Type Unicode text'} 
      lang={inputMode==='unicode'&&layoutId!=='en_qwerty'?'hi':'en'} 
      spellCheck={false} autoCorrect="off" autoCapitalize="off" 
      className="monkey-hidden-input"
    />
    
    {inputMode==='keys'&&layoutId!=='en_qwerty'&&<div className="typing-preview"><span>UNICODE PREVIEW</span><p lang="hi">{displayed||'यहाॅ प्रीव्यू दिखेगा'}</p></div>}
  </div>`;

if (!code.includes(searchBlock)) {
  console.error("Could not find the block to replace!");
} else {
  code = code.replace(searchBlock, replaceBlock);
  fs.writeFileSync(file, code);
  console.log("Successfully replaced typing UI in tsx.");
}
