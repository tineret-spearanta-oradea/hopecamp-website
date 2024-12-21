"use client";

import { Metadata } from "next";
import RegisterForm from "@/components/register/RegisterForm";
import AuthRedirect from "@/components/auth/AuthRedirect";
import FullyBooked from "@/components/register/FullyBooked";
import { useSearchParams } from "next/navigation";

// This would typically come from your environment variables or a database
const IS_REGISTRATION_DISABLED = false;
const BYPASS_MODE = "temp";

export default function RegistrationPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const shouldShowForm = !IS_REGISTRATION_DISABLED || mode === BYPASS_MODE;

  return (
    <AuthRedirect>
      {shouldShowForm ? <RegisterForm /> : <FullyBooked />}
    </AuthRedirect>
  );
}
