import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-background">
      <DashboardHeader />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
