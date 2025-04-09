import { Metadata } from "next";
import ResetPasswordForm from "@/components/reset-password/ResetPasswordForm";
import AuthToAccountRedirect from "@/components/auth/AuthToAccountRedirect";

export const metadata: Metadata = {
  title: "Resetare Parolă | Hope Camp",
};

export default function ResetPasswordPage() {
  return (
    <AuthToAccountRedirect>
      <ResetPasswordForm />
    </AuthToAccountRedirect>
  );
}
