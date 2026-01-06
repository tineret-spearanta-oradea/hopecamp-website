import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerActionClient } from '@/lib/supabase/server';

// Use service role client for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Verify the requesting user is an admin
    const supabase = createServerActionClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has pending_contacts.write permission
    const { data: permissions } = await supabaseAdmin
      .from('user_permissions')
      .select(`
        permission_id,
        admin_permissions!inner(name)
      `)
      .eq('user_id', user.id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userPermissions = permissions?.map((p: any) => p.admin_permissions?.name) || [];
    const hasWritePermission = userPermissions.includes('pending_contacts.write');

    if (!hasWritePermission) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { pendingContactId } = await request.json();

    if (!pendingContactId) {
      return NextResponse.json({ error: 'pendingContactId is required' }, { status: 400 });
    }

    // 1. Get the pending contact data
    const { data: pendingContact, error: fetchError } = await supabaseAdmin
      .from('pending_contacts')
      .select('*')
      .eq('id', pendingContactId)
      .single();

    if (fetchError || !pendingContact) {
      return NextResponse.json({ error: 'Contactul nu a fost găsit' }, { status: 404 });
    }

    if (pendingContact.status === 'resolved') {
      return NextResponse.json({ error: 'Acest contact a fost deja rezolvat' }, { status: 400 });
    }

    const formData = pendingContact.form_data || {};

    // Normalize phone number - remove + prefix if present for comparison
    const pendingPhone = pendingContact.phone;
    const normalizedPhone = pendingPhone.startsWith('+') ? pendingPhone.slice(1) : pendingPhone;

    let userId: string;

    // 2. Try to create user first, if they already exist we'll get an error and handle it
    const randomPassword = Math.random().toString(36).slice(-12) +
                          Math.random().toString(36).slice(-12);

    const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      phone: normalizedPhone, // Use normalized phone (without +)
      password: randomPassword,
      phone_confirm: true,
      user_metadata: {
        display_name: pendingContact.name,
        userSignUpMetaData: {
          edition_id: pendingContact.edition_id,
          display_name: pendingContact.name,
          age: formData.age ? parseInt(formData.age) : 0,
          gender: formData.gender || 'unknown',
          church: formData.church || '',
          churchContact: formData.churchContact || '',
          payTaxTo: formData.payTaxTo || '',
          transport: formData.transport || '',
          preferences: formData.preferences || '',
          startDate: formData.startDate,
          endDate: formData.endDate,
          imageUrl: formData.imageUrl || '',
          withFamilyMember: false,
        },
      },
    });

    if (createError) {
      // Check if error is because user already exists
      if (createError.message?.includes('already') || createError.message?.includes('registered')) {
        console.log('User already exists, looking up by phone:', normalizedPhone);

        // User exists - find them by iterating through users (paginated)
        let foundUser = null;
        let page = 1;
        const perPage = 1000;

        while (!foundUser) {
          const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers({
            page,
            perPage,
          });

          if (listError || !users || users.length === 0) {
            break;
          }

          foundUser = users.find(u => {
            const userPhone = u.phone || '';
            const normalizedUserPhone = userPhone.startsWith('+') ? userPhone.slice(1) : userPhone;
            return normalizedUserPhone === normalizedPhone || userPhone === pendingPhone;
          });

          if (users.length < perPage) {
            break; // No more pages
          }
          page++;
        }

        if (!foundUser) {
          console.error('User exists but could not be found:', normalizedPhone);
          return NextResponse.json({
            error: 'Utilizatorul există dar nu a putut fi găsit'
          }, { status: 500 });
        }

        userId = foundUser.id;

        // Update their profile with any new data
        await supabaseAdmin
          .from('user_profiles')
          .update({
            name: pendingContact.name,
            age: formData.age ? parseInt(formData.age) : undefined,
            gender: formData.gender || 'unknown',
            image_url: formData.imageUrl || null,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);
      } else {
        console.error('Error creating user from pending contact:', createError);
        return NextResponse.json({
          error: createError?.message || 'Nu am putut crea contul utilizatorului'
        }, { status: 500 });
      }
    } else if (authData?.user) {
      // New user created successfully
      userId = authData.user.id;
      // Wait for trigger to create profile
      await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
      return NextResponse.json({
        error: 'Nu am putut crea contul utilizatorului'
      }, { status: 500 });
    }

    // 3. Check if registration was created by trigger, if not create it manually
    const { data: existingReg } = await supabaseAdmin
      .from('registrations')
      .select('id')
      .eq('user_id', userId)
      .eq('edition_id', pendingContact.edition_id)
      .single();

    let registrationId: number;

    if (existingReg) {
      registrationId = existingReg.id;
    } else {
      // Create registration manually
      const { data: regData, error: regError } = await supabaseAdmin
        .from('registrations')
        .insert({
          user_id: userId,
          edition_id: pendingContact.edition_id,
          church: formData.church === 'alta'
            ? formData.churchOther || ''
            : formData.church || '',
          church_contact: formData.churchContact || '',
          pay_tax_to: formData.payTaxTo || '',
          transport: formData.transport || '',
          preferences: formData.preferences || '',
          start_date: formData.startDate || new Date().toISOString(),
          end_date: formData.endDate || new Date().toISOString(),
          with_family_member: false,
        })
        .select('id')
        .single();

      if (regError) {
        console.error('Error creating registration from pending contact:', regError);
        return NextResponse.json({ error: regError.message }, { status: 500 });
      }

      registrationId = regData.id;
    }

    // 4. Mark pending contact as resolved
    await supabaseAdmin
      .from('pending_contacts')
      .update({
        status: 'resolved',
        resolved_by: user.id,
        resolved_at: new Date().toISOString(),
        resolved_registration_id: registrationId,
        existing_user_id: userId,
      })
      .eq('id', pendingContactId);

    return NextResponse.json({ success: true, registrationId });
  } catch (err) {
    console.error('Unexpected error creating registration from pending contact:', err);
    return NextResponse.json({ error: 'Eroare neașteptată' }, { status: 500 });
  }
}
