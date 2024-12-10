import { Metadata } from "next";
import ResetPasswordForm from "@/components/reset-password/ResetPasswordForm";
import AuthRedirect from "@/components/auth/AuthRedirect";

export const metadata: Metadata = {
  title: "Resetare Parolă | Hope Camp",
};

export default function ResetPasswordPage() {
  return (
    <AuthRedirect>
      <ResetPasswordForm />
    </AuthRedirect>
  );
}
