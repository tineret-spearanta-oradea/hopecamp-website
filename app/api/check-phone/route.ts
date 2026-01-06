import { NextRequest, NextResponse } from 'next/server';
import { checkPhoneExists } from '@/lib/supabase/database/user';
import { createServerActionClient } from '@/lib/supabase/server';

// In-memory rate limiting (simple implementation)
// For production, use Redis or similar
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const MAX_REQUESTS = 50;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now > data.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes

export async function POST(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

  // Rate limiting check
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (userLimit) {
    if (now < userLimit.resetAt) {
      if (userLimit.count >= MAX_REQUESTS) {
        return NextResponse.json(
          { error: 'Prea multe încercări. Te rugăm să aștepți.' },
          { status: 429 }
        );
      }
      userLimit.count++;
    } else {
      // Reset window
      rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  }

  // Check phone
  const { phone } = await request.json();

  if (!phone) {
    return NextResponse.json({ error: 'Phone required' }, { status: 400 });
  }

  // Normalize phone: remove "+" prefix to match database format
  const normalizedPhone = phone.startsWith('+') ? phone.slice(1) : phone;

  // Create server-side Supabase client
  const supabase = createServerActionClient();
  const result = await checkPhoneExists(normalizedPhone, supabase);

  return NextResponse.json({ exists: result.exists });
}
