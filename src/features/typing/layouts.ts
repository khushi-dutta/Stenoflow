/**
 * Physical keyboard legends used by the lesson tutor. InScript and Remington
 * correspond to the open m17n input tables (hi-inscript and hi-remington).
 * KrutiDev 010 is a legacy glyph order; the converter here shows Unicode
 * feedback, rather than embedding or reproducing the proprietary typeface.
 */
import type {CourseLayoutId} from './course-config';

export const SHIFTED_KEYS:Readonly<Record<string,string>>={"`":"~","1":"!","2":"@","3":"#","4":"$","5":"%","6":"^","7":"&","8":"*","9":"(","0":")","-":"_","=":"+","[":"{","]":"}","\\":"|",";":":","'":'"',",":"<",".":">","/":"?"};
export const KEYBOARD_ROWS=['`1234567890-=','qwertyuiop[]\\',"asdfghjkl;'",'zxcvbnm,./'] as const;
const inscript:Record<string,string>={
 '1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९','0':'०','!':'ऍ','@':'ॅ','_':'ः','+':'ऋ','=':'ृ',
 q:'ौ',w:'ै',e:'ा',r:'ी',t:'ू',y:'ब',u:'ह',i:'ग',o:'द',p:'ज','[':'ड',']':'़',
 a:'ो',s:'े',d:'्',f:'ि',g:'ु',h:'प',j:'र',k:'क',l:'त',';':'च',"'":'ट','\\':'ॉ',
 z:'ॆ',x:'ं',c:'म',v:'न',b:'व',n:'ल',m:'स',',':',','.':'.','/':'य',
 Q:'औ',W:'ऐ',E:'आ',R:'ई',T:'ऊ',Y:'भ',U:'ङ',I:'घ',O:'ध',P:'झ','{':'ढ','}':'ञ',
 A:'ओ',S:'ए',D:'अ',F:'इ',G:'उ',H:'फ',J:'ऱ',K:'ख',L:'थ',':':'छ','"':'ठ','|':'ऑ',
 Z:'ऎ',X:'ँ',C:'ण',V:'ऩ',B:'ऴ',N:'ळ',M:'श','<':'ष','>':'।','?':'य़',
 '%':'ज्ञ','^':'त्र','&':'क्ष','*':'श्र',' ':' ', '\n':'\n'
};
const remington:Record<string,string>={
 q:'ु',w:'ू',e:'म',r:'त',t:'ज',y:'ल',u:'न',i:'प',o:'व',p:'च',
 a:'ं',s:'े',d:'क',f:'ि',g:'ह',h:'ी',j:'र',k:'ा',l:'स',';':'य',
 x:'ग',c:'ब',v:'अ',b:'इ',n:'द',m:'उ',',':'ए','.':'ण्','/':'ध्',
 Q:'फ',W:'ॅ',E:'म्',R:'त्',T:'ज्',Y:'ल्',U:'न्',I:'प्',O:'व्',P:'च्',
 A:'।',S:'ै',D:'क्',F:'थ्',G:'ळ',H:'भ्',J:'श्र',K:'ज्ञ',L:'स्',':':'रू','"':'ष्',
 X:'ग्',C:'ब्',V:'ट',B:'ठ',N:'छ',M:'ड','<':'ढ','>':'झ','?':'घ्',
 '[':'ख्','{':'क्ष्',']':',','}':'द्व','=':'त्र','+':'़',
 '1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९','0':'०',
 '!':'!','@':'/','#':'रु','$':'+','%':'ः','^':"'",'&':'-','*':"'",'(':';',')':'द्घ','-':'.','_':'ऋ','\\':'?','|':'द्य',
 z:'्र',Z:'र्','`':'ृ',' ':' ','\n':'\n'
};
const kruti:Record<string,string>={...remington};
// In KrutiDev the f glyph is typed before its consonant; conversion reorders it.
kruti.f='ि';
export const TYPING_LAYOUTS=[
 {id:'en_qwerty',name:'English QWERTY',encoding:'Latin',inputHint:'Type with your ordinary English keyboard.'},
 {id:'hi_inscript',name:'Hindi InScript',encoding:'Unicode',inputHint:'Type InScript key positions in the built-in tutor, or switch to your installed InScript keyboard.'},
 {id:'hi_remington',name:'Hindi Remington GAIL',encoding:'Unicode',inputHint:'Type Remington GAIL positions in the built-in tutor, or use an installed Unicode Remington keyboard.'},
 {id:'hi_krutidev',name:'Hindi KrutiDev 010',encoding:'Legacy key order',inputHint:'Type legacy Remington key sequences; the tutor shows Unicode feedback.'},
] as const;
export const getTypingLayout=(id:CourseLayoutId)=>TYPING_LAYOUTS.find(item=>item.id===id)??TYPING_LAYOUTS[0];
export const getKeyMap=(id:CourseLayoutId):Readonly<Record<string,string>>=>id==='hi_inscript'?inscript:id==='hi_remington'?remington:id==='hi_krutidev'?kruti:{};
const consonants='कखगघङचछजझञटठडढणतथदधनपफबभमयरलळवशषसहक़ख़ग़ज़ड़ढ़फ़य़ऱऩ';
const matras='ािीुूृेैोौॉॅ';
function compose(text:string){
 // A dependent vowel typed at the beginning of a word is shown as an
 // independent vowel where a common equivalent exists.
 const independent:Record<string,string>={'ा':'आ','ि':'इ','ी':'ई','ु':'उ','ू':'ऊ','े':'ए','ै':'ऐ','ो':'ओ','ौ':'औ'};
 return text.replace(new RegExp(`(^|[\\s,.।!?])([${matras}])`,'gu'),(_,edge:string,mark:string)=>edge+(independent[mark]??mark)).normalize('NFC');
}
function mapStrokes(raw:string,map:Readonly<Record<string,string>>){return Array.from(raw).map(ch=>map[ch]??ch).join('')}
function krutiToUnicode(raw:string){
 // Multi-key vowel sequences and visual-order short-i are applied before
 // single-key mapping. Conversion is recomputed from the complete raw buffer
 // so Backspace restores the previous preview exactly.
 const source=raw.replace(/vks/g,'ओ').replace(/vkS/g,'औ').replace(/vk/g,'आ').replace(/ks/g,'ो').replace(/kS/g,'ौ').replace(/f/g,'§');
 let output=mapStrokes(source,kruti);
 // The legacy f glyph precedes the consonant cluster it marks. Keep a
 // pending marker until the next complete cluster has been typed.
 output=output.replace(new RegExp(`§((?:[${consonants}]्)*[${consonants}])`,'gu'),'$1ि').replace(/§/g,'');
 output=output.replace(new RegExp(`([${consonants}][${matras}]*)र्`,'gu'),'र्$1');
 return compose(output).replace(/⁇/g,'?');
}
export function convertKeystrokes(id:CourseLayoutId,raw:string):string{
 if(id==='en_qwerty')return raw;
 if(id==='hi_krutidev')return krutiToUnicode(raw);
 if(id==='hi_remington')raw=raw.replace(/vks/g,'ओ').replace(/vkS/g,'औ').replace(/vk/g,'आ').replace(/ks/g,'ो').replace(/kS/g,'ौ').replace(/Wa/g,'ँ');
 return compose(mapStrokes(raw,getKeyMap(id))).replace(/⁇/g,'?');
}
