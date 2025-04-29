import { AppSidebar } from "@/components/app/AppSidebar";
import { SidebarProvider } from "../ui/sidebar";
import { currentUser } from "@/lib/auth/server/auth";

interface AppLayoutProps {
  children: React.ReactNode;
}

export async function AppLayout({ children }: AppLayoutProps) {
  const user = await currentUser();
  return (
    <SidebarProvider>
      <div className="w-full">
        <div className="flex min-h-screen">
          <AppSidebar
            name={user!.name as string}
            image={user?.image as string | null}
            email={user!.email as string}
          />
          <main className="flex-1 overflow-y-auto p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
