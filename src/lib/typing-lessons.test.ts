import test from 'node:test';
import assert from 'node:assert/strict';
import { lessonMetrics, passesLesson } from '../features/typing/lesson-metrics';

test('lesson completion cannot be earned from a short perfect prefix', () => {
 const metric = lessonMetrics('a long practice passage', 'a', 1, true);
 assert.equal(passesLesson(metric, 1, 90), false);
 assert.ok(metric.accuracy < 10);
});
test('one inserted character does not cascade through lesson accuracy', () => {
 const metric = lessonMetrics('committee', 'commiittee', 15, true);
 assert.equal(metric.errors, 1);
 assert.equal(metric.accuracy, 90);
});
test('Hindi combining marks are normalized consistently', () => {
 const metric = lessonMetrics('किताब पढ़ो', 'किताब पढ़ो', 20, true);
 assert.equal(metric.accuracy, 100);
 assert.equal(metric.completion, 100);
});
test('lesson target checks both speed and accuracy', () => {
 const metric = lessonMetrics('a steady practice', 'a steady practice', 60, true);
 assert.equal(passesLesson(metric, 10, 95), false);
 assert.equal(passesLesson(metric, 3, 95), true);
});
