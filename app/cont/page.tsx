import { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import AuthLayout from "@/components/layouts/AuthLayout";
import AccountPage from "@/components/account/AccountPage";

export const metadata: Metadata = {
  title: "Contul Meu | Hope Camp",
};

export default function ContPage() {
  return (
    <RequireAuth>
      <AuthLayout>
        <AccountPage />
      </AuthLayout>
    </RequireAuth>
  );
}
