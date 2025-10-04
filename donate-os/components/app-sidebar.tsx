"use client";

import {
  Calendar,
  Home,
  Inbox,
  PowerOffIcon,
  Search,
  Settings,
  User2Icon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "MyDonations",
    url: "/DonationStatus",
    icon: Inbox,
  },
  {
    title: "Donate",
    url: "/Donate",
    icon: Calendar,
  },
];

export function AppSidebar() {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout(); // This now handles all cleanup automatically
    router.push("/Auth/Signin");
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold text-lg mb-10">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem className="my-2" key={item.title}>
                  <SidebarMenuButton className="w-full px-2" asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span className="font-medium text-md">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {isLoggedIn && (
                <SidebarMenuItem className="my-2">
                  <SidebarMenuButton className="w-full px-2" asChild>
                    <button onClick={handleLogout}>
                      <PowerOffIcon />
                      <span className="font-medium text-md">{"Logout"}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {isAdmin && (
                <SidebarMenuItem className="my-2">
                  <SidebarMenuButton className="w-full px-2" asChild>
                    <button
                      onClick={() => {
                        router.push("/Admin/Donations");
                      }}
                    >
                      <User2Icon />
                      <span className="font-medium text-md">{"Admin"}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
