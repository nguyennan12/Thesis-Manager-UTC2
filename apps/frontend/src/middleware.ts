import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('access_token')?.value;

  // 1. Nếu đã đăng nhập mà truy cập trang /login -> chuyển hướng về /dashboard
  if (pathname === '/login') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // 2. Nếu chưa đăng nhập mà truy cập root / hoặc các trang nghiệp vụ -> chuyển hướng về /login
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 3. Nếu là root / mà đã đăng nhập -> chuyển hướng về /dashboard
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
};
