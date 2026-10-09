import { scoreAttempt, type AttemptScore } from '@/lib/scoring';

/** Keeps long alignment work away from the editor and timer UI. */
export async function scoreInBackground(reference: string, typed: string, elapsedSeconds: number, backspaces: number, flexMode: boolean = false): Promise<AttemptScore> {
  if (typeof Worker === 'undefined') return scoreAttempt(reference, typed, elapsedSeconds, backspaces, flexMode);
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./scoring.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (event: MessageEvent<{ score?: AttemptScore; error?: string }>) => {
      worker.terminate();
      if (event.data.error) reject(new Error(event.data.error));
      else if (event.data.score) resolve(event.data.score);
      else reject(new Error('Scoring returned no result.'));
    };
    worker.onerror = () => { worker.terminate(); reject(new Error('The scoring worker failed. Try submitting again.')); };
    worker.postMessage({ reference, typed, elapsedSeconds, backspaces, flexMode });
  });
}
