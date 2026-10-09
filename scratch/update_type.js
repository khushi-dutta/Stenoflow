const fs = require('fs');
let code = fs.readFileSync('src/features/typing/curriculum.ts', 'utf8');

if (!code.includes("mode?: 'practice' | 'dictation' | 'exam';")) {
  code = code.replace(
    "targetAccuracy: number;\n};", 
    "targetAccuracy: number;\n  mode?: 'practice' | 'dictation' | 'exam';\n};"
  );
  fs.writeFileSync('src/features/typing/curriculum.ts', code);
  console.log('Added mode field to CourseLesson');
} else {
  console.log('Already added');
}
