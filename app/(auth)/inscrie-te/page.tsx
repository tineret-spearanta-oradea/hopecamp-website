import { Metadata } from "next";
import RegisterForm from "@/components/register/RegisterForm";
import AuthRedirect from "@/components/auth/AuthRedirect";

export const metadata: Metadata = {
  title: "Înscrie-te | Hope Camp",
};

export default function RegistrationPage() {
  return (
    <AuthRedirect>
      <RegisterForm />
    </AuthRedirect>
  );
}
