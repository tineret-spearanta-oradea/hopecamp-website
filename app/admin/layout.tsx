import AdminProtected from "@/components/auth/AdminProtected";
import { Sidebar } from "@/components/ui/sidebar";
import { AdminNav } from "@/components/admin/nav";
import { AuthProvider } from "@/contexts/auth-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminProtected>
        <div className="flex h-screen">
          <Sidebar>
            <AdminNav />
          </Sidebar>
          <main className="flex-1 overflow-y-auto p-8">{children}</main>
        </div>
      </AdminProtected>
    </AuthProvider>
  );
}
