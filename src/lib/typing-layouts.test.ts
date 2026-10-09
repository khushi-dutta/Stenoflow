import test from 'node:test';
import assert from 'node:assert/strict';
import {convertKeystrokes,getKeyMap} from '../features/typing/layouts';
import {typingLessons} from '../features/typing/curriculum';

test('InScript follows consonant then short-i ordering',()=>{
 assert.equal(convertKeystrokes('hi_inscript','kfl'),'कित');
 assert.equal(getKeyMap('hi_inscript').k,'क');
});
test('Unicode Remington places short-i after the consonant',()=>{
 assert.equal(convertKeystrokes('hi_remington','df'),'कि');
 assert.equal(convertKeystrokes('hi_remington','vks'),'ओ');
});
test('KrutiDev legacy sequence places short-i before the consonant',()=>{
 assert.equal(convertKeystrokes('hi_krutidev','fdl'),'किस');
 assert.equal(convertKeystrokes('hi_krutidev','vks'),'ओ');
});
test('every course has progressive original lessons and unique IDs',()=>{
 assert.equal(new Set(typingLessons.map(lesson=>lesson.id)).size,typingLessons.length);
 for(const id of ['en_qwerty','hi_inscript','hi_remington','hi_krutidev']){
  const course=typingLessons.filter(lesson=>lesson.layoutId===id);
  assert.ok(course.length>=16);
  assert.ok(new Set(course.map(lesson=>lesson.module)).size>=4);
  assert.ok(course.every(lesson=>lesson.text.length>=35&&lesson.targetAccuracy>=90&&lesson.targetAccuracy<=100));
 }
});
