const fs = require('fs');
let code = fs.readFileSync('src/features/typing/typing-course.tsx', 'utf8');

const searchStr = ` function start(){if(finished)return;setRunning(true);setTimeout(()=>input.current?.focus(),30)}`;
const insertStr = `
 useEffect(() => {
   const container = document.querySelector('.monkey-text') as HTMLElement;
   const caret = document.querySelector('.caret') as HTMLElement;
   if (container && caret) {
     const offset = caret.offsetTop - container.offsetTop;
     container.scrollTop = offset - container.clientHeight / 2;
   }
 }, [displayed, running]);
`;

if (!code.includes(searchStr)) {
  console.log("Could not find insertion point");
} else {
  code = code.replace(searchStr, insertStr + searchStr);
  fs.writeFileSync('src/features/typing/typing-course.tsx', code);
  console.log("Successfully added auto-scrolling to typing-course.tsx");
}
