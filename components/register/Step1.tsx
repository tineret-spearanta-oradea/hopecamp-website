import { StepProps, FormData, ValidationErrors } from "@/types/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { StepWrapper } from "./StepWrapper";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { SupabaseUploader } from "../ui/SupabaseUploader";
import { deleteProfileImage } from "@/utils/supabaseClient";

export default function Step1({
  formData,
  handleChange,
  handleNext,
  validationErrors,
  isLoading,
  handleImageChange,
}: StepProps & { handleImageChange: (imageUrl: string) => void }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    objectName: keyof FormData
  ) => {
    handleChange(objectName, e.target);
  };

  const handleDeleteImage = async () => {
    try {
      if (formData.userData.imageUrl) {
        await deleteProfileImage(formData.userData.imageUrl);
        handleImageChange("");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Eroare la ștergerea imaginii", {
        description:
          "Imaginea nu a putut fi ștearsă. Te rugăm să încerci din nou.",
      });
    }
  };

  const getMetadata = () => {
    return {
      userName: formData.userData.name || undefined,
      userAge: formData.userData.age || undefined,
      category: "profile",
    };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      toast.info("Ai nevoie de ajutor?", {
        description: (
          <div>
            Dacă întâmpini probleme, ne poți contacta pe{" "}
            <a
              href="https://wa.me/40773311577"
              target="_blank"
              rel="noopener noreferrer"
              className="text-hope-darkcyan hover:underline"
            >
              WhatsApp
            </a>{" "}
            (0773 311 577) sau la{" "}
            <a
              href="mailto:dev@hopecamp.ro"
              className="text-hope-darkcyan hover:underline"
            >
              dev@hopecamp.ro
            </a>
          </div>
        ),
        duration: 45000,
        action: {
          label: "Închide",
          onClick: () => console.log("Closed"),
        },
      });
    }, 45000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <StepWrapper title="Pasul 1/3: Detalii Personale" isLoading={isLoading}>
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-semibold">Numele întreg *</Label>
            <Input
              type="text"
              name="name"
              value={formData.userData.name}
              onChange={(e) => handleInputChange(e, "userData")}
              className={validationErrors.name ? "border-destructive" : ""}
            />
            {validationErrors.name && (
              <p className="text-destructive text-xs">
                {validationErrors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">Vârsta *</Label>
            <Input
              type="number"
              name="age"
              value={formData.userData.age}
              onChange={(e) => handleInputChange(e, "userData")}
              className={validationErrors.age ? "border-destructive" : ""}
            />
            {validationErrors.age && (
              <p className="text-destructive text-xs">{validationErrors.age}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">
              Încarcă poză cu tine
            </Label>
            <div className="space-y-4">
              <SupabaseUploader
                onUploadSuccess={(url) => {
                  handleImageChange(url);
                  setIsUploading(false);
                  toast.success("Poza a fost încărcată cu succes!", {
                    description: "Poți continua cu înregistrarea.",
                  });
                }}
                onUploadError={(error: Error) => {
                  console.error("Upload error:", error);
                  setIsUploading(false);

                  if (error.message.includes("FileSizeMismatch")) {
                    toast.error("Fișierul este prea mare", {
                      description:
                        "Te rugăm să încarci o poză mai mică de 4MB.",
                    });
                  } else {
                    toast.error("Eroare la încărcare", {
                      description:
                        "Te rugăm să încerci din nou. Dacă problema persistă, contactează-ne. Dacă nu reușești nicicum să încarci poza, poti trece la urmatorul pas, si te vom contacta mai tarziu.",
                    });
                  }
                }}
                onUploadBegin={() => {
                  setIsUploading(true);
                }}
                disabled={!!formData.userData.imageUrl}
                metadata={getMetadata()}
                category="profile"
              />
              {isUploading && (
                <p className="text-sm text-muted-foreground text-center animate-pulse">
                  Se încarcă poza...
                </p>
              )}
              {formData.userData.imageUrl ? (
                <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-muted">
                    <Image
                      src={formData.userData.imageUrl}
                      alt="Preview"
                      width={36}
                      height={36}
                      className="rounded-md object-cover h-full w-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span>✓ Poza a fost încărcată cu succes!</span>
                    <button
                      onClick={handleDeleteImage}
                      className="text-left text-muted-foreground hover:text-destructive"
                    >
                      Șterge poza
                    </button>
                  </div>
                </div>
              ) : null}
              {validationErrors.image && (
                <p className="text-destructive text-xs">
                  {validationErrors.image}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleNext} disabled={isLoading || isUploading}>
            {isUploading
              ? "Se încarcă poza..."
              : isLoading
              ? "Se procesează..."
              : "Continuă →"}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Câmpurile marcate cu * sunt obligatorii
        </p>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Ai deja cont?{" "}
          <Link href="/login" className="text-hope-lightcyan hover:underline">
            Autentifică-te aici
          </Link>
          .
        </p>
      </div>
    </StepWrapper>
  );
}
