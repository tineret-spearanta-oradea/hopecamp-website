import { StepProps } from "@/types/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Link from "next/link";
import { StepWrapper } from "./StepWrapper";

export default function Step1({
  formData,
  handleChange,
  handleNext,
  validationErrors,
  isLoading,
}: StepProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    objectName: keyof typeof formData
  ) => {
    handleChange(objectName, e.target);
  };

  return (
    <StepWrapper title="Pasul 1/3: Autentificare" isLoading={isLoading}>
      <div className="mb-4 text-center text-sm">
        <p>
          Hope Camp #5 este o tabără creștină de tineret, organizată de Tineret
          Speranța Oradea. Mai multe detalii despre noi și tabără găsiți în{" "}
          <Link
            href="/"
            className="hover:underline font-bold text-hope-lightcyan"
          >
            pagina principală
          </Link>
          .
        </p>
        <p className="mt-2 italic text-xs">
          Chiar dacă ai mai fost cu noi în tabără în anii trecuți, trebuie să
          îți faci cont nou.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.authData.email}
            onChange={(e) => handleInputChange(e, "authData")}
            className={validationErrors.email ? "border-destructive" : ""}
          />
          {validationErrors.email && (
            <p className="text-destructive text-xs mt-1">
              {validationErrors.email}
            </p>
          )}
        </div>

        <div>
          <Input
            type="password"
            placeholder="Parola"
            name="password"
            value={formData.authData.password}
            onChange={(e) => handleInputChange(e, "authData")}
            className={validationErrors.password ? "border-destructive" : ""}
          />
          {validationErrors.password && (
            <p className="text-destructive text-xs mt-1">
              {validationErrors.password}
            </p>
          )}
        </div>

        <div>
          <Input
            type="password"
            placeholder="Confirma parola"
            name="confirmPassword"
            value={formData.authData.confirmPassword}
            onChange={(e) => handleInputChange(e, "authData")}
            className={
              validationErrors.confirmPassword ? "border-destructive" : ""
            }
          />
          {validationErrors.confirmPassword && (
            <p className="text-destructive text-xs mt-1">
              {validationErrors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleNext}
          className="text-white bg-hope-darkcyan"
          disabled={isLoading}
        >
          {isLoading ? "Se procesează..." : "Continuă →"}
        </Button>
      </div>

      <div className="mt-6 text-center text-sm">
        <p>
          Te-ai înscris deja?{" "}
          <Link
            href="/cont"
            className="hover:underline font-bold text-hope-lightcyan"
          >
            Du-te la contul tău.
          </Link>
        </p>
        <p className="text-xs text-hope-lightcyan mt-4">
          * Emailul si parola vor fi folosite pentru a te conecta la platforma
          noastră. Acestea sunt necesare pentru înscriere.
        </p>
      </div>
    </StepWrapper>
  );
}
