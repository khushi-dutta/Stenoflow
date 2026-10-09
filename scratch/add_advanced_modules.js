const fs = require('fs');
let code = fs.readFileSync('src/features/typing/curriculum.ts', 'utf8');

const englishNew = `
  // Level 22: Real-Time Dictation
  { ...english('Level 22: Audio Dictation', 'General Passage', 'Type the text as you hear it. No text will be shown.', 'The economy has shown remarkable resilience in the face of global challenges. We must continue to invest in our infrastructure to ensure long-term growth and stability. Education and healthcare remain our top priorities.', [], 120, 50, 95, ['Listen carefully to the audio.', 'Do not stop typing even if you make a mistake.']), mode: 'dictation' },
  { ...english('Level 22: Audio Dictation', 'Legal Passage', 'Type the text as you hear it.', 'The petitioner has filed this writ petition challenging the order passed by the respondent authority. It is submitted that no opportunity of hearing was provided before the impugned order was passed, which violates the principles of natural justice.', [], 120, 50, 95, ['Keep up with the dictation.']), mode: 'dictation' },

  // Level 24: Exam Simulation
  { ...english('Level 24: Exam Simulation', 'SSC Stenographer Mock', 'Blind typing mode. You will not see errors until the final report.', 'Sir, the problem of unemployment is a matter of great concern. Every year, millions of young graduates enter the job market with high hopes. However, the lack of sufficient opportunities leaves many of them frustrated. The government has launched several initiatives, but the implementation at the ground level needs to be significantly improved. We must focus on skill development and vocational training.', [], 180, 60, 95, ['Type from the reference text below.', 'You will not see live error feedback.']), mode: 'exam' },
  { ...english('Level 24: Exam Simulation', 'High Court Mock Test', 'Blind typing mode.', 'The present appeal is directed against the judgment and decree passed by the trial court. The main contention of the appellant is that the trial court failed to appreciate the evidence on record in its proper perspective. The burden of proof was entirely on the plaintiff to establish his case, which he miserably failed to do.', [], 180, 60, 95, ['Focus purely on transcribing the text accurately.']), mode: 'exam' }`;

const hindiNew = `
  // Level 22: Real-Time Dictation
  { ...hindi('Level 22: ऑडियो डिक्टेशन', 'सामान्य अनुच्छेद', 'ऑडियो सुनकर टाइप करें। कोई टेक्स्ट नहीं दिखेगा।', 'हमारे देश की अर्थव्यवस्था ने वैश्विक चुनौतियों के सामने असाधारण लचीलापन दिखाया है। दीर्घकालिक विकास और स्थिरता सुनिश्चित करने के लिए हमें अपने बुनियादी ढांचे में निवेश करना जारी रखना होगा। शिक्षा और स्वास्थ्य सेवा हमारी सर्वोच्च प्राथमिकताओं में बनी हुई हैं।', 120, 25, 95, ['ऑडियो को ध्यान से सुनें।', 'गलती होने पर भी रुकें नहीं।']), mode: 'dictation' },
  { ...hindi('Level 22: ऑडियो डिक्टेशन', 'कानूनी डिक्टेशन', 'कानूनी अंश सुनकर टाइप करें।', 'याचिकाकर्ता ने प्रतिवादी प्राधिकारी द्वारा पारित आदेश को चुनौती देते हुए यह रिट याचिका दायर की है। यह प्रस्तुत किया गया है कि आक्षेपित आदेश पारित होने से पहले सुनवाई का कोई अवसर प्रदान नहीं किया गया था, जो प्राकृतिक न्याय के सिद्धांतों का उल्लंघन है।', 120, 25, 95, ['डिक्टेशन के साथ गति बनाए रखें।']), mode: 'dictation' },

  // Level 24: Exam Simulation
  { ...hindi('Level 24: परीक्षा सिमुलेशन', 'SSC स्टेनोग्राफर मॉक', 'ब्लाइंड टाइपिंग मोड। गलतियां अंत में दिखेंगी।', 'महोदय, बेरोजगारी की समस्या बहुत चिंता का विषय है। हर साल लाखों युवा स्नातक बड़ी उम्मीदों के साथ नौकरी के बाजार में प्रवेश करते हैं। हालांकि, पर्याप्त अवसरों की कमी उन्हें निराश करती है। सरकार ने कई पहल शुरू की हैं, लेकिन जमीनी स्तर पर इसके कार्यान्वयन में काफी सुधार की आवश्यकता है। हमें कौशल विकास और व्यावसायिक प्रशिक्षण पर ध्यान देना चाहिए।', 180, 30, 95, ['नीचे दिए गए टेक्स्ट से टाइप करें।', 'आपको लाइव त्रुटि फीडबैक नहीं दिखेगा।']), mode: 'exam' },
  { ...hindi('Level 24: परीक्षा सिमुलेशन', 'हाई कोर्ट मॉक टेस्ट', 'ब्लाइंड टाइपिंग मोड।', 'वर्तमान अपील निचली अदालत द्वारा पारित निर्णय और डिक्री के खिलाफ निर्देशित है। अपीलकर्ता का मुख्य तर्क यह है कि निचली अदालत रिकॉर्ड पर मौजूद सबूतों का सही परिप्रेक्ष्य में मूल्यांकन करने में विफल रही। अपना मामला स्थापित करने के लिए सबूत का भार पूरी तरह से वादी पर था, जिसे वह करने में बुरी तरह विफल रहा।', 180, 30, 95, ['पूरी एकाग्रता के साथ टाइप करें।']), mode: 'exam' }`;

const englishTarget = "['Prepare for parliamentary dictation.'])\n];";
const hindiTarget = "['संसदीय डिक्टेशन की तैयारी करें।'])\n];";

if (code.includes('Level 22: Audio Dictation')) {
  console.log("Already added modules 22 and 24");
} else {
  // Replace English
  code = code.replace(
    "['Prepare for parliamentary dictation.'])",
    "['Prepare for parliamentary dictation.']),\n" + englishNew
  );

  // Replace Hindi
  code = code.replace(
    "['संसदीय डिक्टेशन की तैयारी करें।'])",
    "['संसदीय डिक्टेशन की तैयारी करें।']),\n" + hindiNew
  );

  fs.writeFileSync('src/features/typing/curriculum.ts', code);
  console.log("Successfully added modules 22 and 24 to curriculum.ts");
}
