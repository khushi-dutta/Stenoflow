const fs = require('fs');

const fileContent = `/** Original practice passages. Hindi lessons use Unicode text for every keyboard layout. */
export type LayoutId = 'en_qwerty' | 'hi_inscript' | 'hi_remington' | 'hi_krutidev';

export type CourseLesson = {
  id: string;
  layoutId: LayoutId;
  module: string;
  title: string;
  description: string;
  instructions: string[];
  text: string;
  focusKeys: string[];
  durationSeconds: number;
  targetWpm: number;
  targetAccuracy: number;
};

type LessonDraft = Omit<CourseLesson, 'id' | 'layoutId'>;

const repeat = (line: string, times = 2) => Array.from({ length: times }, () => line).join(' ');
const english = (module: string, title: string, description: string, text: string, focusKeys: string[], durationSeconds: number, targetWpm: number, targetAccuracy: number, instructions: string[]): LessonDraft => ({ module, title, description, text, focusKeys, durationSeconds, targetWpm, targetAccuracy, instructions });

const englishLessons: LessonDraft[] = [
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
  english('Level 8: Punctuation Flow', 'Hyphens and Apostrophes', 'Contractions and compound words.', repeat("It's not a big deal. They're going to be late. The twenty-year-old car broke down. Don't worry about it.", 4), ["'","-"], 150, 32, 93, ['Do not pause when typing a contraction.']),

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

  // Level 13: Speed Building
  english('Level 13: Speed Building', '30-Second Sprints', 'Short bursts focused on maximum WPM.', repeat('The quick brown fox jumps over the lazy dog. A fast run makes you win the race. Focus on pure speed and do not look back.', 3), [], 30, 60, 92, ['Type as fast as possible. Ignore minor errors.']),
  english('Level 13: Speed Building', '1-Minute Speed Test', 'Maintain speed while controlling errors.', repeat('Speed requires relaxation. Tension in the hands will slow you down. Let your fingers glide over the keyboard without hesitation. The more you relax, the faster you will type.', 4), [], 60, 55, 94, ['Find a comfortable rhythm and hold it.']),
  english('Level 13: Speed Building', '2-Minute Endurance', 'Build consistency over longer passages.', repeat('Typing endurance is built through continuous practice. When you type for several minutes, your mind may wander. Pull your focus back to the current word. Do not let one mistake derail your entire passage. Keep moving forward steadily.', 5), [], 120, 50, 95, ['Maintain focus for the entire duration.']),

  // Level 14: Accuracy Mastery
  english('Level 14: Accuracy Mastery', 'Common Error Words', 'Practice words that commonly cause mistakes.', repeat('receive weird believe separate definitely occurred accommodate embarrass unnecessary privilege', 4), [], 120, 45, 98, ['Focus intensely on the spelling of each word.']),
  english('Level 14: Accuracy Mastery', 'Keyboard Accuracy Drills', 'Target frequently mistyped key combinations.', repeat('minimum pumpkin vacuum rhythm syzygy queue fuchsia zephyr awkward sphinx', 5), [], 120, 45, 98, ['Do not rush these awkward finger movements.']),
  english('Level 14: Accuracy Mastery', '95%+ Accuracy Challenge', 'Maintain high accuracy while increasing speed.', repeat('The primary goal here is absolute precision. A fast typist who makes many errors is ultimately slower than a deliberate typist who makes none. Accuracy always precedes speed.', 4), [], 120, 50, 97, ['Do not let your accuracy drop.']),

  // Level 15: Difficult Letter Combinations
  english('Level 15: Difficult Combinations', 'Double Letters', 'Practice words with double letters.', repeat('balloon buzzword success slippery narrate wrapper kettle sudden pebble ribbon sudden', 5), [], 120, 45, 95, ['Bounce your finger cleanly on double letters.']),
  english('Level 15: Difficult Combinations', 'Consonant Clusters', 'Practice tricky consonant groupings.', repeat('strength scratch splash spring throw rhythm twelfth knapsack schedule lengths', 5), [], 120, 45, 95, ['Flow smoothly through the clusters.']),
  english('Level 15: Difficult Combinations', 'Long Word Patterns', 'Practice long administrative words.', repeat('government administration constitutional responsibility implementation correspondence jurisdiction', 4), [], 150, 45, 95, ['Break long words into syllables in your mind.']),

  // Level 16: Advanced Vocabulary
  english('Level 16: Advanced Vocabulary', 'Government Terminology', 'Ministry and departmental words.', repeat('Ministry Department Notification Legislation Regulation Ordinance Parliament Secretariat Directive', 4), ['Shift'], 150, 50, 95, ['Capitalize correctly.']),
  english('Level 16: Advanced Vocabulary', 'Legal Vocabulary', 'Court and legal terms.', repeat('Petition Affidavit Jurisdiction Prosecution Respondent Appellant Defendant Subpoena Litigation', 4), ['Shift'], 150, 50, 95, ['Maintain rhythm through unfamiliar terms.']),
  english('Level 16: Advanced Vocabulary', 'Administrative Vocabulary', 'Office and executive terms.', repeat('Authority Correspondence Appointment Implementation Proceedings Resolution Executive Committee', 4), ['Shift'], 150, 50, 95, ['Type confidently.']),

  // Level 17: Numbers & Data
  english('Level 17: Numbers & Data', 'Large Numbers', 'Typing figures with commas.', repeat('1,25,000 10,50,000 5,00,000 3,45,678 9,99,999 12,34,567 50,000 1,00,000', 4), ['0','1','2','3','4','5','6','7','8','9',','], 120, 40, 96, ['Watch the commas carefully.']),
  english('Level 17: Numbers & Data', 'Dates and Percentages', 'Alphanumeric data.', repeat('3 October 2026, 15th August 1947, 26 January 1950. Growth was 72.5% and 14.8%.', 4), ['0','1','2','3','4','5','6','7','8','9','%'], 150, 45, 96, ['Keep your hands anchored on the home row when reaching.']),
  english('Level 17: Numbers & Data', 'Money and Statistics', 'Financial formatting.', repeat('The cost is $450.75 or ₹35,000. The ratio is 4:5. The total sum was $1,200,500.50.', 4), ['$', '₹', '.', ':', 'Shift'], 150, 45, 96, ['Find the symbol keys without looking.']),

  // Level 18: Special Symbols
  english('Level 18: Special Symbols', 'Brackets & Parentheses', 'Enclosing text.', repeat('(Optional) [Draft] {Main} (See attached) [Section 4] {Clause B}', 4), ['(', ')', '[', ']', '{', '}'], 120, 40, 95, ['Use the correct shift hand.']),
  english('Level 18: Special Symbols', 'Slash, Colon & Semicolon', 'Punctuation and paths.', repeat('True/False Yes/No Date: Time: Note; However; http://example.com/page', 4), ['/', ':', ';'], 120, 45, 95, ['Do not confuse colon and semicolon.']),
  english('Level 18: Special Symbols', 'Misc Symbols', 'Other common symbols.', repeat('Email user@domain.com. We are #1. Profit & Loss. Margin of +5% or -2%. A = B.', 4), ['@', '#', '&', '+', '=', '-'], 150, 45, 95, ['Reach carefully.']),

  // Level 19: Professional Typing
  english('Level 19: Professional Typing', 'Official Emails', 'Standard email formats.', 'Dear Sir/Madam, Please find attached the report for the current quarter. We have highlighted the key metrics in section 2. Kindly review the document and provide your feedback by Friday. Best regards, Management Team.', [], 180, 50, 96, ['Type as you would at work.']),
  english('Level 19: Professional Typing', 'Government Notices', 'Formal notification structures.', 'NOTICE: It is hereby informed that the office will remain closed on the 15th of August due to Independence Day. All pending applications submitted before the 10th of August have been processed. By Order, Secretary.', [], 180, 50, 96, ['Maintain formal accuracy.']),

  // Level 20: Stenography Vocabulary
  english('Level 20: Steno Vocabulary', 'Court Proceedings', 'High Court dictation snippets.', 'The learned counsel for the petitioner submitted that the impugned order is liable to be set aside. The respondent failed to file the counter affidavit within the stipulated time of four weeks.', [], 180, 55, 97, ['Prepare for legal dictation.']),
  english('Level 20: Steno Vocabulary', 'Parliamentary Speech', 'Lok Sabha / Rajya Sabha excerpts.', 'Mr. Speaker Sir, the budget presented by the honorable Finance Minister addresses the core issues of the agricultural sector. The allocation of funds for rural development has been significantly increased this year.', [], 180, 55, 97, ['Prepare for parliamentary dictation.'])
];

type HindiDraft = Omit<LessonDraft, 'focusKeys'> & {
  focusKeys?: Record<Exclude<LayoutId,'en_qwerty'>, string[]>
};

const hindi = (module: string, title: string, description: string, text: string, durationSeconds: number, targetWpm: number, targetAccuracy: number, instructions: string[], focusKeys?: Record<Exclude<LayoutId,'en_qwerty'>, string[]>): HindiDraft => ({ module, title, description, text, durationSeconds, targetWpm, targetAccuracy, instructions, focusKeys });

const hindiLessons: HindiDraft[] = [
  // Level 1: पहले व्यंजन
  hindi('Level 1: पहले व्यंजन', 'क र त', 'सबसे उपयोगी व्यंजनों पर हाथ की स्थिति बनाएं। बिना मात्रा के अभ्यास।', repeat('कर तर तक करत कतर तरक तकत रतक', 6), 120, 8, 93, ['चयनित कीबोर्ड लेआउट पर सही कुंजियाँ दबाएँ।'], { hi_inscript: ['k','j','l'], hi_remington: ['d','j','r'], hi_krutidev: ['d','j','r'] }),
  hindi('Level 1: पहले व्यंजन', 'प स म', 'नए व्यंजन सीखें और पुरानी कुंजियों के साथ मिलाएँ।', repeat('पस सम पम सप मस पसम सपम मपस समप पस सम पम', 6), 120, 8, 93, ['हल्के हाथों से टाइप करें।'], { hi_inscript: ['h','m','c'], hi_remington: ['i','l','e'], hi_krutidev: ['i','l','e'] }),
  hindi('Level 1: पहले व्यंजन', 'न ल ज', 'और व्यंजनों का अभ्यास करें।', repeat('नल जल जन नजल जतन लनज तज तजल जनल नल जल जन', 6), 120, 8, 93, ['उंगलियों को होम रो पर वापस लाएँ।'], { hi_inscript: ['v','n','p'], hi_remington: ['u','y','t'], hi_krutidev: ['u','y','t'] }),
  hindi('Level 1: पहले व्यंजन', 'बिना मात्रा के शब्द', 'बिना मात्रा के सरल शब्द।', repeat('कमल नमक गरम चमन पतन सफल फसल सरकस मतलब जलचर अवसर लगभग हलचल बरतन नमन', 4), 120, 10, 93, ['प्रत्येक शब्द को ध्यान से पढ़ें और टाइप करें।']),

  // Level 2: आ की मात्रा
  hindi('Level 2: आ की मात्रा', 'का रा ता', 'आ की मात्रा का अभ्यास। व्यंजन के बाद मात्रा टाइप करें।', repeat('कार तार रात काका राका ताता तारा कारा राता कातर ताता कार', 6), 150, 10, 93, ['हमेशा व्यंजन के बाद आ की मात्रा लगाएं।'], { hi_inscript: ['k','j','l','e'], hi_remington: ['d','j','r','k'], hi_krutidev: ['d','j','r','k'] }),
  hindi('Level 2: आ की मात्रा', 'आ मात्रा के शब्द', 'आ की मात्रा वाले शब्द।', repeat('राम काम नाम माला तारा छाता बाजा राजा माता पिता दादा नाना मामा ताला पाना जाना', 4), 150, 12, 93, ['मात्रा सही अक्षर से जोड़ें।']),
  hindi('Level 2: आ की मात्रा', 'मिश्रित अभ्यास', 'बिना मात्रा और आ की मात्रा वाले शब्दों का मिश्रण।', repeat('राम कमल काम नमक नाम गरम बाजार हलचल समाचार सरकार घर कर काम आराम नाम फल', 4), 150, 12, 93, ['गति बढ़ाने से पहले शब्द को पढ़ लें।']),

  // Level 3: इ ई की मात्राएँ
  hindi('Level 3: इ ई की मात्राएँ', 'छोटी इ', 'छोटी इ की मात्रा। ध्यान दें, इसे हमेशा व्यंजन के बाद टाइप किया जाता है।', repeat('दिन गिन पिन मिल सिल हिल मिलन हिरन सितार किताब हिसाब विमान किसान गिलास शिकार किरण', 4), 150, 12, 93, ['रेमिंगटन/कृतिदेव में इ की मात्रा पहले या बाद में आ सकती है (लेआउट पर निर्भर करता है), ट्यूटर के निर्देशों का पालन करें।']),
  hindi('Level 3: इ ई की मात्राएँ', 'बड़ी ई', 'बड़ी ई की मात्रा का अभ्यास।', repeat('तीर नीर पीर गीत मीत रीत सीता गीता मीना चीता हाथी पानी नानी चाची साड़ी गर्मी सर्दी', 4), 150, 12, 93, ['बड़ी ई की मात्रा हमेशा व्यंजन के बाद आती है।']),
  hindi('Level 3: इ ई की मात्राएँ', 'इ ई के शब्द', 'दोनों मात्राओं का मिश्रित अभ्यास।', repeat('दिन तीर गिन नीर पिन पीर किताब सीता हिसाब गीता हिरन पानी सितार चीता विमान दादी', 4), 150, 12, 93, ['मात्राओं में अंतर पहचानें।']),

  // Level 4: उ ऊ ए ऐ ओ औ
  hindi('Level 4: उ ऊ ए ऐ ओ औ', 'उ ऊ की मात्राएँ', 'छोटे उ और बड़े ऊ की मात्राएँ।', repeat('चुप धूप पुल फूल सुन धूल साबुन गुलाब कछुआ चूहिया भालू मूली सूरज खजूर कपूर नाखून', 4), 150, 13, 93, ['समान दिखने वाली मात्राओं पर ध्यान दें।']),
  hindi('Level 4: उ ऊ ए ऐ ओ औ', 'ए ऐ ओ औ', 'बाकी सभी मुख्य मात्राएँ।', repeat('पेड़ पैर मोर दौड़ खेल मैल शेर बेर सेब केला पैसा मैला बैल शोर चोर कौआ पौधा खिलौना', 4), 150, 13, 93, ['सही मात्रा का चुनाव करें।']),
  hindi('Level 4: उ ऊ ए ऐ ओ औ', 'सभी मात्राएँ', 'सभी मात्राओं का मिश्रित अभ्यास।', repeat('पेड़ चुप मोर तीर दिन फूल पैसा मैला सूरज किताब पानी शेर कौआ पौधा गुलाब हाथी', 4), 150, 13, 93, ['ध्यान से पढ़ें और लय बनाए रखें।']),

  // Level 5: अनुस्वार और विसर्ग
  hindi('Level 5: अनुस्वार और विसर्ग', 'अनुस्वार', 'बिंदु वाले शब्द।', repeat('रंग भंग संग अंग जंग तंग शंकर चंपक मंजन खंजन कंचन चंचल सुंदर मंदिर बंदर जंगल मंगल', 4), 150, 14, 93, ['बिंदु को ध्यान से देखें।']),
  hindi('Level 5: अनुस्वार और विसर्ग', 'चंद्रबिंदु और विसर्ग', 'चंद्रबिंदु और विसर्ग का अभ्यास।', repeat('चाँद प्रात: गाँव दुःख छाँव अंततः बाँसुरी आँगन काँच साँस प्रायः छः नमः अतः मूलतः', 4), 150, 14, 93, ['चिह्नों को ध्यान से लिखें।']),
  hindi('Level 5: अनुस्वार और विसर्ग', 'बिंदु वाले शब्द', 'अनुस्वार वाले मिश्रित शब्द।', repeat('संसार पतंग चंदन मंदिर जंगल मंगल चाँद प्रात: गाँव दुःख बाँसुरी आँगन सुंदर बंदर छः', 4), 150, 14, 93, ['शब्दों के भीतर अतिरिक्त स्थान न दें।']),

  // Level 6: महाप्राण व्यंजन
  hindi('Level 6: महाप्राण व्यंजन', 'ख घ छ झ', 'महाप्राण व्यंजनों का अभ्यास।', repeat('खग घर छत झट खत घन खाना घड़ी छतरी झाड़ू खेत घोड़ा छाल झील खेल घास छात्र झुंड', 4), 150, 14, 93, ['शिफ्ट की (Shift key) का प्रयोग सही समय पर करें।']),
  hindi('Level 6: महाप्राण व्यंजन', 'थ ध ठ ढ फ भ', 'अन्य महाप्राण व्यंजन।', repeat('रथ धन ठग ढल फल भर थाली धागा ठीक ढक्कन फूल भालू थकान धरती ठेला ढोलक फौजी भारत', 4), 150, 14, 93, ['सही अक्षर पहचानें।']),
  hindi('Level 6: महाप्राण व्यंजन', 'महाप्राण शब्द', 'महाप्राण व्यंजनों के मिश्रित शब्द।', repeat('भगत फलक ढोलक थकान छतरी झरना खाना घड़ी थाली धागा ठीक ढक्कन फूल भालू खेत घोड़ा', 4), 150, 15, 93, ['गति के साथ शुद्धता बनाए रखें।']),

  // Level 7: संयुक्ताक्षर
  hindi('Level 7: संयुक्ताक्षर', 'हलंत जोड़', 'हलंत (्) का उपयोग करके आधे अक्षर बनाना।', repeat('सत्य तथ्य मग्न लग्न विघ्न अस्त्र कन्या शय्या ग्वाला प्यास व्यापार अभ्यास न्याय द्वार विद्वान', 4), 150, 15, 93, ['हलंत हिंदी टाइपिंग का एक महत्वपूर्ण हिस्सा है।']),
  hindi('Level 7: संयुक्ताक्षर', 'क्ष त्र ज्ञ श्र', 'विशेष संयुक्ताक्षर।', repeat('क्षमा त्रिशूल ज्ञान श्रम क्षेत्र पत्र कक्षा चित्र अज्ञान आश्रम क्षत्रिय त्रिभुज विज्ञान परिश्रम', 4), 150, 15, 93, ['इन अक्षरों को टाइप करने का तरीका याद रखें।']),
  hindi('Level 7: संयुक्ताक्षर', 'संयुक्ताक्षर शब्द', 'कठिन संयुक्त शब्द।', repeat('परिश्रम विज्ञान त्रिकोण क्षत्रिय प्रस्थान सत्य तथ्य मग्न कन्या शय्या ग्वाला प्यास न्याय', 4), 150, 15, 93, ['संयुक्त अक्षरों को ध्यान से जाँचें।']),

  // Level 8: नुक्ता वर्ण
  hindi('Level 8: नुक्ता वर्ण', 'ज़ फ़ ड़ ढ़', 'नुक्ता वाले अक्षर। नुक्ता लगाना न भूलें।', repeat('ज़ोर साफ़ सड़क पढ़ना ज़मीन फ़सल राज़ लिफ़ाफ़ा कड़कना चढ़ाई मज़बूत फ़ैसला ज़ीरा सफ़ेद', 4), 150, 16, 93, ['परीक्षाओं में नुक्ता न लगाना गलती मानी जाती है।']),
  hindi('Level 8: नुक्ता वर्ण', 'नुक्ता शब्द', 'नुक्ता वाले बड़े शब्द।', repeat('ज़िंदगी फ़ैसला कड़कना चढ़ाई मज़बूत राज़ लिफ़ाफ़ा ज़ीरा सफ़ेद ज़ोर साफ़ सड़क पढ़ना ज़मीन', 4), 150, 16, 93, ['नुक्ता हमेशा सही स्थान पर लगाएं।']),

  // Level 9: सामान्य शब्द
  hindi('Level 9: सामान्य शब्द', 'सामान्य शब्द 1', 'अक्सर उपयोग होने वाले शब्द।', repeat('यह वह और कि का की के है में से को ने पर तक भी ही तो था थी थे', 6), 150, 18, 93, ['पूरे शब्द को एक लय में टाइप करें।']),
  hindi('Level 9: सामान्य शब्द', 'सामान्य शब्द 2', 'अक्सर उपयोग होने वाले क्रिया और विशेषण।', repeat('करना होना जाना बहुत कम ज्यादा अच्छा बुरा बड़ा छोटा आना खाना पीना सोना देना लेना पाना', 5), 150, 18, 93, ['हर शब्द के बाद एक स्पेस दें।']),
  hindi('Level 9: सामान्य शब्द', 'सामान्य शब्द 3', 'कार्यालयीन उपयोग के सामान्य शब्द।', repeat('कार्यालय पत्र अधिकारी महोदय निवेदन सूचना आदेश नियम सरकार विकास विभाग समिति प्रस्ताव योजना निर्णय', 4), 150, 18, 93, ['प्रशासनिक शब्दावली का प्रवाह बढ़ाएं।']),

  // Level 10: वाक्य
  hindi('Level 10: वाक्य', 'वाक्य अभ्यास 1', 'सरल वाक्य पूर्ण विराम (।) के साथ।', repeat('मेरा नाम राम है। मैं घर जाता हूँ। वह किताब पढ़ता है। बच्चे मैदान में खेल रहे हैं। आज मौसम बहुत अच्छा है। हम कल दिल्ली जाएंगे।', 3), 180, 20, 93, ['पूर्ण विराम लगाना न भूलें।']),
  hindi('Level 10: वाक्य', 'वाक्य अभ्यास 2', 'प्रश्नवाचक वाक्य।', repeat('तुम क्या कर रहे हो? क्या वह आ गया? आपका नाम क्या है? बैठक कब शुरू होगी? क्या आपने काम पूरा कर लिया? हम कहाँ जा रहे हैं?', 3), 180, 20, 93, ['प्रश्नवाचक चिह्न सही स्थान पर रखें।']),
  hindi('Level 10: वाक्य', 'वाक्य अभ्यास 3', 'अल्पविराम वाले वाक्य।', repeat('राम, श्याम और मोहन बाजार गए। मुझे सेब, केला, और संतरा पसंद है। अगर तुम मेहनत करोगे, तो सफल हो जाओगे। काम पूरा होने के बाद, वह घर चला गया।', 3), 180, 22, 93, ['अल्पविराम के बाद हल्का सा रुकें।']),
  hindi('Level 10: वाक्य', 'वाक्य अभ्यास 4', 'कठिन शब्दों वाले वाक्य।', repeat('विद्यालय की नई समय सारिणी आज जारी हुई। सभी विद्यार्थियों को इसकी सूचना दे दी गई है। अगले सप्ताह से कक्षाएं नए समय पर शुरू होंगी। पढ़ाई पर विशेष ध्यान दिया जाएगा।', 3), 180, 22, 93, ['कठिन शब्दों पर गति घटाएँ और शुद्धता बढ़ाएँ।']),
  hindi('Level 10: वाक्य', 'वाक्य अभ्यास 5', 'प्रशासनिक वाक्य।', repeat('सभी कर्मचारियों को सूचित किया जाता है कि वे समय पर कार्यालय पहुंचें। अनुपस्थित रहने वालों पर अनुशासनात्मक कार्रवाई की जाएगी। कृपया इस निर्देश का पालन करें।', 3), 180, 24, 93, ['कार्यालयीन भाषा के प्रवाह को महसूस करें।']),
  hindi('Level 10: वाक्य', 'वाक्य अभ्यास 6', 'मिश्रित वाक्य।', repeat('अतः आपसे निवेदन है कि कृपया जल्द निर्णय लें। इस मामले में कोई देरी नहीं होनी चाहिए। अगर कोई समस्या हो, margin आप सीधे संपर्क कर सकते हैं। धन्यवाद।', 3), 180, 24, 93, ['वाक्य पूरा होने पर स्वाभाविक विराम लें।']),

  // Level 11: अनुच्छेद
  hindi('Level 11: अनुच्छेद', 'अनुच्छेद 1', 'परीक्षा जैसा छोटा अनुच्छेद।', 'नियमित अभ्यास से लिखने की गति धीरे-धीरे सुधरती है। पहले दिन कठिन लगने वाले शब्द कुछ समय बाद सहज होने लगते हैं। अभ्यास करते समय शरीर को आरामदायक स्थिति में रखें और हर गलती पर रुकने के बजाय आगे बढ़ें। सत्र समाप्त होने पर उन्हीं शब्दों को फिर लिखें जो बार-बार गलत हुए थे। इस तरह छोटा प्रयास भी उपयोगी सीख में बदल जाता है। निरंतरता ही सफलता की असली कुंजी है।', 180, 24, 93, ['समय को देखकर घबराएँ नहीं।']),
  hindi('Level 11: अनुच्छेद', 'अनुच्छेद 2', 'सूचना प्रधान अनुच्छेद।', 'नगर के सार्वजनिक पुस्तकालय में इस महीने नई पुस्तकों का संग्रह आया है। बच्चों के लिए अलग कक्ष बनाया गया है और पढ़ने की मेजों पर बेहतर प्रकाश की व्यवस्था की गई है। पुस्तकालय के कर्मचारी आगंतुकों को सूची देखने और पुस्तक चुनने में पूरी सहायता करते हैं। अगले सप्ताह एक छोटा पाठक कार्यक्रम होगा, जिसमें लोग अपनी पसंद की पुस्तक के बारे में बात कर सकेंगे। इस कार्यक्रम से बच्चों में पढ़ने की रुचि बढ़ेगी।', 180, 24, 93, ['हर वाक्य को पूरा विचार मानकर लिखें।']),
  hindi('Level 11: अनुच्छेद', 'अनुच्छेद 3', 'प्रशासनिक और लंबा अनुच्छेद।', 'किसी भी महत्वपूर्ण निर्णय से पहले उपलब्ध तथ्यों को ध्यान से देखना चाहिए। संबंधित लोगों को अपनी बात रखने का अवसर मिले तो रिकॉर्ड अधिक भरोसेमंद बनता है। अधिकारी को नियम पढ़कर उसके कारण स्पष्ट भाषा में बताने चाहिए। यदि कोई तथ्य अधूरा हो, तो अनुमान लगाने के बजाय नई जानकारी माँगना उचित है। ऐसी पारदर्शी प्रक्रिया से लोगों का विश्वास बढ़ता है और भविष्य में होने वाली गलतियों की संभावना भी कम हो जाती है।', 180, 26, 93, ['अंत तक समान गति रखें।']),

  // Level 12: प्रतियोगी परीक्षा
  hindi('Level 12: प्रतियोगी परीक्षा', 'एसएससी स्टेनोग्राफर (SSC Steno)', 'एसएससी ग्रेड सी और डी के लिए विशेष अभ्यास।', 'अध्यक्ष महोदय, मैं यह कहना चाहता हूँ कि सरकार ने जो नीति अपनाई है वह बहुत अच्छी है। इस नीति से देश के करोड़ों किसानों और मजदूरों को बहुत लाभ होगा। हम सभी को मिलकर इस नीति का समर्थन करना चाहिए। पिछले कुछ वर्षों में कृषि के क्षेत्र में जो सुधार किए गए हैं, वे सराहनीय हैं। हमें ग्रामीण क्षेत्रों में रोजगार के नए अवसर पैदा करने पर विशेष ध्यान देना चाहिए ताकि पलायन को रोका जा सके।', 180, 28, 94, ['उच्च गति और 94% शुद्धता का लक्ष्य रखें।']),
  hindi('Level 12: प्रतियोगी परीक्षा', 'न्यायालय (High Court)', 'न्यायालय की कार्यवाही और कानूनी शब्दावली।', 'अपीलकर्ता की ओर से उपस्थित विद्वान अधिवक्ता ने यह तर्क दिया कि निचली अदालत का फैसला तथ्यों और कानून पर आधारित नहीं है। न्यायालय ने सभी गवाहों के बयानों को ध्यान से पढ़ा और यह पाया कि अभियोजन पक्ष अपना मामला संदेह से परे साबित करने में पूरी तरह से विफल रहा है। इसलिए, न्यायालय आरोपी को सभी आरोपों से दोषमुक्त करता है और उसकी तत्काल रिहाई का आदेश देता है।', 180, 30, 94, ['कठिन कानूनी शब्दों पर विशेष ध्यान दें।']),
  hindi('Level 12: प्रतियोगी परीक्षा', 'राज्य सेवा (State Exams)', 'राज्य स्तरीय परीक्षाओं के लिए कठिन अनुच्छेद।', 'पर्यावरण संरक्षण आज की सबसे बड़ी चुनौती बन गया है। बढ़ते प्रदूषण और वनों की कटाई के कारण जलवायु परिवर्तन हो रहा है, जिसका सीधा प्रभाव हमारी खेती, जल संसाधनों और स्वास्थ्य पर पड़ रहा है। सरकार ने इस दिशा में कई कदम उठाए हैं, लेकिन जनभागीदारी के बिना कोई भी योजना सफल नहीं हो सकती। हम सबको मिलकर पेड़ लगाने, प्लास्टिक का उपयोग कम करने और ऊर्जा की बचत करने का संकल्प लेना होगा।', 180, 30, 95, ['लंबे शब्दों को बिना रुके टाइप करें।']),

  // Level 13: Speed Building
  hindi('Level 13: गति निर्माण', '30-सेकंड स्प्रिंट', 'अधिकतम गति पर ध्यान दें।', repeat('तेज़ दौड़ना और रुकना नहीं। अपनी उंगलियों को कीबोर्ड पर तेज़ी से चलाएं। पीछे मुड़कर गलतियों को न देखें। सिर्फ आगे बढ़ें।', 3), 30, 25, 92, ['जितनी जल्दी हो सके टाइप करें।']),
  hindi('Level 13: गति निर्माण', '1-मिनट टेस्ट', 'गति और शुद्धता का संतुलन।', repeat('टाइपिंग में गति बढ़ाने के लिए हाथों का शांत होना ज़रूरी है। तनाव से उंगलियां धीमी हो जाती हैं। आराम से टाइप करने पर गति अपने आप बढ़ जाएगी।', 4), 60, 25, 94, ['एक स्थिर लय खोजें।']),
  hindi('Level 13: गति निर्माण', '2-मिनट सहनशक्ति', 'लंबे समय तक टाइप करने की आदत डालें।', repeat('लगातार टाइप करने से सहनशक्ति बढ़ती है। जब आप कई मिनटों तक टाइप करते हैं, तो ध्यान भटक सकता है। अपनी एकाग्रता बनाए रखें और गलतियों से घबराएं नहीं।', 4), 120, 25, 95, ['पूरे समय एकाग्रता बनाए रखें।']),

  // Level 14: Accuracy Mastery
  hindi('Level 14: सटीकता महारत', 'सामान्य त्रुटि वाले शब्द', 'ऐसे शब्द जिनमें अक्सर गलती होती है।', repeat('आशीर्वाद उज्ज्वल कवयित्री प्रज्वलित संन्यासी रचयिता शृंगार उपर्युक्त अनुग्रहीत', 4), 120, 20, 98, ['हर शब्द की वर्तनी पर ध्यान दें।']),
  hindi('Level 14: सटीकता महारत', 'कठिन संयोजन', 'कठिन अक्षरों का समूह।', repeat('द्वंद्व अस्त्र शास्त्र स्वास्थ्य ज्योत्स्ना भर्त्सना उच्छृंखल महत्त्वाकांक्षा', 4), 120, 20, 98, ['इन शब्दों में जल्दीबाज़ी न करें।']),
  hindi('Level 14: सटीकता महारत', '95%+ एक्यूरेसी चैलेंज', 'बिना गलती किए टाइप करें।', repeat('यहाँ मुख्य लक्ष्य पूर्ण सटीकता है। एक तेज़ टाइपिस्ट जो कई गलतियाँ करता है, वह उस टाइपिस्ट से धीमा है जो कोई गलती नहीं करता। शुद्धता सबसे पहले है।', 4), 120, 25, 97, ['सटीकता को कम न होने दें।']),

  // Level 15: Difficult Combinations
  hindi('Level 15: कठिन अक्षर', 'संयुक्त वर्ण', 'आधे अक्षरों का अभ्यास।', repeat('कच्चा पक्का सच्चा मक्का दिल्ली बिल्ली खट्टा मीठा गद्दा चद्दर बच्चा', 5), 120, 25, 95, ['हलंत का सही उपयोग करें।']),
  hindi('Level 15: कठिन अक्षर', 'र के विभिन्न रूप', 'रेफ और पदेन का अभ्यास।', repeat('कर्म धर्म मर्म क्रम भ्रम उग्र राष्ट्र ट्रक ड्रम प्रकृति प्रवृत्ति', 5), 120, 25, 95, ['र के अलग-अलग रूपों को समझें।']),
  hindi('Level 15: कठिन अक्षर', 'लंबे शब्द', 'लंबे प्रशासनिक शब्द।', repeat('अंतर्राष्ट्रीय विश्वविद्यालय आवश्यकतानुसार स्थानांतरण व्यवस्थापन कार्यप्रणाली', 4), 150, 25, 95, ['लंबे शब्दों को मन में तोड़कर टाइप करें।']),

  // Level 16: Advanced Vocabulary
  hindi('Level 16: उन्नत शब्दावली', 'सरकारी शब्दावली', 'मंत्रालय और विभाग के शब्द।', repeat('मंत्रालय विभाग अधिसूचना विधान अध्यादेश संसद सचिवालय निर्देश परिपत्र', 4), 150, 28, 95, ['कार्यालयीन शब्दों पर पकड़ बनाएं।']),
  hindi('Level 16: उन्नत शब्दावली', 'कानूनी शब्दावली', 'न्यायालय के शब्द।', repeat('याचिका हलफनामा क्षेत्राधिकार अभियोजन प्रतिवादी अपीलकर्ता मुवक्किल मुकदमा', 4), 150, 28, 95, ['अदालती भाषा से परिचित हों।']),
  hindi('Level 16: उन्नत शब्दावली', 'प्रशासनिक शब्दावली', 'कार्यालय के अन्य शब्द।', repeat('प्राधिकरण पत्राचार नियुक्ति कार्यान्वयन कार्यवाही संकल्प कार्यकारी समिति', 4), 150, 28, 95, ['प्रशासनिक शब्दों को लय में लिखें।']),

  // Level 17: Numbers & Data
  hindi('Level 17: संख्या और आँकड़े', 'बड़ी संख्याएँ', 'अंकों का अभ्यास।', repeat('1,25,000 10,50,000 5,00,000 3,45,678 9,99,999 12,34,567 50,000 1,00,000', 4), 120, 20, 96, ['अंकों के बीच कोमा (,) ध्यान से लगाएं।']),
  hindi('Level 17: संख्या और आँकड़े', 'तिथियाँ और प्रतिशत', 'दिनांक और प्रतिशत।', repeat('3 अक्टूबर 2026, 15 अगस्त 1947, 26 जनवरी 1950. वृद्धि दर 72.5% और 14.8% रही।', 4), 150, 25, 96, ['अंकों और टेक्स्ट के बीच समन्वय बनाएं।']),

  // Level 18: Special Symbols
  hindi('Level 18: विशेष चिह्न', 'कोष्ठक और स्लैश', 'ब्रैकेट्स और अन्य चिह्न।', repeat('(वैकल्पिक) [प्रारूप] {मुख्य} सही/गलत हाँ/नहीं दिनांक: समय: विवरण;', 4), 120, 20, 95, ['चिह्नों को सावधानी से चुनें।']),
  hindi('Level 18: विशेष चिह्न', 'विविध चिह्न', 'अन्य सामान्य चिह्न।', repeat('ईमेल abc@domain.com. हम #1 हैं। लाभ +5% या -2% हुआ।', 4), 120, 20, 95, ['इन चिह्नों की प्रैक्टिस करें।']),

  // Level 19: Professional Typing
  hindi('Level 19: व्यावसायिक टाइपिंग', 'सरकारी सूचना', 'औपचारिक नोटिस।', 'सूचना: एतद्द्वारा सूचित किया जाता है कि स्वतंत्रता दिवस के अवसर पर 15 अगस्त को कार्यालय बंद रहेगा। 10 अगस्त तक प्राप्त सभी आवेदनों का निपटान कर दिया गया है। आज्ञा से, सचिव।', 180, 28, 96, ['सरकारी शैली में टाइप करें।']),

  // Level 20: Steno Vocabulary
  hindi('Level 20: आशुलिपि शब्दावली', 'न्यायालय श्रुतिलेख', 'हाईकोर्ट डिक्टेशन का अंश।', 'याचिकाकर्ता के विद्वान अधिवक्ता ने प्रस्तुत किया कि आक्षेपित आदेश निरस्त किए जाने योग्य है। प्रतिवादी चार सप्ताह की निर्धारित अवधि के भीतर जवाबी हलफनामा दाखिल करने में विफल रहा।', 180, 30, 97, ['लीगल डिक्टेशन की तैयारी करें।']),
  hindi('Level 20: आशुलिपि शब्दावली', 'संसदीय भाषण', 'लोकसभा/राज्यसभा का अंश।', 'अध्यक्ष महोदय, माननीय वित्त मंत्री द्वारा प्रस्तुत बजट कृषि क्षेत्र के मूल मुद्दों को संबोधित करता है। इस वर्ष ग्रामीण विकास के लिए धन का आवंटन काफी बढ़ा दिया गया है।', 180, 30, 97, ['संसदीय डिक्टेशन की तैयारी करें।'])
];

const hindiLayouts: Array<{ id: LayoutId; name: string; note: string }> = [
  { id: 'hi_inscript', name: 'InScript', note: 'InScript: क = K, र = J, त = L. Type a consonant before its vowel sign, even when ि appears on its left.' },
  { id: 'hi_remington', name: 'Remington GAIL', note: 'Unicode Remington GAIL: क = D, र = J, त = R. For कि, type D then F.' },
  { id: 'hi_krutidev', name: 'KrutiDev 010', note: 'Legacy KrutiDev key order: क = D, र = J, त = R. For कि, type F before D; the tutor converts the preview to Unicode.' },
];

export const typingLessons: CourseLesson[] = [
  ...englishLessons.map((lesson, index) => ({ ...lesson, id: \`en-qwerty-\${String(index + 1).padStart(2, '0')}\`, layoutId: 'en_qwerty' as const })),
  ...hindiLayouts.flatMap(layout => hindiLessons.map((lesson, index) => ({
    ...lesson,
    id: \`\${layout.id.replace(/_/g, '-')}-\${String(index + 1).padStart(2, '0')}\`,
    layoutId: layout.id,
    instructions: [layout.note, ...lesson.instructions],
    focusKeys: lesson.focusKeys?.[layout.id as Exclude<LayoutId,'en_qwerty'>] ?? [],
  }))),
];
`;

fs.writeFileSync('src/features/typing/curriculum.ts', fileContent);
