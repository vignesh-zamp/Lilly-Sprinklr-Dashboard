import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <DashboardHeader />
      <main className="flex-1 overflow-x-auto">
        {children}
      </main>
    </div>
  );
}
