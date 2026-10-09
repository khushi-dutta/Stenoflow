import { scoreAttempt } from '@/lib/scoring';

self.onmessage = (event: MessageEvent<{ reference: string; typed: string; elapsedSeconds: number; backspaces: number, flexMode: boolean }>) => {
  try {
    const { reference, typed, elapsedSeconds, backspaces, flexMode } = event.data;
    self.postMessage({ score: scoreAttempt(reference, typed, elapsedSeconds, backspaces, flexMode) });
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : 'Scoring failed.' });
  }
};
