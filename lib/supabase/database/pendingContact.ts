import { supabaseBrowserClient } from '../client';
import {
  PendingContact,
  PendingContactRow,
  CreatePendingContactInput,
  UpdatePendingContactInput,
  ContactHistoryEntry,
} from '@/types/pendingContact';

// Map database row to TypeScript type
function mapPendingContact(row: PendingContactRow): PendingContact {
  return {
    id: row.id,
    phone: row.phone,
    name: row.name,
    formData: row.form_data || {},
    status: row.status,
    adminNotes: row.admin_notes || '',
    contactHistory: row.contact_history || [],
    existingUserId: row.existing_user_id,
    editionId: row.edition_id,
    resolvedBy: row.resolved_by,
    resolvedAt: row.resolved_at ? new Date(row.resolved_at) : null,
    resolvedRegistrationId: row.resolved_registration_id,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    lastContactedAt: row.last_contacted_at ? new Date(row.last_contacted_at) : null,
  };
}

/**
 * Create a pending contact (for failed OTP flow)
 * This is called when OTP sending fails and user chooses to continue anyway
 */
export async function createPendingContact(
  input: CreatePendingContactInput
): Promise<{ success: boolean; data?: PendingContact; error?: string }> {
  try {
    const { data, error } = await supabaseBrowserClient
      .from('pending_contacts')
      .insert({
        phone: input.phone,
        name: input.name,
        form_data: input.formData,
        edition_id: input.editionId,
        existing_user_id: input.existingUserId || null,
      })
      .select()
      .single();

    if (error) {
      // Check for unique constraint violation (duplicate phone + edition)
      if (error.code === '23505') {
        return {
          success: false,
          error: 'Ai trimis deja o cerere pentru această ediție. Te vom contacta în curând.',
        };
      }
      console.error('Error creating pending contact:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: mapPendingContact(data) };
  } catch (err) {
    console.error('Unexpected error creating pending contact:', err);
    return { success: false, error: 'Eroare neașteptată' };
  }
}

/**
 * Get all pending contacts for an edition (admin only)
 */
export async function getPendingContactsByEdition(
  editionId: number
): Promise<PendingContact[]> {
  const { data, error } = await supabaseBrowserClient
    .from('pending_contacts')
    .select('*')
    .eq('edition_id', editionId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pending contacts:', error);
    throw error;
  }

  return (data || []).map(mapPendingContact);
}

/**
 * Get pending contacts count by status
 */
export async function getPendingContactsCount(
  editionId: number
): Promise<{ new: number; contacted: number; total: number }> {
  const { data, error } = await supabaseBrowserClient
    .from('pending_contacts')
    .select('status')
    .eq('edition_id', editionId)
    .in('status', ['new', 'contacted']);

  if (error) {
    console.error('Error fetching pending contacts count:', error);
    throw error;
  }

  const newCount = data?.filter((c) => c.status === 'new').length || 0;
  const contactedCount = data?.filter((c) => c.status === 'contacted').length || 0;

  return {
    new: newCount,
    contacted: contactedCount,
    total: newCount + contactedCount,
  };
}

/**
 * Get a single pending contact by ID
 */
export async function getPendingContactById(id: number): Promise<PendingContact | null> {
  const { data, error } = await supabaseBrowserClient
    .from('pending_contacts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('Error fetching pending contact:', error);
    throw error;
  }

  return mapPendingContact(data);
}

/**
 * Update pending contact status/notes
 */
export async function updatePendingContact(
  id: number,
  updates: UpdatePendingContactInput
): Promise<PendingContact> {
  const updateData: Record<string, unknown> = {};

  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.adminNotes !== undefined) updateData.admin_notes = updates.adminNotes;
  if (updates.lastContactedAt !== undefined) {
    updateData.last_contacted_at = updates.lastContactedAt.toISOString();
  }

  const { data, error } = await supabaseBrowserClient
    .from('pending_contacts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating pending contact:', error);
    throw error;
  }

  return mapPendingContact(data);
}

/**
 * Add a contact history entry
 */
export async function addContactHistoryEntry(
  id: number,
  entry: ContactHistoryEntry
): Promise<PendingContact> {
  // First get current contact history
  const { data: current, error: fetchError } = await supabaseBrowserClient
    .from('pending_contacts')
    .select('contact_history')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching pending contact for history update:', fetchError);
    throw fetchError;
  }

  const currentHistory = (current?.contact_history as ContactHistoryEntry[]) || [];
  const updatedHistory = [...currentHistory, entry];

  const { data, error } = await supabaseBrowserClient
    .from('pending_contacts')
    .update({
      contact_history: updatedHistory,
      last_contacted_at: new Date().toISOString(),
      status: 'contacted',
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error adding contact history entry:', error);
    throw error;
  }

  return mapPendingContact(data);
}

/**
 * Resolve pending contact by creating a registration from the saved data
 * This is called when admin manually verifies the user and creates their registration
 */
export async function createRegistrationFromPendingContact(
  pendingContactId: number,
  adminUserId: string
): Promise<{ success: boolean; registrationId?: number; error?: string }> {
  try {
    // 1. Get the pending contact data
    const pendingContact = await getPendingContactById(pendingContactId);
    if (!pendingContact) {
      return { success: false, error: 'Contactul nu a fost găsit' };
    }

    if (pendingContact.status === 'resolved') {
      return { success: false, error: 'Acest contact a fost deja rezolvat' };
    }

    const formData = pendingContact.formData;

    // 2. Check if user with this phone already exists
    const { data: existingUser } = await supabaseBrowserClient
      .from('auth_users_view')
      .select('id')
      .eq('phone', pendingContact.phone)
      .single();

    let userId: string;

    if (existingUser) {
      // User exists - use their ID
      userId = existingUser.id;

      // Update their profile with any new data
      await supabaseBrowserClient
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
      // New user - create auth account and profile
      // Generate a random password (user can reset it later)
      const randomPassword = Math.random().toString(36).slice(-12) +
                            Math.random().toString(36).slice(-12);

      const { data: authData, error: signUpError } = await supabaseBrowserClient.auth.signUp({
        phone: pendingContact.phone,
        password: randomPassword,
        options: {
          data: {
            display_name: pendingContact.name,
            userSignUpMetaData: {
              edition_id: pendingContact.editionId,
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
        },
      });

      if (signUpError || !authData.user) {
        console.error('Error creating user from pending contact:', signUpError);
        return {
          success: false,
          error: signUpError?.message || 'Nu am putut crea contul utilizatorului'
        };
      }

      userId = authData.user.id;

      // Note: The auth trigger should create the profile and registration automatically
      // But we'll wait a moment and verify
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 3. Check if registration was created by trigger, if not create it manually
    const { data: existingReg } = await supabaseBrowserClient
      .from('registrations')
      .select('id')
      .eq('user_id', userId)
      .eq('edition_id', pendingContact.editionId)
      .single();

    let registrationId: number;

    if (existingReg) {
      registrationId = existingReg.id;
    } else {
      // Create registration manually
      const { data: regData, error: regError } = await supabaseBrowserClient
        .from('registrations')
        .insert({
          user_id: userId,
          edition_id: pendingContact.editionId,
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
        return { success: false, error: regError.message };
      }

      registrationId = regData.id;
    }

    // 4. Mark pending contact as resolved
    await supabaseBrowserClient
      .from('pending_contacts')
      .update({
        status: 'resolved',
        resolved_by: adminUserId,
        resolved_at: new Date().toISOString(),
        resolved_registration_id: registrationId,
        existing_user_id: userId,
      })
      .eq('id', pendingContactId);

    return { success: true, registrationId };
  } catch (err) {
    console.error('Unexpected error creating registration from pending contact:', err);
    return { success: false, error: 'Eroare neașteptată' };
  }
}

/**
 * Mark pending contact as abandoned
 */
export async function abandonPendingContact(id: number): Promise<PendingContact> {
  const { data, error } = await supabaseBrowserClient
    .from('pending_contacts')
    .update({ status: 'abandoned' })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error abandoning pending contact:', error);
    throw error;
  }

  return mapPendingContact(data);
}
