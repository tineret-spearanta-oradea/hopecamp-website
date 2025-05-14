import { supabaseAdmin } from '@/lib/supabase/server';

const testSupabaseAdmin = supabaseAdmin!;

// Helper to delete all messages - USE WITH CAUTION
export const deleteAllMessages = async () => {
    const { error } = await testSupabaseAdmin.from('messages').delete().neq('id', -1); // Delete all rows
    if (error) {
        console.error("Error deleting messages:", error);
        // Don't throw in cleanup, just log
    }
};
