import { StepProps, FormData } from "@/types/form"; // Added FormData
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Input } from "../ui/input"; // Added Input
import { cn } from "@/lib/utils";
import { StepWrapper } from "./StepWrapper";
import { Check } from "lucide-react";
import { sumToPay, dateRange } from "@/lib/constants";
import { format } from "date-fns";

export default function Step3({
  formData,
  handleChange,
  handlePrev,
  handleSubmit,
  agreementChecked,
  setAgreementChecked,
  downloadCampRules,
  isLoading,
  validationErrors,
}: StepProps) {
  const retrieveNumberOfDays = () => {
    if (!formData.userData.startDate || !formData.userData.endDate) {
      return [0, 0];
    }
    const numberOfDaysSelected = Math.ceil(
      (formData.userData.endDate.getTime() -
        formData.userData.startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const numberOfDaysCamp = Math.ceil(
      (dateRange.endDate.getTime() - dateRange.startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return [numberOfDaysSelected, numberOfDaysCamp];
  };

  const [numberOfDaysSelected, numberOfDaysCamp] = retrieveNumberOfDays();
  const isFullTime = numberOfDaysSelected === numberOfDaysCamp;

  // Added handler for phone input
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    objectName: keyof FormData
  ) => {
    handleChange(objectName, e.target);
  };

  return (
    // Changed Title
    <StepWrapper title="Pasul 3/3: Autentificare & Confirmare" isLoading={isLoading}>
      <div className="space-y-8">

         {/* Added Phone Number Input */}
         <div className="space-y-2">
          <Label className="text-base font-semibold">Număr de telefon *</Label>
          <Input
            type="tel"
            name="phone"
            value={formData.userData.phone}
            onChange={(e) => handleInputChange(e, "userData")}
            className={validationErrors.phone ? "border-destructive" : ""}
            placeholder="Ex: 0712345678"
          />
          {validationErrors.phone && (
            <p className="text-destructive text-xs">{validationErrors.phone}</p>
          )}
           <p className="text-xs text-muted-foreground">
             Vom folosi acest număr pentru a te autentifica și a te contacta.
           </p>
        </div>

        {/* Kept Download Rules Button */}
        <div className="text-center mb-6">
          <Button
            onClick={downloadCampRules}
            variant="outline"
            className="bg-gray-100 hover:bg-gray-200 font-bold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="0.5"
              viewBox="0 0 16 16"
              className="mr-2"
            >
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
            </svg>
            DESCARCĂ REGULAMENT
          </Button>
        </div>

        <div className="space-y-4 text-sm">
          <p>
            - Am citit si sunt de acord cu <strong>regulamentul</strong>{" "}
            taberei.
          </p>

          {isFullTime ? (
            <>
              <p>
                - Taxa de înscriere pentru persoanele care vin full-time este de{" "}
                <strong>{sumToPay.normal} RON</strong> (cazare + mâncare).
                {sumToPay.withFamilyMember && (
                  <>
                    {" "}
                    Pentru persoanele care au <strong>
                      membru de familie
                    </strong>{" "}
                    (frați, surori, soț, soție) în tabără taxa este de{" "}
                    <strong>{sumToPay.withFamilyMember} RON</strong>.
                  </>
                )}
              </p>
              <p>
                - Voi plăti avansul de {sumToPay.deposit} RON până la data de{" "}
                <strong>
                  {format(dateRange.depositPaymentDueDate, "d MMM yyyy")}
                </strong>
                .
              </p>
            </>
          ) : (
            <p>
              - Taxa de înscriere pentru persoanele care NU vin full-time este
              de {sumToPay.perDay} lei/zi (cazare + mâncare). Totalul tău este
              de <strong>{sumToPay.perDay * numberOfDaysSelected} RON</strong>{" "}
              (pentru {numberOfDaysSelected} zile).
            </p>
          )}

          {parseInt(formData.userData.age) < 18 && (
            <p className="text-hope-orange">
              - Deoarece ai <strong>sub 18 ani</strong>, trebuie să descarci
              regulamentul, și să îl semnezi tu și părintele tău (tutorele
              legal) și să îl aduci în tabără împreuna cu copia buletinului tău.
            </p>
          )}

          <div className="flex items-start space-x-2 pt-2">
            <div className="relative">
              <Checkbox
                id="agreement"
                checked={agreementChecked}
                onCheckedChange={(checked) => {
                  if (setAgreementChecked) {
                    setAgreementChecked(checked as boolean);
                  }
                }}
                className="mt-0.5 h-4 w-4 rounded-sm border border-third text-third data-[state=checked]:bg-third data-[state=checked]:text-primary-foreground"
              />
              {agreementChecked && (
                <Check className="h-3 w-3 absolute top-1 left-0.5 text-white pointer-events-none" />
              )}
            </div>
            <label htmlFor="agreement" className="text-sm leading-tight">
              Am citit si sunt de acord cu cele de mai sus.
            </label>
          </div>

          {!agreementChecked && (
            <p className="text-destructive text-xs italic text-center">
              Trebuie sa fii de-acord cu regulamentul taberei
            </p>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handlePrev}>
            ← Înapoi
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!agreementChecked || isLoading}
            className="bg-secondary text-white hover:bg-secondary/90"
          >
            {isLoading ? "Se procesează..." : "Înscrie-te ↗"}
          </Button>
        </div>
      </div>
    </StepWrapper>
  );
}
