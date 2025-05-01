import { StepProps } from "@/types/form"; // Added StepProps
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
import Link from "next/link"; // Added

export default function Step2({
  formData,
  handleChange,
  handleNext,
  handlePrev,
  handleDateChange,
  validationErrors,
  isLoading,
}: StepProps) { // Use StepProps

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
    // Check if handleDateChange exists before calling
    if (dates.from && dates.to && handleDateChange) {
      handleDateChange({ from: dates.from, to: dates.to });
    }
  };

  return (
    <div>
      {/* Changed Title */}
      <h2 className="text-xl font-black text-center mb-4 py-4">
        Pasul 2/3: Detalii Înregistrare
      </h2>


      <div className="space-y-8">
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
            onValueChange={(value) =>
              handleChange("userData", {
                name: "transport",
                value,
              })
            }
            className="flex flex-col space-y-1"
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
              <RadioGroupItem value="schi" id="schi" />
              <Label htmlFor="schi">Da, cu ski/snowboard</Label>
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
            disabled={isLoading}
          >
            ← Înapoi
          </Button>
          <Button onClick={handleNext} disabled={isLoading}>
            {isLoading ? "Se procesează..." : "Continuă →"}
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
    </div>
  );
}
