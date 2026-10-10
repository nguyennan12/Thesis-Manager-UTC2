import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  const pathname = req.nextUrl.pathname;

  // 1. Chưa đăng nhập mà vào dashboard -> redirect về login
  if (!token && pathname.startsWith('/(dashboard)')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 2. Chặn quyền theo Route Groups
  // (Trong thực tế sẽ decode JWT payload để lấy role & positions)

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
