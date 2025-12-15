import { Metadata } from "next";
import LoginForm from "@/components/login/LoginForm";

export const metadata: Metadata = {
  title: "Conectare | Hope Camp",
};

export default function LoginPage() {
  return (
    <LoginForm />
  );
}