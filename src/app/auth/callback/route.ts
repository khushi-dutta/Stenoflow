import { NextResponse } from 'next/server';
import { sessionClient } from '@/lib/server/platform';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get('next');
  const destination = next?.startsWith('/') && !next.startsWith('//') && !next.includes('\\') ? next : '/app';
  const code = url.searchParams.get('code');
  if (!code) return NextResponse.redirect(new URL('/login?error=invalid-link', url.origin));
  try {
    const db = await sessionClient();
    const { error } = await db.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return NextResponse.redirect(new URL(destination, url.origin));
  } catch {
    return NextResponse.redirect(new URL('/login?error=expired-link', url.origin));
  }
}
