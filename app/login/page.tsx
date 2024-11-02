import { Metadata } from "next";
import LoginForm from "@/components/login/LoginForm";
import AuthRedirect from "@/components/auth/AuthRedirect";
import AuthLayout from "@/components/layouts/AuthLayout";

export const metadata: Metadata = {
  title: "Conectare | Hope Camp",
};

export default function LoginPage() {
  return (
    <AuthRedirect>
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </AuthRedirect>
  );
}
