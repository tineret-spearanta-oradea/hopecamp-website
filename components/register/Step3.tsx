import { StepProps } from "@/types/form";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { StepWrapper } from "./StepWrapper";
import { Check } from "lucide-react";
import { sumToPay, dateRange } from "@/lib/constants";
import { format } from "date-fns";

interface Step3Props extends Omit<StepProps, "handleNext"> {
  agreementChecked: boolean;
  setAgreementChecked: (checked: boolean) => void;
  downloadCampRules: () => void;
  handleSubmit: () => void;
}

export default function Step3({
  formData,
  handlePrev,
  handleSubmit,
  agreementChecked,
  setAgreementChecked,
  downloadCampRules,
  isLoading,
}: Step3Props) {
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

  return (
    <StepWrapper title="Pasul 3/3: Confirmare" isLoading={isLoading}>
      <div className="space-y-8">
        <div className="text-center mb-6">
          <Button
            onClick={downloadCampRules}
            variant="outline"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
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
                onCheckedChange={(checked) =>
                  setAgreementChecked(checked as boolean)
                }
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
