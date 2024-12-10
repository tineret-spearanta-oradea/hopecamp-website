import { Metadata } from "next";
import LoginForm from "@/components/login/LoginForm";
import AuthRedirect from "@/components/auth/AuthRedirect";

export const metadata: Metadata = {
  title: "Conectare | Hope Camp",
};

export default function LoginPage() {
  return (
    <AuthRedirect>
      <LoginForm />
    </AuthRedirect>
  );
}
