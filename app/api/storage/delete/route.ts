import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Extract the file path from the URL
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Extract the file path relative to the bucket
    // Find where "profile-images" appears in the path
    const bucketNameIndex = pathname.indexOf("profile-images");
    if (bucketNameIndex === -1) {
      return NextResponse.json(
        { error: "Invalid storage URL format" },
        { status: 400 }
      );
    }

    // Get the path after the bucket name (including any folders)
    const startIndex = bucketNameIndex + "profile-images".length + 1; // +1 for the slash
    const filePath = pathname.substring(startIndex);

    // Delete the file from Supabase Storage
    const { error } = await supabase.storage
      .from("profile-images")
      .remove([filePath]);

    if (error) {
      console.error("Error deleting file:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return success if everything went well
    return NextResponse.json({
      success: true,
      message: `Successfully deleted file: ${filePath}`,
    });
  } catch (error) {
    console.error("Error in delete route:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
