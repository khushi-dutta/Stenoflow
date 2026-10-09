const fs = require('fs');
let css = fs.readFileSync('src/features/typing/typing-course.css', 'utf8');

const monkeyCss = `
/* MonkeyType UI Clone Styles */
.typing-exercise.monkey-type {
  position: relative;
  overflow: hidden;
  border: none;
  background: transparent;
  padding: 0;
  margin-top: 24px;
}

.monkey-text {
  position: relative;
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  font-size: 24px;
  line-height: 1.6;
  color: var(--muted);
  white-space: normal;
  word-break: normal;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  user-select: none;
  cursor: text;
  min-height: 140px;
  max-height: 300px;
  overflow-y: auto;
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.monkey-text.is-running {
  opacity: 1;
}

.monkey-word {
  display: inline-flex;
  margin-bottom: 8px;
}

.char {
  position: relative;
  display: inline-block;
  color: var(--muted);
}

.char.correct {
  color: var(--ink);
}

.char.incorrect {
  color: #ef4444; /* Red color */
  background-color: rgba(239, 68, 68, 0.2);
  border-radius: 2px;
}

.char.space {
  width: 0.5em; /* Explicit width for space */
}

.char.space.incorrect {
  background-color: rgba(239, 68, 68, 0.4);
}

.caret {
  position: absolute;
  left: 0;
  top: 10%;
  width: 2px;
  height: 80%;
  background-color: var(--primary);
  animation: blink 1s step-end infinite;
  z-index: 10;
}

.end-caret {
  left: 100%;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.monkey-hidden-input {
  position: absolute !important;
  opacity: 0 !important;
  pointer-events: none !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: 0 !important;
  border: none !important;
}

[lang='hi'] .monkey-text {
  font-family: inherit; /* Use default hindi font, not monospace as it breaks shaping badly */
  font-size: 28px;
}

/* Ensure no shaping breaks across spans in Hindi if possible */
[lang='hi'] .char {
  display: inline;
}
`;

if (!css.includes('MonkeyType UI Clone Styles')) {
  fs.writeFileSync('src/features/typing/typing-course.css', css + '\n' + monkeyCss);
  console.log('Appended MonkeyType CSS.');
} else {
  console.log('CSS already contains MonkeyType styles.');
}
