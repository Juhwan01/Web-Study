import { Sidebar } from "@/components/layouts/sidebar";
import { ToastProvider } from "@/app/providers/toast-provider";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <>
      <ToastProvider />
      <div className="h-full relative">
        <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-50">
          <Sidebar />
        </div>
        <main className="md:pl-72 min-h-screen bg-slate-100">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
