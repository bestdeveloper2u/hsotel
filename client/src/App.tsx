import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AuthProvider, useAuth } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import UsersPage from "@/pages/users";
import RolesPage from "@/pages/roles";
import MealsPage from "@/pages/meals";
import FeedbackPage from "@/pages/feedback";
import HostelsPage from "@/pages/hostels";
import CorporatePage from "@/pages/corporate";
import MembersPage from "@/pages/members";
import PaymentsPage from "@/pages/payments";
import SettingsPage from "@/pages/settings";

function ProtectedRoute({ component: Component }: { component: () => JSX.Element }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}

function Router() {
  const { user } = useAuth();

  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      {user ? (
        <>
          <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
          <Route path="/users" component={() => <ProtectedRoute component={UsersPage} />} />
          <Route path="/roles" component={() => <ProtectedRoute component={RolesPage} />} />
          <Route path="/hostels" component={() => <ProtectedRoute component={HostelsPage} />} />
          <Route path="/corporate" component={() => <ProtectedRoute component={CorporatePage} />} />
          <Route path="/members" component={() => <ProtectedRoute component={MembersPage} />} />
          <Route path="/meals" component={() => <ProtectedRoute component={MealsPage} />} />
          <Route path="/payments" component={() => <ProtectedRoute component={PaymentsPage} />} />
          <Route path="/feedback" component={() => <ProtectedRoute component={FeedbackPage} />} />
          <Route path="/settings" component={() => <ProtectedRoute component={SettingsPage} />} />
        </>
      ) : (
        <Route path="*" component={() => <Redirect to="/login" />} />
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { user } = useAuth();
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  if (!user) {
    return <Router />;
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Router />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
