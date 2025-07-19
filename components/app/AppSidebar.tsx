"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  BarChart,
  BookOpen,
  Settings,
  LogOut,
  User,
  ChevronRight,
  BanknoteArrowUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { logOut } from "@/lib/auth/auth.actions";

interface AppSidebarProps {
  name: string;
  email: string;
  image: string | null;
}

export function AppSidebar({ name, image, email }: AppSidebarProps) {
  const pathname = usePathname();

  const isActiveRoute = (route: string) => {
    if (route === "/dashboard") {
      return pathname === route;
    }
    return pathname.startsWith(route);
  };

  const { open } = useSidebar();

  const onClick = () => {
    logOut();
  };

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="flex items-center">
        {open ? (
          <Image
            src="/icons/logo-full.svg"
            alt="MockTalk"
            width={140}
            height={35}
            priority
          />
        ) : (
          <Image
            src="/icons/logo-icon.svg"
            alt="MockTalk"
            width={32}
            height={32}
            priority
          />
        )}
      </SidebarHeader>
      <Separator />

      <SidebarContent className="px-2 mt-10">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Dashboard"
              className={cn({
                "bg-primary/90 text-background px-2 py-1 rounded-lg hover:bg-primary/90 hover:text-background":
                  isActiveRoute("/dashboard"),
              })}
            >
              <Link href="/dashboard">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn({
                "bg-primary/90 text-background px-2 py-1 rounded-lg hover:bg-primary/90 hover:text-background":
                  isActiveRoute("/jobs"),
              })}
              tooltip="Jobs"
            >
              <Link href="/jobs">
                <Briefcase />
                <span>Jobs</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn({
                "bg-primary/90 text-background px-2 py-1 rounded-lg hover:bg-primary/90 hover:text-background":
                  isActiveRoute("/interviews"),
              })}
              tooltip="Interviews"
            >
              <Link href="/interviews">
                <MessageSquare />
                <span>Interviews</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn({
                "bg-primary/90 text-background px-2 py-1 rounded-lg hover:bg-primary/90 hover:text-background":
                  isActiveRoute("/analytics"),
              })}
              tooltip="Analytics"
            >
              <Link href="/analytics">
                <BarChart />
                <span>Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn({
                "bg-primary/90 text-background px-2 py-1 rounded-lg hover:bg-primary/90 hover:text-background":
                  isActiveRoute("/resources"),
              })}
              tooltip="Resources"
            >
              <Link href="/resources">
                <BookOpen />
                <span>Resources</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn({
                "bg-primary/90 text-background px-2 py-1 rounded-lg hover:bg-primary/90 hover:text-background":
                  isActiveRoute("/billing"),
              })}
              tooltip="Billing"
            >
              <Link href="/billing">
                <BanknoteArrowUp />
                <span>Billing</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel className="px-2">Account</SidebarGroupLabel>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "w-full text-left flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent",
                  !open && "justify-center"
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={image || undefined} alt={name || "user"} />
                  <AvatarFallback>{name?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col flex-1 overflow-hidden">
                  <span className="text-sm font-medium truncate">{name}</span>
                  <span className="text-xs text-muted-foreground truncate">
                    {email}
                  </span>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/profile"
                  className="cursor-pointer flex items-center"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/settings"
                  className="cursor-pointer flex items-center"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={onClick}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
