export type CourseLayoutId = 'en_qwerty' | 'hi_inscript' | 'hi_remington' | 'hi_krutidev';
export const courseLayouts: { id: CourseLayoutId; name: string; label: string; language: string; description: string; note: string }[] = [
 { id:'en_qwerty', name:'English QWERTY', label:'QWERTY', language:'English', description:'Home-row control to confident passage typing.', note:'Use a standard English keyboard. Return your index fingers to F and J after each reach.' },
 { id:'hi_inscript', name:'Hindi InScript', label:'InScript', language:'Hindi · Unicode', description:'Learn the Devanagari layout, one key family at a time.', note:'InScript uses logical Unicode order: type the consonant before its vowel sign, even when the sign appears to the left.' },
 { id:'hi_remington', name:'Hindi Remington GAIL', label:'Remington GAIL', language:'Hindi · Unicode', description:'Build fluency with the Unicode Remington layout.', note:'This course uses Unicode Remington GAIL. It is not the same input sequence as a legacy KrutiDev font. Mangal is a display font, not a separate keyboard layout.' },
 { id:'hi_krutidev', name:'Hindi KrutiDev 010', label:'KrutiDev 010', language:'Hindi · Legacy keys', description:'Practice Remington-style legacy key sequences.', note:'Type KrutiDev 010 key sequences and see a Unicode Hindi preview. This tutor does not embed the proprietary KrutiDev font or produce a legacy-font document.' },
];
export function isCourseLayout(value: string | null | undefined): value is CourseLayoutId {
 return courseLayouts.some(layout => layout.id === value);
}
export function courseUrl(layout: CourseLayoutId, lesson?: string) {
 const query = new URLSearchParams({layout,tab:'lessons'});
 if (lesson) query.set('lesson',lesson);
 return `/app/typing?${query}`;
}
