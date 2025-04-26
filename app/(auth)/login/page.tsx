import { Metadata } from "next";
import LoginForm from "@/components/login/LoginForm";
import AuthToAccountRedirect from "@/components/auth/AuthToAccountRedirect";

export const metadata: Metadata = {
  title: "Conectare | Hope Camp",
};

export default function LoginPage() {
  return (
    <AuthToAccountRedirect>
      <LoginForm />
    </AuthToAccountRedirect>
  );
}
