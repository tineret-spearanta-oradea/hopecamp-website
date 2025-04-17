import { NextRequest, NextResponse } from "next/server";
// Import the updated server client creation function and the admin client
import { createServerActionClient, supabaseAdmin } from "@/lib/supabase/server"; // Use createServerActionClient
import { getUserData } from "@/lib/supabase/database/user"; // Import the modified function

export async function DELETE(request: NextRequest) {
    // 1. Create a server client instance for this request to check user auth
    const supabaseUserClient = createServerActionClient(); // Use the renamed function
    const { data: { user }, error: authError } = await supabaseUserClient.auth.getUser();

    if (authError || !user) {
        console.error("Delete user API: Auth error", authError);
        return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }

    // 2. Check if the requesting user is a super admin using the server client
    // Pass the supabaseUserClient to getUserData
    const currentUserData = await getUserData(user.id, supabaseUserClient);
    if (!currentUserData?.isSuperAdmin) {
        console.warn(`Delete user API: User ${user.id} (${currentUserData?.email || 'email unknown'}) attempted delete without super admin rights.`);
        return NextResponse.json({ message: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    // 3. Get the user ID to delete from the query parameters
    const { searchParams } = new URL(request.url);
    const userIdToDelete = searchParams.get("userId");

    if (!userIdToDelete) {
        return NextResponse.json({ message: "Missing userId query parameter" }, { status: 400 });
    }

    // Prevent super admins from deleting themselves (optional safeguard)
    if (userIdToDelete === user.id) {
        return NextResponse.json({ message: "Cannot delete your own account" }, { status: 400 });
    }

    // 4. Use the admin client to delete the user
    // Check if the admin client was initialized correctly (service key might be missing)
    if (!supabaseAdmin) {
         console.error("Delete user API: Admin client is not available. Check SUPABASE_SERVICE_ROLE_KEY.");
         return NextResponse.json({ message: "Server configuration error." }, { status: 500 });
    }

    try {
        // Use the admin client's auth admin interface
        const {error: deletionError } = await supabaseAdmin.auth.admin.deleteUser(userIdToDelete);

        if (deletionError) {
            console.error(`Delete user API: Failed to delete user ${userIdToDelete} by admin ${user.id}:`, deletionError);
            // Provide a more specific error message if possible
            if (deletionError.message.includes("User not found")) {
                 return NextResponse.json({ message: `User with ID ${userIdToDelete} not found.` }, { status: 404 });
            }
            return NextResponse.json({ message: `Failed to delete user: ${deletionError.message}` }, { status: 500 });
        }

        console.log(`Delete user API: User ${userIdToDelete} deleted successfully by admin ${user.id}`);
        // Note: Deleting the auth user might trigger database cascades to delete related data (e.g., user_profiles)
        // If not, you might need to explicitly delete from user_profiles here using supabaseAdmin.
        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });

    } catch (error: any) {
        console.error(`Delete user API: Unexpected error deleting user ${userIdToDelete}:`, error);
        return NextResponse.json({ message: `An unexpected error occurred: ${error.message || 'Unknown error'}` }, { status: 500 });
    }
}

// Optional: Add GET or other methods if needed, otherwise remove them or keep simple placeholders.
export async function GET() {
    // Indicate that only DELETE is allowed
    return new Response(null, { status: 405, headers: { Allow: 'DELETE' } });
}
