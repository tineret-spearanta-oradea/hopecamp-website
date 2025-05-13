import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client with environment variables
// Make sure these are set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Interface for upload options
export interface UploadOptions {
  userId?: string; // If known at upload time
  userName?: string; // For better searchability in storage
  userAge?: string; // Additional metadata
  category?: string; // e.g., 'profile', 'document', etc.
  editionId?: number; // Camp edition if applicable
}

/**
 * Helper function to upload file to Supabase Storage with better organization
 *
 * @param file The file to upload
 * @param options Additional options for file categorization and metadata
 * @returns The public URL of the uploaded file
 */
export const uploadProfileImage = async (
  file: File,
  options: UploadOptions = {}
): Promise<string> => {
  try {
    // Create a unique file name with date prefix for better sorting
    const fileExt = file.name.split(".").pop();
    const uniqueId = Math.random().toString(36).substring(2, 15);
    const datePrefix = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Determine folder structure
    const category = options.category || "profile";
    const userFolder = options.userId
      ? `user_${options.userId}`
      : "unregistered";

    // Organize files in a logical structure:
    // /{category}/{userFolder}/{datePrefix}_{fileName}.{ext}
    const fileName = `${datePrefix}_${uniqueId}.${fileExt}`;
    const filePath = `${category}/${userFolder}/${fileName}`;

    // Prepare metadata to store with the file
    const metadata: Record<string, string> = {
      originalName: file.name,
      contentType: file.type,
      uploadedAt: new Date().toISOString(),
    };

    // Add optional metadata if provided
    if (options.userName) metadata.userName = options.userName;
    if (options.userAge) metadata.userAge = options.userAge;
    if (options.editionId) metadata.editionId = options.editionId.toString();

    // Upload the file to Supabase Storage with metadata
    const { data, error } = await supabase.storage
      .from("profile-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
        metadata,
      });

    if (error) throw error;

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from("profile-images")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error: any) {
    console.error("Error uploading file:", error.message);
    throw error;
  }
};

// Helper function to delete a file from Supabase Storage
// For unauthenticated users, this will use an API endpoint
export const deleteProfileImage = async (url: string): Promise<void> => {
  try {
    // First, try to delete using the Supabase client directly
    // This will work for authenticated users with proper permissions
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Extract the file path relative to the bucket
    // Find where "profile-images" appears in the path
    const bucketNameIndex = pathname.indexOf("profile-images");
    if (bucketNameIndex === -1) {
      throw new Error("Invalid storage URL format");
    }

    // Get the path after the bucket name (including any folders)
    const startIndex = bucketNameIndex + "profile-images".length + 1; // +1 for the slash
    const filePath = pathname.substring(startIndex);

    const { error } = await supabase.storage
      .from("profile-images")
      .remove([filePath]);

    // If there's a permission error, use the API endpoint as fallback
    if (
      error &&
      (error.message.includes("permission") ||
        error.message.includes("not authorized"))
    ) {
      const response = await fetch("/api/storage/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete file through API");
      }
    } else if (error) {
      // If it's another type of error, throw it
      throw error;
    }
  } catch (error: any) {
    console.error("Error deleting file:", error.message);
    throw error;
  }
};
