import { AuthProvider } from "@/contexts/auth-context";
import { AdminNav } from "@/components/admin/nav";
import { Sidebar } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <AdminNav />
        </Sidebar>
        <main className="flex-1 overflow-y-auto relative">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </AuthProvider>
  );
}
