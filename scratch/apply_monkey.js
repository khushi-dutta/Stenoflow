const fs = require('fs');
let code = fs.readFileSync('src/features/typing/typing-course.tsx', 'utf8');

const startTag = '<div className="typing-exercise">';
const endTag = '}</div>';

const startIdx = code.indexOf(startTag);
if (startIdx === -1) { console.log('startTag not found'); process.exit(1); }

const afterStart = code.substring(startIdx);
const endIdxLocal = afterStart.indexOf(endTag) + endTag.length;
const searchBlock = afterStart.substring(0, endIdxLocal);

const replaceBlock = `<div className="typing-exercise monkey-type">
    <div className="typing-exercise-head"><span>TYPE THE PASSAGE</span><span>{metrics.completion}% complete</span></div>
    
    <div 
      className={\`monkey-text \${running ? 'is-running' : ''}\`}
      onClick={() => { if (!finished) { if (!running) start(); else input.current?.focus(); } }}
      lang={layoutId==='en_qwerty'?'en':'hi'}
    >
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
    
    {inputMode==='keys'&&layoutId!=='en_qwerty'&&<div className="typing-preview"><span>UNICODE PREVIEW</span><p lang="hi">{displayed||'आपकी टाइपिंग यहाँ दिखेगी'}</p></div>}
  </div>`;

fs.writeFileSync('src/features/typing/typing-course.tsx', code.replace(searchBlock, replaceBlock));
console.log("Successfully replaced typing UI in tsx.");
