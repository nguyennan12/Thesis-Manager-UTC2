import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('access_token')?.value;

  // 1. Nếu đã đăng nhập mà truy cập trang /login -> chuyển hướng về /dashboard
  if (pathname === '/login') {
    if (token && readJwtPayload(token)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // 2. Nếu chưa đăng nhập mà truy cập root / hoặc các trang nghiệp vụ -> chuyển hướng về /login
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Client side navigation is not a security boundary, but route level checks
  // keep users from landing on workspaces for another role. The API performs
  // the authoritative permission checks.
  const payload = readJwtPayload(token);
  if (!payload) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const roles = Array.isArray(payload.roles) ? payload.roles : [];
  const positions = Array.isArray(payload.positions) ? payload.positions : [];
  const isAdmin = roles.includes('ADMIN');
  const isStudent = roles.includes('STUDENT');
  const isLecturer = roles.includes('LECTURER');
  const isStaff = roles.includes('STAFF');
  const isHod = positions.includes('HEAD_OF_DEPARTMENT') || positions.includes('TRUONG_BO_MON');
  const isAcademicAffairs = positions.includes('ACADEMIC_AFFAIRS') || roles.includes('ACADEMIC_AFFAIRS');

  if (pathname.startsWith('/student/') && !isAdmin && !isStudent) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  if (pathname.startsWith('/lecturer/') && !isAdmin && !isLecturer) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  if (pathname.startsWith('/management/topics') && !isAdmin && !isHod) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  if (pathname.startsWith('/management/councils') && !isAdmin && !(isStaff && isAcademicAffairs)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 3. Nếu là root / mà đã đăng nhập -> chuyển hướng về /dashboard
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

function readJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const encoded = token.split('.')[1]?.replace(/-/g, '+').replace(/_/g, '/');
    if (!encoded) return null;
    return JSON.parse(atob(encoded.padEnd(Math.ceil(encoded.length / 4) * 4, '=')));
  } catch {
    return null;
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
};
