import { Metadata } from "next";
import RegisterForm from "@/components/register/RegisterForm";
import AuthRedirect from "@/components/auth/AuthRedirect";
import AuthLayout from "@/components/layouts/AuthLayout";

export const metadata: Metadata = {
  title: "Înscrie-te | Hope Camp",
};

export default function RegistrationPage() {
  return (
    <AuthRedirect>
      <AuthLayout>
        <RegisterForm />
      </AuthLayout>
    </AuthRedirect>
  );
}
