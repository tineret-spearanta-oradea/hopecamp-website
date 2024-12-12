import { StepProps } from "@/types/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Link from "next/link";
import { StepWrapper } from "./StepWrapper";
import { title } from "@/lib/constants";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Step1({
  formData,
  handleChange,
  handleNext,
  validationErrors,
  isLoading,
}: StepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    objectName: keyof typeof formData
  ) => {
    handleChange(objectName, e.target);
  };

  return (
    <StepWrapper title="Pasul 1/3: Autentificare" isLoading={isLoading}>
      <div className="space-y-8">
        <div className="space-y-4 text-center">
          <p className="text-base">
            {title} este o tabără creștină de tineret, organizată de Tineret
            Speranța Oradea. Mai multe găsiți în{" "}
            <Link
              href="/"
              className="hover:underline font-bold text-hope-lightcyan"
            >
              pagina principală
            </Link>
            .
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Chiar dacă ai mai fost cu noi în tabără în anii trecuți, trebuie să
            îți faci cont nou.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.authData.email}
              onChange={(e) => handleInputChange(e, "authData")}
              className={validationErrors.email ? "border-destructive" : ""}
            />
            {validationErrors.email && (
              <p className="text-destructive text-xs">
                {validationErrors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Parola"
                name="password"
                value={formData.authData.password}
                onChange={(e) => handleInputChange(e, "authData")}
                className={
                  validationErrors.password ? "border-destructive" : ""
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-destructive text-xs">
                {validationErrors.password}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirma parola"
                name="confirmPassword"
                value={formData.authData.confirmPassword}
                onChange={(e) => handleInputChange(e, "authData")}
                className={
                  validationErrors.confirmPassword ? "border-destructive" : ""
                }
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="text-destructive text-xs">
                {validationErrors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleNext} disabled={isLoading}>
            {isLoading ? "Se procesează..." : "Continuă →"}
          </Button>
        </div>

        <div className="text-center text-sm flex flex-col items-center">
          <p>Te-ai înscris deja in {title}? </p>
          <Link
            href="/cont"
            className="hover:underline font-bold text-hope-lightcyan"
          >
            Du-te la contul tău.
          </Link>
          <p className="text-xs text-muted-foreground mt-2">
            * Emailul si parola vor fi folosite pentru a te conecta la platforma
            noastră. Acestea sunt necesare pentru înscriere.
          </p>
        </div>
      </div>
    </StepWrapper>
  );
}
