import { Home, Users, Shield, Building2, Building, UserCircle, Utensils, CreditCard, MessageSquare, Settings, LogOut, DollarSign } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";

interface MenuItem {
  title: string;
  url: string;
  icon: any;
  requiredPermissions: string[];
}

const menuItems: MenuItem[] = [
  { title: "Dashboard", url: "/", icon: Home, requiredPermissions: [] },
  { title: "Users", url: "/users", icon: Users, requiredPermissions: ['Manage Users'] },
  { title: "Roles", url: "/roles", icon: Shield, requiredPermissions: ['Manage Roles'] },
  { title: "Hostels", url: "/hostels", icon: Building2, requiredPermissions: ['Manage Hostels', 'View All Data'] },
  { title: "Corporate Offices", url: "/corporate", icon: Building, requiredPermissions: ['Manage Corporate Offices', 'View All Data'] },
  { title: "Members", url: "/members", icon: UserCircle, requiredPermissions: ['Manage Members', 'View All Data'] },
  { title: "Meal Tracking", url: "/meals", icon: Utensils, requiredPermissions: ['Manage Members', 'View Own Meals', 'View All Data'] },
  { title: "Meal Prices", url: "/meal-prices", icon: DollarSign, requiredPermissions: ['Manage Payments', 'View Reports', 'View Own Costs', 'View All Data'] },
  { title: "Payments", url: "/payments", icon: CreditCard, requiredPermissions: ['Manage Payments', 'View Own Costs', 'View All Data'] },
  { title: "Feedback", url: "/feedback", icon: MessageSquare, requiredPermissions: ['Manage Feedback', 'View Reports', 'View All Data'] },
  { title: "Settings", url: "/settings", icon: Settings, requiredPermissions: [] },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const hasPermission = (requiredPermissions: string[]) => {
    if (requiredPermissions.length === 0) return true;
    if (user?.isSuperAdmin) return true;
    if (!user?.role?.permissions) return false;
    return requiredPermissions.some(permission => 
      user.role!.permissions.includes(permission)
    );
  };

  const visibleMenuItems = menuItems.filter(item => hasPermission(item.requiredPermissions));

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border">
          <h2 className="text-xl font-bold text-sidebar-foreground">Hostel Manager</h2>
          <p className="text-sm text-muted-foreground">Management System</p>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} data-testid={`link-${item.title.toLowerCase().replace(/ /g, '-')}`}>
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location === "/settings"} data-testid="link-settings">
              <Link href="/settings">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} data-testid="button-logout">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
