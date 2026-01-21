import DashboardLayout from "@/components/layout/DashboardLayout";
import { PedidosRecentesProvider } from "@/contexts/PedidosRecentesContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PedidosRecentesProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </PedidosRecentesProvider>
  );
}
