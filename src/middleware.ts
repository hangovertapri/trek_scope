import { NextRequest, NextResponse } from 'next/server';
import type { NextMiddlewareResult } from 'next/dist/server/web/types';

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 login attempts per IP

function getRateLimitKey(ip: string, endpoint: string): string {
  return `${ip}:${endpoint}`;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const limit = rateLimitStore.get(key);

  if (!limit || now > limit.resetTime) {
    // Reset window
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (limit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  limit.count++;
  return true;
}

// CSRF token generation using Web Crypto API (Edge Runtime compatible)
function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function middleware(request: NextRequest): NextMiddlewareResult {
  const { pathname } = request.nextUrl;

  // Apply rate limiting to auth endpoints
  if (pathname === '/api/auth/callback/credentials' || pathname?.includes('/api/auth/signin')) {
    const ip = getClientIp(request);
    const key = getRateLimitKey(ip, 'auth');

    if (!checkRateLimit(key)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }
  }

  // Add security headers
  const response = NextResponse.next();

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  // Add CSRF token to response headers (for client-side forms)
  if (pathname?.includes('login')) {
    response.headers.set('X-CSRF-Token', generateCSRFToken());
  }

  return response;
}

export const config = {
  matcher: [
    '/api/auth/:path*',
    '/admin/:path*',
    '/agency/:path*',
  ],
};
