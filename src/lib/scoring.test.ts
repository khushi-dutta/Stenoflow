import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scoreAttempt } from './scoring';
test('perfect transcription measures five-character gross WPM', () => {
  const score = scoreAttempt('hello world', 'hello world', 60);
  assert.equal(score.grossWpm, 2.2); assert.equal(score.accuracy, 100); assert.equal(score.errors, 0);
});
test('insertions do not cascade into later replacement errors', () => {
  const score = scoreAttempt('we build a better future', 'we can build a better future', 60);
  assert.equal(score.extraWords, 1); assert.equal(score.substitutions, 0);
});
test('categorizes missing, spelling and punctuation mistakes', () => {
  const score = scoreAttempt('The committee will meet today.', 'The comittee meet today', 60);
  assert.equal(score.missingWords, 1); assert.equal(score.substitutions, 1); assert.equal(score.punctuationErrors, 1);
});
test('Unicode normalization and repeated whitespace are supported', () => {
  assert.equal(scoreAttempt('भारत की प्रगति', 'भारत  की\nप्रगति', 60).accuracy, 100);
  assert.equal(scoreAttempt('café', 'cafe\u0301', 60).accuracy, 100);
});
test('empty submission is zero accuracy and never negative WPM', () => {
  const score = scoreAttempt('one two three', '', 60);
  assert.equal(score.accuracy, 0); assert.equal(score.netWpm, 0); assert.equal(score.completion, 0);
});
test('invalid timing and oversized inputs are rejected', () => {
  assert.throws(() => scoreAttempt('a', 'a', 0), RangeError);
  assert.throws(() => scoreAttempt('a', 'a', NaN), RangeError);
  assert.throws(() => scoreAttempt('a '.repeat(3001), 'a', 60), RangeError);
});
