const fs = require('fs');
let code = fs.readFileSync('src/features/typing/curriculum.ts', 'utf8');

const englishNew = `
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
  english('Level 20: Steno Vocabulary', 'Parliamentary Speech', 'Lok Sabha / Rajya Sabha excerpts.', 'Mr. Speaker Sir, the budget presented by the honorable Finance Minister addresses the core issues of the agricultural sector. The allocation of funds for rural development has been significantly increased this year.', [], 180, 55, 97, ['Prepare for parliamentary dictation.'])`;

const hindiNew = `
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
  hindi('Level 20: आशुलिपि शब्दावली', 'संसदीय भाषण', 'लोकसभा/राज्यसभा का अंश।', 'अध्यक्ष महोदय, माननीय वित्त मंत्री द्वारा प्रस्तुत बजट कृषि क्षेत्र के मूल मुद्दों को संबोधित करता है। इस वर्ष ग्रामीण विकास के लिए धन का आवंटन काफी बढ़ा दिया गया है।', 180, 30, 97, ['संसदीय डिक्टेशन की तैयारी करें।'])`;

const englishTarget = "['Master the formal, elevated language used in government dictations.']),\n];";
const hindiTarget = "['लंबे शब्दों को बिना रुके टाइप करें।']),\n];";

if (!code.includes(englishTarget)) {
  console.log("Could not find english insertion point");
  process.exit(1);
}
if (!code.includes(hindiTarget)) {
  console.log("Could not find hindi insertion point");
  process.exit(1);
}

// Replace English
code = code.replace(
  "['Master the formal, elevated language used in government dictations.']),\n];",
  "['Master the formal, elevated language used in government dictations.']),\n" + englishNew + "\n];"
);

// Replace Hindi
code = code.replace(
  "['लंबे शब्दों को बिना रुके टाइप करें।']),\n];",
  "['लंबे शब्दों को बिना रुके टाइप करें।']),\n" + hindiNew + "\n];"
);

fs.writeFileSync('src/features/typing/curriculum.ts', code);
console.log("Successfully added levels 13-20 to curriculum.ts");
