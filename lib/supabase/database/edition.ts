import { supabaseBrowserClient } from "@/lib/supabase/client";
import { Edition } from "@/types/edition";
import {SupabaseClient} from "@supabase/supabase-js";

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

/**
 * Inserts a new edition into the database using the admin client.
 * @param editionData - The data for the new edition (dates as ISO strings).
 * @param supabaseClient - the
 * @returns A Promise resolving to the newly created Edition object.
 */
export async function insertEdition(editionData: Edition, supabaseClient: SupabaseClient): Promise<Edition> {
    // Use the admin client for insertion to bypass RLS if necessary during tests/setup

    const { data, error } = await supabaseClient
        .from("editions")
        .insert({
            name: editionData.name,
            start_date: editionData.start_date,
            end_date: editionData.end_date,
            is_open: editionData.is_open,
            created_at: editionData.created_at,
            updated_at: editionData.updated_at,
        })
        .select()
        .single();

    if (error) {
        console.error("Error inserting edition:", error);
        throw new Error(`Database error inserting edition: ${error.message}`);
    }

    return mapEditionDbRow(data);
}
