import { FormData, ValidationErrors } from "@/types/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  churchOptions,
  payTaxToOptions,
  transportOptions,
} from "@/lib/constants";
import { DatePickerWithRange } from "../ui/date-picker";
import { UploadButton } from "@/utils/uploadthing";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

interface Step2Props {
  formData: FormData;
  handleChange: (
    objectName: "authData" | "userData",
    e: { name: string; value: string }
  ) => void;
  handleNext: () => void;
  handlePrev: () => void;
  handleDateChange: (dates: { from: Date; to: Date }) => void;
  handleImageChange: (imageUrl: string) => void;
  validationErrors: ValidationErrors;
  isLoading: boolean;
}

export default function Step2({
  formData,
  handleChange,
  handleNext,
  handlePrev,
  handleDateChange,
  handleImageChange,
  validationErrors,
  isLoading,
}: Step2Props) {
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    objectName: "authData" | "userData"
  ) => {
    handleChange(objectName, e.target);
  };

  const handleDateChangeWrapper = (dates: {
    from: Date | null;
    to: Date | null;
  }) => {
    if (dates.from && dates.to) {
      handleDateChange({ from: dates.from, to: dates.to });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-black text-center mb-4 py-4">
        Pasul 2/3: Detalii personale
      </h2>

      {isLoading && (
        <p className="text-sm my-4 text-center text-hope-lightcyan">
          Te-am recunoscut din taberele trecute! Verifică şi completează
          câmpurile lipsă.
        </p>
      )}

      <div className="space-y-8">
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
            <p className="text-destructive text-xs">{validationErrors.name}</p>
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
          <Label className="text-base font-semibold">Număr de telefon *</Label>
          <Input
            type="tel"
            name="phone"
            value={formData.userData.phone}
            onChange={(e) => handleInputChange(e, "userData")}
            className={validationErrors.phone ? "border-destructive" : ""}
          />
          {validationErrors.phone && (
            <p className="text-destructive text-xs">{validationErrors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold">
            Perioada în care stai în tabără *
          </Label>
          <DatePickerWithRange
            from={formData.userData.startDate || null}
            to={formData.userData.endDate || null}
            onChange={handleDateChangeWrapper}
            className={validationErrors.dateRange ? "border-destructive" : ""}
          />
          {validationErrors.dateRange && (
            <p className="text-destructive text-xs">
              {validationErrors.dateRange}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold">
            Încarcă poză cu tine *
          </Label>
          <div className="space-y-4">
            <UploadButton
              endpoint="profileImage"
              onClientUploadComplete={(res) => {
                if (res?.[0]?.url) {
                  handleImageChange(res[0].url);
                  setIsUploading(false);
                  toast({
                    title: "Poza a fost încărcată cu succes!",
                    description: "Poți continua cu înregistrarea.",
                  });
                }
              }}
              onUploadError={(error: Error) => {
                console.error("Upload error:", error);
                setIsUploading(false);

                if (error.message.includes("FileSizeMismatch")) {
                  toast({
                    variant: "destructive",
                    title: "Fișierul este prea mare",
                    description: "Te rugăm să încarci o poză mai mică de 4MB.",
                  });
                } else {
                  toast({
                    variant: "destructive",
                    title: "Eroare la încărcare",
                    description:
                      "Te rugăm să încerci din nou. Dacă problema persistă, contactează-ne.",
                  });
                }
              }}
              onUploadBegin={() => {
                setIsUploading(true);
              }}
              appearance={{
                button: cn(
                  "bg-secondary text-secondary-foreground hover:bg-secondary/90",
                  formData.userData.imageUrl && "opacity-50 cursor-not-allowed",
                  validationErrors.image && "border-destructive"
                ),
                allowedContent: "text-sm text-muted-foreground text-center",
              }}
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
                    onClick={() => handleImageChange("")}
                    className="text-left text-muted-foreground hover:text-destructive"
                  >
                    Șterge poza
                  </button>
                </div>
              </div>
            ) : null}
            {validationErrors.image && (
              <p className="text-xs text-destructive text-center">
                {validationErrors.image}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold">
            Biserica din care provii *
          </Label>
          <RadioGroup
            value={formData.userData.church}
            className="flex flex-col space-y-1"
            onValueChange={(value) =>
              handleChange("userData", { name: "church", value })
            }
          >
            {churchOptions.map((option) => (
              <div key={option.value} className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
                {option.value === "alta" &&
                  formData.userData.church === "alta" && (
                    <div className="ml-6 space-y-2">
                      <Input
                        type="text"
                        placeholder="Numele bisericii"
                        className="w-full"
                        value={formData.userData.churchOther || ""}
                        onChange={(e) =>
                          handleChange("userData", {
                            name: "churchOther",
                            value: e.target.value,
                          })
                        }
                      />
                      <div className="space-y-1">
                        <Label className="text-sm text-muted-foreground">
                          Spune-ne numele unui prieten(ă) sau a unei cunoștințe
                          din contextul Tineret Speranța Oradea
                        </Label>
                        <Input
                          type="text"
                          placeholder="Numele prietenului/prietenei"
                          className="w-full"
                          value={formData.userData.churchContact || ""}
                          onChange={(e) =>
                            handleChange("userData", {
                              name: "churchContact",
                              value: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </RadioGroup>
          {validationErrors.church && (
            <p className="text-destructive text-xs">
              {validationErrors.church}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold">
            Cui plătești taxa de înscriere *
          </Label>
          <RadioGroup
            value={formData.userData.payTaxTo}
            className="flex flex-col space-y-1"
            onValueChange={(value) =>
              handleChange("userData", { name: "payTaxTo", value })
            }
          >
            {payTaxToOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          {validationErrors.payTaxTo && (
            <p className="text-destructive text-xs">
              {validationErrors.payTaxTo}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold">
            Mijloc de transport *
          </Label>
          <RadioGroup
            value={formData.userData.transport}
            className="flex flex-col space-y-1"
            onValueChange={(value) =>
              handleChange("userData", { name: "transport", value })
            }
          >
            {transportOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          {validationErrors.transport && (
            <p className="text-destructive text-xs">
              {validationErrors.transport}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold">
            Vei merge pe pârtia Mărișel? *
          </Label>
          <RadioGroup
            value={formData.userData.slopeActivity}
            className="flex flex-col space-y-1"
            onValueChange={(value) =>
              handleChange("userData", { name: "slopeActivity", value })
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no" />
              <Label htmlFor="no">Nu voi merge pe pârtie</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="visit" id="visit" />
              <Label htmlFor="visit">Da, dar doar în vizită</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ski" id="ski" />
              <Label htmlFor="ski">Da, cu ski/snowboard</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sled" id="sled" />
              <Label htmlFor="sled">Da, cu sania</Label>
            </div>
          </RadioGroup>
          {validationErrors.slopeActivity && (
            <p className="text-xs text-destructive">
              {validationErrors.slopeActivity}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold">
            Preferințe colegi de cameră (opțional)
          </Label>
          <Input
            type="text"
            name="preferences"
            value={formData.userData.preferences}
            onChange={(e) => handleInputChange(e, "userData")}
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={isLoading || isUploading}
          >
            ← Înapoi
          </Button>
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
      </div>
    </div>
  );
}
