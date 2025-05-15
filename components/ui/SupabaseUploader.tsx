import { useState, useRef } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { uploadProfileImage, UploadOptions } from "@/utils/supabaseClient";
import Image from "next/image";

interface SupabaseUploaderProps {
  onUploadSuccess: (url: string) => void;
  onUploadError: (error: Error) => void;
  onUploadBegin: () => void;
  className?: string;
  disabled?: boolean;
  buttonText?: string;
  allowedTypes?: string[];
  maxFileSize?: number; // in bytes
  metadata?: UploadOptions; // Metadata for the file
  category?: string; // Default category for the file
}

export function SupabaseUploader({
  onUploadSuccess,
  onUploadError,
  onUploadBegin,
  className,
  disabled = false,
  buttonText = "Încarcă imagine",
  allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"],
  maxFileSize = 5 * 1024 * 1024, // 5MB by default
  metadata = {},
  category = "profile",
}: SupabaseUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    // Clear any previous error messages when starting a new upload
    setErrorMessage(null);

    // Call onUploadBegin when the button is clicked, not just when a file is selected
    // This ensures uploadAttempted is set to true immediately when the button is clicked
    onUploadBegin();

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      console.log("No files selected");
      return;
    }

    const file = files[0];
    console.log(
      `File selected: ${file.name}, type: ${file.type}, size: ${file.size} bytes`
    );

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      const errorMsg = `Tipul fișierului nu este acceptat. Formatele permise: ${allowedTypes.join(
        ", "
      )}`;
      console.error(errorMsg);
      setErrorMessage(errorMsg);
      onUploadError(new Error(errorMsg));
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      const errorMsg = `Fișierul este prea mare. Dimensiunea maximă permisă este de ${
        maxFileSize / (1024 * 1024)
      }MB`;
      console.error(`FileSizeMismatch: ${errorMsg}`);
      setErrorMessage(errorMsg);
      onUploadError(new Error(`FileSizeMismatch: ${errorMsg}`));
      return;
    }

    try {
      setIsUploading(true);
      setErrorMessage(null);
      // No need to call onUploadBegin again here since we already called it in handleClick
      // onUploadBegin();

      console.log("Starting upload process...");

      // Prepare metadata options with the category
      const uploadOptions: UploadOptions = {
        ...metadata,
        category: metadata.category || category,
      };

      // Upload file to Supabase Storage with metadata
      console.log("Uploading to Supabase with options:", uploadOptions);
      const url = await uploadProfileImage(file, uploadOptions);
      console.log("Upload successful, URL:", url);

      // Clear the input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onUploadSuccess(url);
    } catch (error) {
      console.error("Upload failed:", error);
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Eroare necunoscută la încărcarea imaginii";

      setErrorMessage(errorMsg);
      onUploadError(
        error instanceof Error
          ? error
          : new Error("Eroare la încărcarea fișierului")
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <input
        type="file"
        accept={allowedTypes.join(",")}
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={disabled || isUploading}
        capture="environment" // Add capture for mobile devices
      />
      <Button
        type="button"
        onClick={handleClick}
        disabled={disabled || isUploading}
        className={cn(
          "bg-secondary text-secondary-foreground hover:bg-secondary/90",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {isUploading ? "Se încarcă..." : buttonText}
      </Button>
      <p className="text-sm text-muted-foreground text-center">
        Fișiere acceptate: JPG, PNG, WEBP (max {maxFileSize / (1024 * 1024)}MB)
      </p>

      {/* Display error message if there is one */}
      {errorMessage && (
        <div className="mt-2 text-sm text-destructive bg-destructive/10 p-2 rounded-md">
          <span className="font-semibold">Eroare:</span> {errorMessage}
        </div>
      )}
    </div>
  );
}
