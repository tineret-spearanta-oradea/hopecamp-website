import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role client to bypass RLS for anonymous inserts
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Simple rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS = 10;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

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
      rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  }

  try {
    const body = await request.json();
    const { phone, name, form_data, edition_id, existing_user_id } = body;

    // Validate required fields
    if (!phone || !name || !edition_id) {
      return NextResponse.json(
        { error: 'Phone, name, and edition_id are required' },
        { status: 400 }
      );
    }

    // Insert pending contact
    const { data, error } = await supabaseAdmin
      .from('pending_contacts')
      .insert({
        phone,
        name,
        form_data: form_data || {},
        edition_id,
        existing_user_id: existing_user_id || null,
      })
      .select()
      .single();

    if (error) {
      // Check for unique constraint violation (duplicate phone + edition)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Ai trimis deja o cerere pentru această ediție. Te vom contacta în curând.' },
          { status: 409 }
        );
      }
      console.error('Error creating pending contact:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Unexpected error creating pending contact:', err);
    return NextResponse.json({ error: 'Eroare neașteptată' }, { status: 500 });
  }
}
