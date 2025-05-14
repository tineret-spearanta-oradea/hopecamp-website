"use client";

import RegisterForm from "@/components/register/RegisterForm";
import FullyBooked from "@/components/register/FullyBooked";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AuthToAccountRedirect from "@/components/auth/AuthToAccountRedirect";

// This would typically come from your environment variables or a database
const IS_REGISTRATION_DISABLED =
  process.env.NEXT_PUBLIC_IS_REGISTRATION_DISABLED === undefined
    ? false
    : process.env.NEXT_PUBLIC_IS_REGISTRATION_DISABLED === "true";

const BYPASS_MODE = "temp";

function RegistrationContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const shouldShowForm = !IS_REGISTRATION_DISABLED || mode === BYPASS_MODE;

  return <>{shouldShowForm ? <RegisterForm /> : <FullyBooked />}</>;
}

export default function RegistrationPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AuthToAccountRedirect>
        <RegistrationContent />
      </AuthToAccountRedirect>
    </Suspense>
  );
}
