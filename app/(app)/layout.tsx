import { AppLayout } from "@/components/app/AppLayout";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  return <AppLayout>{children}</AppLayout>;
}
