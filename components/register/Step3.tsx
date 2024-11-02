import { FormData, Step3Props } from "@/types/form";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { format } from "date-fns";
import { sumToPay, dateRange } from "@/lib/constants";
import { Download } from "lucide-react";

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

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/assets/Regulament_HopeCamp.pdf";
    link.download = "Regulament_HopeCamp.pdf";
    link.click();
  };

  return (
    <div>
      <h2 className="text-xl font-black text-center mb-4">
        Pasul 3/3: Confirmare
      </h2>

      <div className="text-center mb-6">
        <Button
          onClick={handleDownload}
          variant="outline"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
          <Download className="mr-2 h-4 w-4" />
          DESCARCĂ REGULAMENT
        </Button>
      </div>

      <div className="space-y-4 text-sm">
        <p>
          - Am citit si sunt de acord cu <strong>regulamentul</strong> taberei.
        </p>

        {isFullTime ? (
          <>
            <p>
              - Taxa de înscriere pentru persoanele care vin full-time este de{" "}
              <strong>{sumToPay.normal} RON</strong> (cazare + mâncare). Pentru
              persoanele care au <strong>membru de familie</strong> (frați,
              surori, soț, soție) în tabără taxa este de{" "}
              <strong>{sumToPay.withFamilyMember} RON</strong>.
            </p>
            <p>
              - Voi plăti avansul de {sumToPay.deposit} RON până la data de{" "}
              <strong>
                {format(dateRange.depositPaymentDueDate, "dd MMM yyyy")}
              </strong>
              .
            </p>
          </>
        ) : (
          <p>
            - Taxa de înscriere pentru persoanele care NU vin full-time este de{" "}
            {sumToPay.perDay} lei/zi (cazare + mâncare). Totalul tău este de{" "}
            <strong>{sumToPay.perDay * numberOfDaysSelected} RON</strong>{" "}
            (pentru {numberOfDaysSelected} zile).
          </p>
        )}

        {parseInt(formData.userData.age) < 18 && (
          <p className="text-hope-orange">
            - Deoarece ai <strong>sub 18 ani</strong>, trebuie să descarci
            regulamentul, și să îl semnezi tu și părintele tău (tutorele legal)
            și să îl aduci în tabără împreuna cu copia buletinului tău.
          </p>
        )}

        <div className="flex items-start space-x-2 pt-2">
          <Checkbox
            id="agreement"
            checked={agreementChecked}
            onCheckedChange={(checked) =>
              setAgreementChecked(checked as boolean)
            }
          />
          <label
            htmlFor="agreement"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Am citit si sunt de acord cu cele de mai sus.
          </label>
        </div>

        {!agreementChecked && (
          <p className="text-destructive text-xs italic text-center">
            Trebuie sa fii de-acord cu regulamentul taberei
          </p>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <Button onClick={handlePrev} variant="outline">
          ← Înapoi
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!agreementChecked || isLoading}
          className="text-white bg-hope-darkcyan"
        >
          {isLoading ? "Se procesează..." : "Înscrie-te ↗"}
        </Button>
      </div>
    </div>
  );
}
