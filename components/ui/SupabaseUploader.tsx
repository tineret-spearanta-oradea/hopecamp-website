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
  maxFileSize = 4 * 1024 * 1024, // 4MB by default
  metadata = {},
  category = "profile",
}: SupabaseUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      onUploadError(
        new Error(
          `Tipul fișierului nu este acceptat. Formatele permise: ${allowedTypes.join(
            ", "
          )}`
        )
      );
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      onUploadError(
        new Error(
          `FileSizeMismatch: Fișierul este prea mare. Dimensiunea maximă permisă este de ${
            maxFileSize / (1024 * 1024)
          }MB`
        )
      );
      return;
    }

    try {
      setIsUploading(true);
      onUploadBegin();

      // Prepare metadata options with the category
      const uploadOptions: UploadOptions = {
        ...metadata,
        category: metadata.category || category,
      };

      // Upload file to Supabase Storage with metadata
      const url = await uploadProfileImage(file, uploadOptions);

      // Clear the input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onUploadSuccess(url);
    } catch (error) {
      console.error("Upload failed:", error);
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
    </div>
  );
}
