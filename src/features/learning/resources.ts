export type StudyResource = {
  id: string;
  title: string;
  kind: string;
  description: string;
  pages: number;
  href: string;
};

/** Original StenoFlow guides generated from scripts/generate_resources.py. */
export const studyResources: StudyResource[] = [
  { id: 'first-week', title: 'Your first week of deliberate practice', kind: 'Practice guide', description: 'A seven-day plan for setting a baseline, building rhythm, and reviewing mistakes.', pages: 2, href: '/resources/first-week.pdf' },
  { id: 'transcription', title: 'A calmer approach to transcription', kind: 'Technique notes', description: 'A practical listening, typing, and review routine for each session.', pages: 2, href: '/resources/transcription.pdf' },
  { id: 'vocabulary', title: 'Administrative vocabulary practice', kind: 'Word collection', description: 'Common administrative words with focused recall and sentence exercises.', pages: 2, href: '/resources/vocabulary.pdf' },

  {"id": "kc-vol-1", "title": "Kailash Chandra Volume 1", "kind": "KC Volume", "description": "Complete transcriptions for Kailash Chandra Volume 1.", "pages": 0, "href": "/magazines/kc/Kailash Chandra Volume 1.pdf"},
  {"id": "kc-vol-2", "title": "Kailash Chandra Volume 2", "kind": "KC Volume", "description": "Complete transcriptions for Kailash Chandra Volume 2.", "pages": 0, "href": "/magazines/kc/Kailash Chandra Volume 2.pdf"},
  {"id": "kc-vol-3", "title": "Kailash Chandra Volume 3", "kind": "KC Volume", "description": "Complete transcriptions for Kailash Chandra Volume 3.", "pages": 0, "href": "/magazines/kc/Kailash Chandra Volume 3.pdf"},
  {"id": "kc-vol-4", "title": "Kailash Chandra Volume 4", "kind": "KC Volume", "description": "Complete transcriptions for Kailash Chandra Volume 4.", "pages": 0, "href": "/magazines/kc/Kailash Chandra Volume 4.pdf"},
  {"id": "kc-vol-5", "title": "Kailash Chandra Volume 5", "kind": "KC Volume", "description": "Complete transcriptions for Kailash Chandra Volume 5.", "pages": 0, "href": "/magazines/kc/Kailash Chandra Volume 5.pdf"},
  {"id": "kc-vol-6", "title": "Kailash Chandra Volume 6", "kind": "KC Volume", "description": "Complete transcriptions for Kailash Chandra Volume 6.", "pages": 0, "href": "/magazines/kc/Kailash Chandra Volume 6.pdf"},
  {"id": "kc-vol-7", "title": "Kailash Chandra Volume 7", "kind": "KC Volume", "description": "Complete transcriptions for Kailash Chandra Volume 7.", "pages": 0, "href": "/magazines/kc/Kailash Chandra Volume 7.pdf"},
  {"id": "kc-vol-8", "title": "Kailash Chandra Volume 8", "kind": "KC Volume", "description": "Complete transcriptions for Kailash Chandra Volume 8.", "pages": 0, "href": "/magazines/kc/Kailash Chandra Volume 8.pdf"},
  {"id": "kc-vol-9", "title": "Kailash Chandra Volume 9", "kind": "KC Volume", "description": "Complete transcriptions for Kailash Chandra Volume 9.", "pages": 0, "href": "/magazines/kc/Kailash Chandra Volume 9.pdf"},
  {"id": "kc-vol-10", "title": "Kailash Chandra Volume 10", "kind": "KC Volume", "description": "Complete transcriptions for Kailash Chandra Volume 10.", "pages": 0, "href": "/magazines/kc/Kailash Chandra Volume 10.pdf"},
  {"id": "kc-vol-11", "title": "Kailash Chandra Volume 11", "kind": "KC Volume", "description": "Complete transcriptions for Kailash Chandra Volume 11.", "pages": 0, "href": "/magazines/kc/Kailash Chandra Volume 11.pdf"},
  {"id": "kc-vol-12", "title": "Kailash Chandra Volume 12", "kind": "KC Volume", "description": "Complete transcriptions for Kailash Chandra Volume 12.", "pages": 0, "href": "/magazines/kc/Kailash Chandra Volume 12.pdf"},
  {"id": "kc-vol-13", "title": "Kailash Chandra Volume 13", "kind": "KC Volume", "description": "Complete transcriptions for Kailash Chandra Volume 13.", "pages": 0, "href": "/magazines/kc/Kailash Chandra Volume 13.pdf"},
  {"id": "kc-vol-14", "title": "Kailash Chandra Volume 14", "kind": "KC Volume", "description": "Complete transcriptions for Kailash Chandra Volume 14.", "pages": 0, "href": "/magazines/kc/Kailash Chandra Volume 14.pdf"},
  {"id": "kc-vol-15", "title": "Kailash Chandra Volume 15", "kind": "KC Volume", "description": "Complete transcriptions for Kailash Chandra Volume 15.", "pages": 0, "href": "/magazines/kc/Kailash Chandra Volume 15.pdf"},
  {"id": "kc-vol-16", "title": "Kailash Chandra Volume 16", "kind": "KC Volume", "description": "Complete transcriptions for Kailash Chandra Volume 16.", "pages": 0, "href": "/magazines/kc/Kailash Chandra Volume 16.pdf"},
  {"id": "kc-vol-17", "title": "Kailash Chandra Volume 17", "kind": "KC Volume", "description": "Complete transcriptions for Kailash Chandra Volume 17.", "pages": 0, "href": "/magazines/kc/Kailash Chandra Volume 17.pdf"},
  {"id": "kc-vol-18", "title": "Kailash Chandra Volume 18", "kind": "KC Volume", "description": "Complete transcriptions for Kailash Chandra Volume 18.", "pages": 0, "href": "/magazines/kc/Kailash Chandra Volume 18.pdf"},
  {"id": "kc-vol-19", "title": "Kailash Chandra Volume 19", "kind": "KC Volume", "description": "Complete transcriptions for Kailash Chandra Volume 19.", "pages": 0, "href": "/magazines/kc/Kailash Chandra Volume 19.pdf"},
  {"id": "kc-vol-20", "title": "Kailash Chandra Volume 20", "kind": "KC Volume", "description": "Complete transcriptions for Kailash Chandra Volume 20.", "pages": 0, "href": "/magazines/kc/Kailash Chandra Volume 20.pdf"},
  {"id": "kc-vol-21", "title": "Kailash Chandra Volume 21", "kind": "KC Volume", "description": "Complete transcriptions for Kailash Chandra Volume 21.", "pages": 0, "href": "/magazines/kc/Kailash Chandra Volume 21.pdf"},
  {"id": "kc-vol-22", "title": "Kailash Chandra Volume 22", "kind": "KC Volume", "description": "Complete transcriptions for Kailash Chandra Volume 22.", "pages": 0, "href": "/magazines/kc/Kailash Chandra Volume 22.pdf"},
  {"id": "kc-vol-23", "title": "Kailash Chandra Volume 23", "kind": "KC Volume", "description": "Complete transcriptions for Kailash Chandra Volume 23.", "pages": 0, "href": "/magazines/kc/Kailash Chandra Volume 23.pdf"},
  {"id": "kc-vol-24", "title": "Kailash Chandra Volume 24", "kind": "KC Volume", "description": "Complete transcriptions for Kailash Chandra Volume 24.", "pages": 0, "href": "/magazines/kc/Kailash Chandra Volume 24.pdf"},
];
