const fs = require('fs');
const content = fs.readFileSync('src/features/typing/curriculum.ts', 'utf-8');

const englishStartIndex = content.indexOf("const englishLessons: LessonDraft[] = [");
const englishEndIndex = content.indexOf("type HindiDraft = Omit<LessonDraft, 'focusKeys'>;");

const prefix = content.substring(0, englishStartIndex);
const suffix = content.substring(englishEndIndex);

const newEnglish = `const englishLessons: LessonDraft[] = [
  // Level 1: Home Row
  english('Level 1: Home Row', 'Left Hand (asdf)', 'Master the left hand home row keys.', repeat('as as df df asdf fdsa sad fad ads fas', 6), ['a','s','d','f'], 120, 15, 93, ['Keep fingers resting lightly on asdf.']),
  english('Level 1: Home Row', 'Right Hand (jkl;)', 'Master the right hand home row keys.', repeat('jk jk l; l; jkl; ;lkj kjl ;lk', 6), ['j','k','l',';'], 120, 15, 93, ['Keep fingers resting lightly on jkl;.']),
  english('Level 1: Home Row', 'Full Home Row', 'Combine both hands on the home row.', repeat('ask dad fall as a lad all sad lads ask dad glad alas flask', 5), ['a','s','d','f','j','k','l',';'], 120, 16, 93, ['Return fingers to home position after every keystroke.']),
  
  // Level 2: Top Row
  english('Level 2: Top Row', 'Left Hand (qwert)', 'Reaching up with the left hand.', repeat('req wet ter req wet ter qwe ert rtw rew qwe ert rtw rew tree free greet', 5), ['q','w','e','r','t'], 120, 16, 93, ['Reach up, strike, and pull back down to home row.']),
  english('Level 2: Top Row', 'Right Hand (yuiop)', 'Reaching up with the right hand.', repeat('you uip poi you uip poi yuo yuo pop pip poy yuo yuo pop pip poy', 5), ['y','u','i','o','p'], 120, 16, 93, ['Maintain your wrist position; let the fingers stretch.']),
  english('Level 2: Top Row', 'Home + Top Row Words', 'Typing words using the top and home rows.', repeat('type write rope out pot top type write rope out pot top quiet pure quote route tour your', 4), ['t','y','p','e','w','r','i','t','e'], 120, 18, 93, ['Keep a steady rhythm while reaching.']),
  
  // Level 3: Bottom Row
  english('Level 3: Bottom Row', 'Left Hand (zxcvb)', 'Reaching down with the left hand.', repeat('zxc cvb zv bx zxc cvb zv bx cab bad ban van box cab bad ban van box', 5), ['z','x','c','v','b'], 120, 18, 93, ['Curl fingers down to strike the bottom row.']),
  english('Level 3: Bottom Row', 'Right Hand (nm,./)', 'Reaching down with the right hand.', repeat('nm m, ./ nm m, ./ man map nap men man map nap men pan nip mop', 5), ['n','m',',','.','/'], 120, 18, 93, ['Use the right thumb for spacebar.']),
  english('Level 3: Bottom Row', 'All Rows Practice', 'Combine top, home, and bottom rows.', repeat('zebra xylophone quick fix jump brown fox mix van cab pen dog cat box jar hat', 4), ['z','x','c','v','b','n','m'], 120, 20, 93, ['You now know the entire alphabet! Focus on accuracy.']),

  // Level 4: Number Row & Symbols
  english('Level 4: Numbers & Symbols', 'Left Hand Numbers (1-5)', 'Reaching the top number row.', repeat('12 34 5 12 34 5 123 45 123 45 cat2 dog3 fish4 bird5 12 34 5', 5), ['1','2','3','4','5'], 120, 15, 93, ['These are the longest reaches. Do not move your whole hand.']),
  english('Level 4: Numbers & Symbols', 'Right Hand Numbers (6-0)', 'Reaching the right number row.', repeat('67 89 0 67 89 0 678 90 678 90 page6 line7 item8 box9 test0 67 89 0', 5), ['6','7','8','9','0'], 120, 15, 93, ['Keep eyes on the screen, feel for the numbers.']),
  english('Level 4: Numbers & Symbols', 'Dates and Figures', 'Practical numbers practice.', repeat('The year 2024 is here. Call 911 or 555-1234. 10 apples, 25 oranges, 300 grapes, 7 birds, 8 cats.', 4), ['0','1','2','3','4','5','6','7','8','9'], 150, 20, 93, ['Combine numbers with normal text seamlessly.']),

  // Level 5: Capital Letters
  english('Level 5: Capital Letters', 'Left Shift', 'Using Left Shift for right-hand keys.', repeat('John, Kevin, Larry, Paul, Mark, Noah. John, Kevin, Larry, Paul, Mark, Noah.', 5), ['Shift'], 120, 22, 93, ['Hold Left Shift with your pinky, strike the letter with your right hand.']),
  english('Level 5: Capital Letters', 'Right Shift', 'Using Right Shift for left-hand keys.', repeat('Anna, Betty, Cathy, David, Eva, Frank. Anna, Betty, Cathy, David, Eva, Frank.', 5), ['Shift'], 120, 22, 93, ['Hold Right Shift with your pinky, strike the letter with your left hand.']),
  english('Level 5: Capital Letters', 'Capitalization Flow', 'Mixing shifts fluidly in sentences.', repeat('Hello World. Welcome to New York. The United States of America. Tuesday, Wednesday, Thursday.', 4), ['Shift'], 120, 25, 93, ['Alternate shift keys automatically without thinking.']),

  // Level 6: Common Syllables (N-Grams)
  english('Level 6: Common Syllables', 'The Big Three (th, he, in)', 'The most common letter combinations.', repeat('the them then there these their think thin thing thick he her here heat head help in into inch inside invent', 4), ['t','h','e','i','n'], 120, 25, 93, ['Type these pairs as a single fluid motion.']),
  english('Level 6: Common Syllables', 'Endings (ing, ion, ed)', 'Common word endings.', repeat('running walking jumping swimming jumping playing action motion option nation section acted painted loaded folded', 4), ['i','n','g','o'], 120, 25, 93, ['Memorize the muscle memory for these suffixes.']),
  english('Level 6: Common Syllables', 'Prefixes (re, un, dis)', 'Common word prefixes.', repeat('return rebuild rewrite redo undo unfair unable unbox dislike disagree disarm display discover', 4), ['r','e','u','n','d','i','s'], 120, 25, 93, ['Flow smoothly through the start of these words.']),

  // Level 7: High Frequency Words
  english('Level 7: High Frequency', 'Top 10 Words', 'The absolute most common English words.', repeat('the be to of and a in that have I it for not on with he as you do at', 6), ['t','h','e','a','n','d'], 150, 28, 93, ['You should type these entirely from muscle memory.']),
  english('Level 7: High Frequency', 'Top 50 Words', 'Expanding your core vocabulary.', repeat('this but his by from they we say her she or an will my one all would there their what', 5), ['w','h','a','t'], 150, 28, 93, ['Read the whole word, not letter by letter.']),
  english('Level 7: High Frequency', 'Action Verbs', 'Common verbs for fluid typing.', repeat('make go know take see come think look want give use find tell ask work seem feel try leave', 5), ['m','a','k','e'], 150, 30, 93, ['Maintain an even, rhythmic pace.']),

  // Level 8: Punctuation Flow
  english('Level 8: Punctuation Flow', 'Commas and Periods', 'Basic sentence boundaries.', repeat('Yes, I can. No, you cannot. Stop, look, and listen. Apples, pears, and plums. I came, I saw, I conquered.', 4), [',','.'], 150, 30, 93, ['Do not put a space before punctuation.']),
  english('Level 8: Punctuation Flow', 'Questions and Quotes', 'Advanced punctuation keys.', repeat('"Hello," she said. "Where are you going?" I asked. "To the store!" he replied. "Why?" I wondered.', 4), ['?','"','!'], 150, 30, 93, ['Watch out for the Shift key requirements here.']),
  english('Level 8: Punctuation Flow', 'Hyphens and Apostrophes', 'Contractions and compound words.', repeat('It\\'s not a big deal. They\\'re going to be late. The twenty-year-old car broke down. Don\\'t worry about it.', 4), ['\\'','-'], 150, 32, 93, ['Do not pause when typing a contraction.']),

  // Level 9: Short Sentences
  english('Level 9: Short Sentences', 'Simple Statements', 'Basic subject-verb-object flow.', repeat('The cat sat on the mat. The dog barked at the mailman. She opened the door. He read a book. The sun is shining.', 4), ['a','e','i','o','u'], 150, 35, 93, ['Read one word ahead of what you are typing.']),
  english('Level 9: Short Sentences', 'Everyday Dialog', 'Conversational sentences.', repeat('How are you doing today? I am doing very well, thank you. What time is the meeting? It starts in five minutes.', 4), ['?','a','e','i','o','u'], 150, 35, 93, ['Type the sentence as a single thought.']),
  english('Level 9: Short Sentences', 'Quick Commands', 'Short, punchy sentences.', repeat('Please wait here. Do not cross the line. Sign your name at the bottom. Keep the door closed. Thank you for your help.', 4), ['a','e','i','o','u'], 150, 38, 93, ['Keep your speed consistent across different words.']),

  // Level 10: Complex Sentences
  english('Level 10: Complex Sentences', 'Multiple Clauses', 'Sentences with commas and conjunctions.', repeat('Although it was raining heavily, they decided to go for a walk in the park. After the files were checked, the clerk prepared a summary.', 3), [',','a','t','h'], 180, 40, 94, ['Let punctuation guide your breathing and rhythm.']),
  english('Level 10: Complex Sentences', 'Lists and Series', 'Sentences containing lists.', repeat('We need to buy milk, bread, eggs, and butter from the grocery store. The team includes designers, developers, testers, and managers.', 3), [',','a','e','i','o','u'], 180, 40, 94, ['Keep the rhythm steady through the commas.']),
  english('Level 10: Complex Sentences', 'Formal Structures', 'Administrative sentence patterns.', repeat('According to the new policy, all employees must submit their reports by Friday. The committee, having reviewed the evidence, reached a final decision.', 3), [',','.'], 180, 42, 94, ['Focus on accuracy over raw speed.']),

  // Level 11: Paragraph Stamina
  english('Level 11: Paragraph Stamina', 'Narrative Paragraph', 'A continuous story paragraph.', 'The old library stood at the end of the street, its brick walls covered in thick green ivy. Inside, the air smelled of dust and old paper. Rows upon rows of wooden shelves reached up to the high ceiling, filled with books of every size and color. A narrow staircase in the corner led up to a small balcony where readers could sit quietly by a large window. It was a place where time seemed to stand completely still, far away from the noise of the city outside.', [], 180, 45, 95, ['Breathe normally and maintain a steady, unbreakable rhythm.']),
  english('Level 11: Paragraph Stamina', 'Informational Paragraph', 'A continuous factual paragraph.', 'The Earth is the third planet from the Sun and the only known astronomical object to harbor life. About seventy-one percent of the surface is covered with water, mostly by oceans. The remaining twenty-nine percent is land, consisting of continents and islands. Earth has a breathable atmosphere composed primarily of nitrogen and oxygen. The planet revolves around the Sun in just over three hundred and sixty-five days, which creates the cycle of our calendar year.', [], 180, 45, 95, ['Treat the paragraph as one long flow, not separate sentences.']),
  english('Level 11: Paragraph Stamina', 'Persuasive Paragraph', 'A continuous argumentative paragraph.', 'Learning to type efficiently is one of the most valuable skills you can acquire in the digital age. It saves countless hours of time that would otherwise be spent searching for keys. More importantly, it allows your thoughts to flow directly onto the screen without interruption. When you no longer have to think about your fingers, you can focus entirely on the quality of your writing. Consistent daily practice, even for just a few minutes, is the key to building lasting muscle memory.', [], 180, 48, 95, ['Push your speed slightly, but do not let accuracy drop below 95%.']),

  // Level 12: Professional & Exam Dictations
  english('Level 12: Exam Dictation', 'SSC Stenographer Passage', 'A realistic SSC Steno skill test passage.', 'Mr. Chairman, I rise to support the demands for grants relating to the Ministry of Agriculture. The farmers of our country have done a commendable job in ensuring food security for the entire nation. Despite facing numerous challenges such as erratic monsoons, lack of adequate irrigation facilities, and fluctuating market prices, they have worked tirelessly. The government must ensure that farmers get a remunerative price for their produce. We need to invest heavily in rural infrastructure, particularly in cold storage and warehousing facilities, to prevent post-harvest losses.', [], 240, 50, 96, ['Simulate exam conditions. Do not stop until the end.']),
  english('Level 12: Exam Dictation', 'High Court Legal Proceeding', 'A legal passage for High Court/Supreme Court exams.', 'The learned counsel appearing on behalf of the petitioner has vehemently argued that the impugned order passed by the trial court is entirely arbitrary, illegal, and contrary to the settled principles of law. It is submitted that the trial court completely failed to appreciate the documentary evidence placed on record. On the other hand, the learned public prosecutor submitted that there is no irregularity in the proceedings. Having heard the arguments from both sides and perused the material on record, this Court is of the considered opinion that the matter requires further examination.', [], 240, 50, 96, ['Pay close attention to long legal terminology.']),
  english('Level 12: Exam Dictation', 'Parliamentary Debate', 'Administrative and parliamentary vocabulary.', 'Honorable Speaker, the primary objective of this comprehensive legislation is to bring transparency and accountability into the administrative system. For too long, the common citizen has been forced to navigate a complex web of bureaucratic procedures to access basic public services. This bill proposes a time-bound delivery mechanism, which will empower the public and hold the concerned officers accountable for any unreasonable delay. Furthermore, the establishment of an independent appellate authority will provide a robust grievance redressal mechanism at the grassroots level.', [], 240, 55, 96, ['Master the formal, elevated language used in government dictations.']),
];
`;

fs.writeFileSync('src/features/typing/curriculum.ts', prefix + newEnglish + suffix);
console.log("Successfully expanded English curriculum");
