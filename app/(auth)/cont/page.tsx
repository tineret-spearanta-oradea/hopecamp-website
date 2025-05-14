import { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import AccountPage from "@/components/account/AccountPage";
import { title } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Contul Meu | ${title}`,
};

export default function ContPage() {
  return (
    <RequireAuth>
      <AccountPage />
    </RequireAuth>
  );
}
