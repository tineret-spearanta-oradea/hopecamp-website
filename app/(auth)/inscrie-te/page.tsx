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

const BYPASS_CODE = "l3s63pa35";

function RegistrationContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const shouldShowForm = !IS_REGISTRATION_DISABLED || code === BYPASS_CODE;

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
