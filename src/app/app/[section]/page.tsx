'use client';
import {notFound,useParams,useSearchParams} from 'next/navigation';
import {Suspense} from 'react';
import PracticeWorkspace from '@/features/practice/practice-workspace';
import LearningView from '@/features/learning/learning-view';
import Dashboard from '@/features/dashboard';
import Library from '@/features/library';
import Analytics from '@/features/analytics';
import Admin from '@/features/admin';
import TypingCourse from '@/features/typing/typing-course';
import MagazinesView from '@/features/magazines/magazines-view';
import DictationsView from '@/features/dictations/dictations-view';
function View(){const params=useParams<{section:string}>();const search=useSearchParams();const section=params.section;if(section==='dashboard')return <Dashboard/>;if(section==='library')return <Library/>;if(section==='analytics')return <Analytics/>;if(section==='admin')return <Admin/>;if(section==='typing'||section==='lessons')return <TypingCourse layoutParam={search.get('layout')} lessonParam={search.get('lesson')}/>;if(section==='practice')return <PracticeWorkspace key={search.toString()} dictationId={search.get('id')||undefined} mode={(search.get('mode') as 'typing'|'dictation'|'exam'|'drill')||'typing'} duration={Number(search.get('duration')||600)} examPreset={search.get('preset')||undefined} listeningDuration={Number(search.get('listening')||0)||undefined} transcriptionDuration={Number(search.get('transcription')||0)||undefined}/>;if(section==='magazines')return <MagazinesView folderId={search.get('folder')||undefined} magazineId={search.get('id')||undefined}/>;if(section==='dictations')return <DictationsView/>;if(!['drills','mistakes','spellings','exams','resources','folders','leaderboard','achievements','coach','study-plan','profile','notifications','magazines','dictations'].includes(section))notFound();return <LearningView section={section}/>}
export default function SectionPage(){return <Suspense fallback={<div className="loading-shell"><div className="skeleton"/><div className="skeleton"/></div>}><View/></Suspense>}
