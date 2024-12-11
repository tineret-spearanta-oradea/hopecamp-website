import { FormData } from "@/types/form";
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
  validationErrors: Record<string, string>;
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
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    objectName: "authData" | "userData"
  ) => {
    handleChange(objectName, e.target);
  };

  return (
    <div>
      <h2 className="text-xl font-black text-center mb-4">
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
          <Label htmlFor="name" className="text-base font-semibold">
            Numele întreg:
          </Label>
          <Input
            id="name"
            type="text"
            name="name"
            value={formData.userData.name}
            onChange={(e) => handleInputChange(e, "userData")}
            className={validationErrors.name ? "border-destructive" : ""}
          />
          {validationErrors.name && (
            <p className="text-destructive text-xs mt-1">
              {validationErrors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="age" className="text-base font-semibold">
            Vârsta:
          </Label>
          <Input
            id="age"
            type="number"
            name="age"
            value={formData.userData.age}
            onChange={(e) => handleInputChange(e, "userData")}
            className={validationErrors.age ? "border-destructive" : ""}
            maxLength={2}
          />
          {validationErrors.age && (
            <p className="text-destructive text-xs mt-1">
              {validationErrors.age}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-base font-semibold">
            Număr de telefon:
          </Label>
          <Input
            id="phone"
            type="tel"
            name="phone"
            value={formData.userData.phone}
            onChange={(e) => handleInputChange(e, "userData")}
            className={validationErrors.phone ? "border-destructive" : ""}
          />
          {validationErrors.phone && (
            <p className="text-destructive text-xs mt-1">
              {validationErrors.phone}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold">
            Perioada care stai în tabără:
          </Label>
          <DatePickerWithRange
            onChange={handleDateChange}
            from={formData.userData.startDate}
            to={formData.userData.endDate}
          />
          {validationErrors.dateRange && (
            <p className="text-destructive text-xs mt-1">
              {validationErrors.dateRange}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Biserica din care provii:
          </Label>
          <RadioGroup
            name="church"
            value={formData.userData.church}
            onValueChange={(value) =>
              handleChange("userData", { name: "church", value })
            }
            className="space-y-2"
          >
            {churchOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
                {option.value === "alta" &&
                  formData.userData.church === "alta" && (
                    <Input
                      type="text"
                      name="churchOther"
                      className="ml-2 w-48"
                      onChange={(e) =>
                        handleChange("userData", {
                          name: "church",
                          value: e.target.value,
                        })
                      }
                    />
                  )}
              </div>
            ))}
          </RadioGroup>
          {validationErrors.church && (
            <p className="text-destructive text-xs mt-1">
              {validationErrors.church}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Cui plătești taxa de înscriere:
          </Label>
          <RadioGroup
            name="payTaxTo"
            value={formData.userData.payTaxTo}
            onValueChange={(value) =>
              handleChange("userData", { name: "payTaxTo", value })
            }
            className="space-y-2"
          >
            {payTaxToOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          {validationErrors.payTaxTo && (
            <p className="text-destructive text-xs mt-1">
              {validationErrors.payTaxTo}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Mijloc de transport:
          </Label>
          <RadioGroup
            name="transport"
            value={formData.userData.transport}
            onValueChange={(value) =>
              handleChange("userData", { name: "transport", value })
            }
            className="space-y-2"
          >
            {transportOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
          {validationErrors.transport && (
            <p className="text-destructive text-xs mt-1">
              {validationErrors.transport}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold">
            Încarcă poză cu tine *
          </Label>
          <UploadButton
            endpoint="profileImage"
            onClientUploadComplete={(res) => {
              if (res?.[0]?.url) {
                handleImageChange(res[0].url);
                setIsUploading(false);
                setUploadSuccess(true);
              }
            }}
            onUploadError={(error: Error) => {
              console.error("Upload error:", error);
              alert(`Eroare la încărcare: ${error.message}`);
              setIsUploading(false);
              setUploadSuccess(false);
            }}
            onUploadBegin={() => {
              setIsUploading(true);
              setUploadSuccess(false);
            }}
            appearance={{
              button: cn(
                "bg-secondary text-secondary-foreground hover:bg-secondary/90",
                uploadSuccess && "opacity-50 cursor-not-allowed"
              ),
              allowedContent: "text-sm text-muted-foreground",
            }}
          />
          {uploadSuccess ? (
            <p className="text-xs text-emerald-600 font-medium">
              ✓ Poza a fost încărcată cu succes!
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Poza trebuie să fie mai mică de 4MB
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferences" className="text-base font-semibold">
            Preferințe colegi de cameră:
          </Label>
          <Input
            id="preferences"
            type="text"
            name="preferences"
            placeholder="optional"
            value={formData.userData.preferences}
            onChange={(e) => handleInputChange(e, "userData")}
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handlePrev}>
            ← Înapoi
          </Button>
          <Button onClick={handleNext} disabled={isLoading || isUploading}>
            {isLoading ? "Se procesează..." : "Continuă →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
