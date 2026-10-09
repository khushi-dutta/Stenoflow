/** Character-based lesson feedback, separate from word-based transcription scoring. */
export function normalizeLessonText(value: string) {
  return value.normalize('NFC').replace(/\r\n/g, '\n').trim();
}

export function lessonMetrics(reference: string, typed: string, seconds: number, final = false) {
  const expected = Array.from(normalizeLessonText(reference));
  const actual = Array.from(normalizeLessonText(typed));
  const target = final ? expected : expected.slice(0, actual.length);
  let previous = Array.from({ length: actual.length + 1 }, (_, i) => i);
  for (let i = 1; i <= target.length; i++) {
    const current = [i];
    for (let j = 1; j <= actual.length; j++) {
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + (target[i - 1] === actual[j - 1] ? 0 : 1));
    }
    previous = current;
  }
  const errors = previous[actual.length];
  const accuracy = actual.length ? Math.max(0, 100 * (1 - errors / Math.max(target.length, actual.length, 1))) : 0;
  const wpm = actual.length / 5 / (Math.max(seconds, 1) / 60);
  return {
    accuracy: Math.round(accuracy * 10) / 10,
    wpm: Math.round(wpm * 10) / 10,
    completion: Math.min(100, Math.round(actual.length / Math.max(expected.length, 1) * 100)),
    errors,
    characters: actual.length,
  };
}

export function passesLesson(metrics: ReturnType<typeof lessonMetrics>, targetWpm: number, targetAccuracy: number) {
  return metrics.completion >= 95 && metrics.accuracy >= targetAccuracy && metrics.wpm >= targetWpm;
}
