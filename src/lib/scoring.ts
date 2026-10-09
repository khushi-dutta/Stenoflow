export type WordChange = { type: 'correct' | 'missing' | 'extra' | 'replacement' | 'punctuation'; expected: string; actual: string };
export type AttemptScore = {
  grossWpm: number; netWpm: number; accuracy: number; correctCharacters: number; incorrectCharacters: number;
  missingWords: number; extraWords: number; substitutions: number; punctuationErrors: number;
  errors: number; totalWords: number; typedWords: number; completion: number; errorRate: number;
  backspaces: number; elapsedSeconds: number; alignment: WordChange[];
};
const round = (n: number) => Math.round(n * 10) / 10;
const tokens = (text: string) => text.normalize('NFC').trim().split(/\s+/u).filter(Boolean);
const withoutPunctuation = (text: string) => text.replace(/\p{P}/gu, '');
/** Word-level Levenshtein alignment; capped inputs bound CPU and memory on both client and server. */
export function scoreAttempt(reference: string, typed: string, elapsedSeconds: number, backspaces = 0, flexMode = false): AttemptScore {
  if (reference.length > 30000 || typed.length > 30000) throw new RangeError('Passages must be at most 30,000 characters.');
  if (!Number.isFinite(elapsedSeconds) || elapsedSeconds <= 0) throw new RangeError('Elapsed time must be positive.');
  const expected = tokens(reference), actual = tokens(typed);
  if (expected.length > 3000 || actual.length > 3000) throw new RangeError('Passages must be at most 3,000 words.');
  const width = actual.length + 1;
  const costs = new Uint16Array((expected.length + 1) * width);
  for (let i = 0; i <= expected.length; i++) costs[i * width] = i;
  for (let j = 0; j <= actual.length; j++) costs[j] = j;
  for (let i = 1; i <= expected.length; i++) {
    for (let j = 1; j <= actual.length; j++) {
      costs[i * width + j] = Math.min(costs[(i - 1) * width + j] + 1, costs[i * width + j - 1] + 1, costs[(i - 1) * width + j - 1] + (expected[i - 1] === actual[j - 1] ? 0 : 1));
    }
  }
  const alignment: WordChange[] = [];
  let i = expected.length, j = actual.length;
  while (i || j) {
    if (i && j && costs[i * width + j] === costs[(i - 1) * width + j - 1] + (expected[i - 1] === actual[j - 1] ? 0 : 1)) {
      const e = expected[--i], a = actual[--j];
      alignment.push({ type: e === a ? 'correct' : withoutPunctuation(e) === withoutPunctuation(a) ? 'punctuation' : 'replacement', expected: e, actual: a });
    } else if (i && costs[i * width + j] === costs[(i - 1) * width + j] + 1) {
      alignment.push({ type: 'missing', expected: expected[--i], actual: '' });
    } else alignment.push({ type: 'extra', expected: '', actual: actual[--j] });
  }
  alignment.reverse();
  
  if (flexMode) {
    while (alignment.length > 0 && alignment[alignment.length - 1].type === 'missing') {
      alignment.pop();
    }
  }
  
  const count = (type: WordChange['type']) => alignment.filter(item => item.type === type).length;
  const missingWords = count('missing'), extraWords = count('extra'), substitutions = count('replacement'), punctuationErrors = count('punctuation');
  const errors = missingWords + extraWords + substitutions + punctuationErrors;
  const minutes = elapsedSeconds / 60;
  const grossWpm = typed.length / 5 / minutes;
  let correctCharacters = 0, incorrectCharacters = 0;
  for (const word of alignment) {
    for (let k = 0; k < word.actual.length; k++) {
      if (word.actual[k] === word.expected[k]) correctCharacters++; else incorrectCharacters++;
    }
  }
  const errorRate = errors / Math.max(expected.length, actual.length, 1) * 100;
  return { grossWpm: round(grossWpm), netWpm: round(Math.max(0, grossWpm - errors / minutes)), accuracy: round(Math.max(0, 100 - errorRate)), correctCharacters, incorrectCharacters, missingWords, extraWords, substitutions, punctuationErrors, errors, totalWords: expected.length, typedWords: actual.length, completion: round(expected.length ? (expected.length - missingWords) / expected.length * 100 : 100), errorRate: round(errorRate), backspaces: Math.max(0, Math.floor(backspaces)), elapsedSeconds, alignment };
}
