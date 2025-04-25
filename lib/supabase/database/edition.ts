import {supabaseBrowserClient} from "@/lib/supabase/client";
import {Edition} from "@/types/edition";

/**
 * Maps a database row (with string dates) to the Edition interface (with Date objects).
 * @param data - The raw data object from the Supabase query result.
 * @returns An Edition object.
 */
export function mapEditionDbRow(data: any): Edition {
    return {
        id: data.id,
        name: data.name,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
        is_open: data.is_open,
        created_at: new Date(data.created_at),
        updated_at: new Date(data.updated_at),
    };
}

/**
 * Fetches the currently active edition (where is_open = true).
 * Throws an error if no active edition is found or if there's a database error.
 * @returns A Promise resolving to the active Edition object.
 */
export async function getActiveEdition(): Promise<Edition> {
    const { data, error } = await supabaseBrowserClient
        .from("editions")
        .select("*")
        .eq("is_open", true)
        .single(); // Ensures only one row is returned, throws error if 0 or >1

    if (error) {
        console.error("Error fetching active edition:", error);
        throw new Error(`Database error fetching active edition: ${error.message}`);
    }

    return mapEditionDbRow(data);
}
