export type Magazine = {
  id: string;
  title: string;
  description: string;
  folderId: string;
  category: string;
  year: number;
  month: string;
  coverUrl?: string;
  pdfUrl: string;
  pages: number;
  publisher: string;
  tags: string[];
  addedAt: string;
};

export type MagazineFolder = {
  id: string;
  name: string;
  description: string;
  year: number;
  category: string;
  coverUrls?: string[];
  magazineCount: number;
};

export const magazineFolders: MagazineFolder[] = [
  { id: 'prog-2026', name: 'Progressive 2026', description: 'Monthly progressive shorthand magazines for 2026.', year: 2026, category: 'Progressive', magazineCount: 8, coverUrls: [] },
  { id: 'prog-2025', name: 'Progressive 2025', description: 'Monthly progressive shorthand magazines for 2025.', year: 2025, category: 'Progressive', magazineCount: 12, coverUrls: [] },
  { id: 'prog-2024', name: 'Progressive 2024', description: 'Monthly progressive shorthand magazines for 2024.', year: 2024, category: 'Progressive', magazineCount: 12, coverUrls: [] },
  { id: 'legal-vap', name: 'Legal - Vishnu Art Press', description: 'Comprehensive legal dictations and judgments.', year: 2026, category: 'Legal', magazineCount: 19, coverUrls: [] },
  { id: 'ssc-prev', name: 'SSC Previous Year', description: 'Official past papers and transcriptions.', year: 2025, category: 'SSC', magazineCount: 5, coverUrls: [] },
  { id: 'kc-vols', name: 'Kailash Chandra Magazines', description: 'All 24 volumes of Kailash Chandra dictations.', year: 2026, category: 'SSC', magazineCount: 24, coverUrls: [] },
];

export const magazines: Magazine[] = [
  { id: 'prog-2026-09', title: 'Progressive September 2026', description: 'Focus on high speed and new vocabulary.', folderId: 'prog-2026', category: 'Progressive', year: 2026, month: 'September', pdfUrl: '/resources/first-week.pdf', pages: 86, publisher: 'StenoFlow', tags: ['progressive', 'high-speed'], addedAt: '2026-09-01T00:00:00Z' },
  { id: 'prog-2026-08', title: 'Progressive August 2026', description: 'Parliamentary debates and speeches.', folderId: 'prog-2026', category: 'Progressive', year: 2026, month: 'August', pdfUrl: '/resources/first-week.pdf', pages: 92, publisher: 'StenoFlow', tags: ['progressive', 'parliament'], addedAt: '2026-08-01T00:00:00Z' },
  { id: 'legal-vap-01', title: 'Legal Digest Vol 1', description: 'Supreme Court judgments summary.', folderId: 'legal-vap', category: 'Legal', year: 2026, month: 'January', pdfUrl: '/resources/first-week.pdf', pages: 120, publisher: 'Vishnu Art Press', tags: ['legal', 'supreme-court'], addedAt: '2026-01-15T00:00:00Z' },
  { id: 'ssc-prev-23', title: 'SSC Grade C & D 2023', description: 'Previous year question papers with shorthand passages.', folderId: 'ssc-prev', category: 'SSC', year: 2023, month: 'December', pdfUrl: '/resources/first-week.pdf', pages: 45, publisher: 'SSC', tags: ['ssc', 'previous-year'], addedAt: '2024-02-10T00:00:00Z' },

  {"id": "kc-vol-1", "title": "Kailash Chandra Volume 1", "description": "Complete transcriptions for Kailash Chandra Volume 1.", "folderId": "kc-vols", "category": "SSC", "year": 2026, "month": "All", "pdfUrl": "/magazines/kc/Kailash Chandra Volume 1.pdf", "pages": 0, "publisher": "KC Publications", "tags": ["ssc", "kc", "volume-1"], "addedAt": "2026-10-03T00:00:00Z"},
  {"id": "kc-vol-2", "title": "Kailash Chandra Volume 2", "description": "Complete transcriptions for Kailash Chandra Volume 2.", "folderId": "kc-vols", "category": "SSC", "year": 2026, "month": "All", "pdfUrl": "/magazines/kc/Kailash Chandra Volume 2.pdf", "pages": 0, "publisher": "KC Publications", "tags": ["ssc", "kc", "volume-2"], "addedAt": "2026-10-03T00:00:00Z"},
  {"id": "kc-vol-3", "title": "Kailash Chandra Volume 3", "description": "Complete transcriptions for Kailash Chandra Volume 3.", "folderId": "kc-vols", "category": "SSC", "year": 2026, "month": "All", "pdfUrl": "/magazines/kc/Kailash Chandra Volume 3.pdf", "pages": 0, "publisher": "KC Publications", "tags": ["ssc", "kc", "volume-3"], "addedAt": "2026-10-03T00:00:00Z"},
  {"id": "kc-vol-4", "title": "Kailash Chandra Volume 4", "description": "Complete transcriptions for Kailash Chandra Volume 4.", "folderId": "kc-vols", "category": "SSC", "year": 2026, "month": "All", "pdfUrl": "/magazines/kc/Kailash Chandra Volume 4.pdf", "pages": 0, "publisher": "KC Publications", "tags": ["ssc", "kc", "volume-4"], "addedAt": "2026-10-03T00:00:00Z"},
  {"id": "kc-vol-5", "title": "Kailash Chandra Volume 5", "description": "Complete transcriptions for Kailash Chandra Volume 5.", "folderId": "kc-vols", "category": "SSC", "year": 2026, "month": "All", "pdfUrl": "/magazines/kc/Kailash Chandra Volume 5.pdf", "pages": 0, "publisher": "KC Publications", "tags": ["ssc", "kc", "volume-5"], "addedAt": "2026-10-03T00:00:00Z"},
  {"id": "kc-vol-6", "title": "Kailash Chandra Volume 6", "description": "Complete transcriptions for Kailash Chandra Volume 6.", "folderId": "kc-vols", "category": "SSC", "year": 2026, "month": "All", "pdfUrl": "/magazines/kc/Kailash Chandra Volume 6.pdf", "pages": 0, "publisher": "KC Publications", "tags": ["ssc", "kc", "volume-6"], "addedAt": "2026-10-03T00:00:00Z"},
  {"id": "kc-vol-7", "title": "Kailash Chandra Volume 7", "description": "Complete transcriptions for Kailash Chandra Volume 7.", "folderId": "kc-vols", "category": "SSC", "year": 2026, "month": "All", "pdfUrl": "/magazines/kc/Kailash Chandra Volume 7.pdf", "pages": 0, "publisher": "KC Publications", "tags": ["ssc", "kc", "volume-7"], "addedAt": "2026-10-03T00:00:00Z"},
  {"id": "kc-vol-8", "title": "Kailash Chandra Volume 8", "description": "Complete transcriptions for Kailash Chandra Volume 8.", "folderId": "kc-vols", "category": "SSC", "year": 2026, "month": "All", "pdfUrl": "/magazines/kc/Kailash Chandra Volume 8.pdf", "pages": 0, "publisher": "KC Publications", "tags": ["ssc", "kc", "volume-8"], "addedAt": "2026-10-03T00:00:00Z"},
  {"id": "kc-vol-9", "title": "Kailash Chandra Volume 9", "description": "Complete transcriptions for Kailash Chandra Volume 9.", "folderId": "kc-vols", "category": "SSC", "year": 2026, "month": "All", "pdfUrl": "/magazines/kc/Kailash Chandra Volume 9.pdf", "pages": 0, "publisher": "KC Publications", "tags": ["ssc", "kc", "volume-9"], "addedAt": "2026-10-03T00:00:00Z"},
  {"id": "kc-vol-10", "title": "Kailash Chandra Volume 10", "description": "Complete transcriptions for Kailash Chandra Volume 10.", "folderId": "kc-vols", "category": "SSC", "year": 2026, "month": "All", "pdfUrl": "/magazines/kc/Kailash Chandra Volume 10.pdf", "pages": 0, "publisher": "KC Publications", "tags": ["ssc", "kc", "volume-10"], "addedAt": "2026-10-03T00:00:00Z"},
  {"id": "kc-vol-11", "title": "Kailash Chandra Volume 11", "description": "Complete transcriptions for Kailash Chandra Volume 11.", "folderId": "kc-vols", "category": "SSC", "year": 2026, "month": "All", "pdfUrl": "/magazines/kc/Kailash Chandra Volume 11.pdf", "pages": 0, "publisher": "KC Publications", "tags": ["ssc", "kc", "volume-11"], "addedAt": "2026-10-03T00:00:00Z"},
  {"id": "kc-vol-12", "title": "Kailash Chandra Volume 12", "description": "Complete transcriptions for Kailash Chandra Volume 12.", "folderId": "kc-vols", "category": "SSC", "year": 2026, "month": "All", "pdfUrl": "/magazines/kc/Kailash Chandra Volume 12.pdf", "pages": 0, "publisher": "KC Publications", "tags": ["ssc", "kc", "volume-12"], "addedAt": "2026-10-03T00:00:00Z"},
  {"id": "kc-vol-13", "title": "Kailash Chandra Volume 13", "description": "Complete transcriptions for Kailash Chandra Volume 13.", "folderId": "kc-vols", "category": "SSC", "year": 2026, "month": "All", "pdfUrl": "/magazines/kc/Kailash Chandra Volume 13.pdf", "pages": 0, "publisher": "KC Publications", "tags": ["ssc", "kc", "volume-13"], "addedAt": "2026-10-03T00:00:00Z"},
  {"id": "kc-vol-14", "title": "Kailash Chandra Volume 14", "description": "Complete transcriptions for Kailash Chandra Volume 14.", "folderId": "kc-vols", "category": "SSC", "year": 2026, "month": "All", "pdfUrl": "/magazines/kc/Kailash Chandra Volume 14.pdf", "pages": 0, "publisher": "KC Publications", "tags": ["ssc", "kc", "volume-14"], "addedAt": "2026-10-03T00:00:00Z"},
  {"id": "kc-vol-15", "title": "Kailash Chandra Volume 15", "description": "Complete transcriptions for Kailash Chandra Volume 15.", "folderId": "kc-vols", "category": "SSC", "year": 2026, "month": "All", "pdfUrl": "/magazines/kc/Kailash Chandra Volume 15.pdf", "pages": 0, "publisher": "KC Publications", "tags": ["ssc", "kc", "volume-15"], "addedAt": "2026-10-03T00:00:00Z"},
  {"id": "kc-vol-16", "title": "Kailash Chandra Volume 16", "description": "Complete transcriptions for Kailash Chandra Volume 16.", "folderId": "kc-vols", "category": "SSC", "year": 2026, "month": "All", "pdfUrl": "/magazines/kc/Kailash Chandra Volume 16.pdf", "pages": 0, "publisher": "KC Publications", "tags": ["ssc", "kc", "volume-16"], "addedAt": "2026-10-03T00:00:00Z"},
  {"id": "kc-vol-17", "title": "Kailash Chandra Volume 17", "description": "Complete transcriptions for Kailash Chandra Volume 17.", "folderId": "kc-vols", "category": "SSC", "year": 2026, "month": "All", "pdfUrl": "/magazines/kc/Kailash Chandra Volume 17.pdf", "pages": 0, "publisher": "KC Publications", "tags": ["ssc", "kc", "volume-17"], "addedAt": "2026-10-03T00:00:00Z"},
  {"id": "kc-vol-18", "title": "Kailash Chandra Volume 18", "description": "Complete transcriptions for Kailash Chandra Volume 18.", "folderId": "kc-vols", "category": "SSC", "year": 2026, "month": "All", "pdfUrl": "/magazines/kc/Kailash Chandra Volume 18.pdf", "pages": 0, "publisher": "KC Publications", "tags": ["ssc", "kc", "volume-18"], "addedAt": "2026-10-03T00:00:00Z"},
  {"id": "kc-vol-19", "title": "Kailash Chandra Volume 19", "description": "Complete transcriptions for Kailash Chandra Volume 19.", "folderId": "kc-vols", "category": "SSC", "year": 2026, "month": "All", "pdfUrl": "/magazines/kc/Kailash Chandra Volume 19.pdf", "pages": 0, "publisher": "KC Publications", "tags": ["ssc", "kc", "volume-19"], "addedAt": "2026-10-03T00:00:00Z"},
  {"id": "kc-vol-20", "title": "Kailash Chandra Volume 20", "description": "Complete transcriptions for Kailash Chandra Volume 20.", "folderId": "kc-vols", "category": "SSC", "year": 2026, "month": "All", "pdfUrl": "/magazines/kc/Kailash Chandra Volume 20.pdf", "pages": 0, "publisher": "KC Publications", "tags": ["ssc", "kc", "volume-20"], "addedAt": "2026-10-03T00:00:00Z"},
  {"id": "kc-vol-21", "title": "Kailash Chandra Volume 21", "description": "Complete transcriptions for Kailash Chandra Volume 21.", "folderId": "kc-vols", "category": "SSC", "year": 2026, "month": "All", "pdfUrl": "/magazines/kc/Kailash Chandra Volume 21.pdf", "pages": 0, "publisher": "KC Publications", "tags": ["ssc", "kc", "volume-21"], "addedAt": "2026-10-03T00:00:00Z"},
  {"id": "kc-vol-22", "title": "Kailash Chandra Volume 22", "description": "Complete transcriptions for Kailash Chandra Volume 22.", "folderId": "kc-vols", "category": "SSC", "year": 2026, "month": "All", "pdfUrl": "/magazines/kc/Kailash Chandra Volume 22.pdf", "pages": 0, "publisher": "KC Publications", "tags": ["ssc", "kc", "volume-22"], "addedAt": "2026-10-03T00:00:00Z"},
  {"id": "kc-vol-23", "title": "Kailash Chandra Volume 23", "description": "Complete transcriptions for Kailash Chandra Volume 23.", "folderId": "kc-vols", "category": "SSC", "year": 2026, "month": "All", "pdfUrl": "/magazines/kc/Kailash Chandra Volume 23.pdf", "pages": 0, "publisher": "KC Publications", "tags": ["ssc", "kc", "volume-23"], "addedAt": "2026-10-03T00:00:00Z"},
  {"id": "kc-vol-24", "title": "Kailash Chandra Volume 24", "description": "Complete transcriptions for Kailash Chandra Volume 24.", "folderId": "kc-vols", "category": "SSC", "year": 2026, "month": "All", "pdfUrl": "/magazines/kc/Kailash Chandra Volume 24.pdf", "pages": 0, "publisher": "KC Publications", "tags": ["ssc", "kc", "volume-24"], "addedAt": "2026-10-03T00:00:00Z"},
];
