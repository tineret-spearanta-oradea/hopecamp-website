// Types for the pending contacts system
// Used when OTP sending fails and users need admin follow-up

export type PendingContactStatus = 'new' | 'contacted' | 'resolved' | 'abandoned';

export interface ContactHistoryEntry {
  timestamp: string;
  adminId: string;
  adminName: string;
  action: 'note' | 'called' | 'messaged' | 'resolved' | 'abandoned';
  note?: string;
}

export interface PendingContactFormData {
  age?: string;
  gender?: string;
  church?: string;
  churchOther?: string;
  churchContact?: string;
  transport?: string;
  payTaxTo?: string;
  preferences?: string;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
}

export interface PendingContact {
  id: number;
  phone: string;
  name: string;
  formData: PendingContactFormData;
  status: PendingContactStatus;
  adminNotes: string;
  contactHistory: ContactHistoryEntry[];
  existingUserId: string | null;
  editionId: number;
  resolvedBy: string | null;
  resolvedAt: Date | null;
  resolvedRegistrationId: number | null;
  createdAt: Date;
  updatedAt: Date;
  lastContactedAt: Date | null;
}

export interface CreatePendingContactInput {
  phone: string;
  name: string;
  formData: PendingContactFormData;
  editionId: number;
  existingUserId?: string;
}

export interface UpdatePendingContactInput {
  status?: PendingContactStatus;
  adminNotes?: string;
  lastContactedAt?: Date;
}

// Database row type (snake_case from Supabase)
export interface PendingContactRow {
  id: number;
  phone: string;
  name: string;
  form_data: PendingContactFormData;
  status: PendingContactStatus;
  admin_notes: string;
  contact_history: ContactHistoryEntry[];
  existing_user_id: string | null;
  edition_id: number;
  resolved_by: string | null;
  resolved_at: string | null;
  resolved_registration_id: number | null;
  created_at: string;
  updated_at: string;
  last_contacted_at: string | null;
}
