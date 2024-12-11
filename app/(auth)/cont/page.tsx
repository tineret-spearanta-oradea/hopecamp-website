import { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import AccountPage from "@/components/account/AccountPage";

export const metadata: Metadata = {
  title: "Contul Meu | Hope Camp",
};

export default function ContPage() {
  return (
    <RequireAuth>
      <AccountPage />
    </RequireAuth>
  );
}
