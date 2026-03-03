import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex"
      style={{ height: "calc(100vh - var(--tab-bar-height))" }}
    >
      {/* Desktop sidebar — hidden on mobile, shown at md+ */}
      <AppSidebar />

      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <AppHeader />
        {/* Pages manage their own padding via p-4 / page-container class */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
