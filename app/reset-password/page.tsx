import { Metadata } from "next";
import ResetPasswordForm from "@/components/reset-password/ResetPasswordForm";
import AuthRedirect from "@/components/auth/AuthRedirect";
import AuthLayout from "@/components/layouts/AuthLayout";

export const metadata: Metadata = {
  title: "Resetare Parolă | Hope Camp",
};

export default function ResetPasswordPage() {
  return (
    <AuthRedirect>
      <AuthLayout>
        <ResetPasswordForm />
      </AuthLayout>
    </AuthRedirect>
  );
}
