import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, Building, DollarSign, Plus, FileText, Utensils } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { user } = useAuth();
  
  const isSuperAdmin = user?.isSuperAdmin || false;
  const hasManageHostels = (user?.role?.permissions?.includes('Manage Hostels') ?? false) || isSuperAdmin;
  const hasManageCorporate = (user?.role?.permissions?.includes('Manage Corporate Offices') ?? false) || isSuperAdmin;
  const hasManageMembers = (user?.role?.permissions?.includes('Manage Members') ?? false) || isSuperAdmin;
  const hasManagePayments = (user?.role?.permissions?.includes('Manage Payments') ?? false) || isSuperAdmin;
  const canViewMeals = (user?.role?.permissions?.includes('View Own Meals') ?? false) || (user?.role?.permissions?.includes('Manage Members') ?? false) || isSuperAdmin;
  const canViewCosts = (user?.role?.permissions?.includes('View Own Costs') ?? false) || (user?.role?.permissions?.includes('Manage Payments') ?? false) || isSuperAdmin;
  
  const { data: users = [] } = useQuery({
    queryKey: ['/api/users'],
    queryFn: () => apiRequest('/api/users'),
    enabled: !!isSuperAdmin
  });

  const { data: hostels = [] } = useQuery({
    queryKey: ['/api/hostels'],
    queryFn: () => apiRequest('/api/hostels'),
    enabled: !!hasManageHostels
  });

  const { data: corporateOffices = [] } = useQuery({
    queryKey: ['/api/corporate-offices'],
    queryFn: () => apiRequest('/api/corporate-offices'),
    enabled: !!hasManageCorporate
  });

  const { data: members = [] } = useQuery({
    queryKey: ['/api/members'],
    queryFn: () => apiRequest('/api/members'),
    enabled: !!hasManageMembers
  });

  const { data: meals = [] } = useQuery({
    queryKey: ['/api/meals'],
    queryFn: () => apiRequest('/api/meals'),
    enabled: !!canViewMeals
  });

  const { data: payments = [] } = useQuery({
    queryKey: ['/api/payments'],
    queryFn: () => apiRequest('/api/payments'),
    enabled: !!canViewCosts
  });

  const totalRevenue = payments.reduce((sum: number, p: any) => sum + parseFloat(p.amount || 0), 0);

  const isHostelAdmin = user?.role?.name === 'Hostel Admin';
  const isCorporateAdmin = user?.role?.name === 'Corporate Admin';
  const isIndividualMember = user?.role?.name === 'Individual Member';

  const renderSuperAdminDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-dashboard">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">Complete system overview</p>
        </div>
        <Badge variant="default" className="bg-primary" data-testid="badge-role">Super Admin</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={users.length.toString()} icon={Users} />
        <StatCard title="Active Hostels" value={hostels.length.toString()} icon={Building2} />
        <StatCard title="Corporate Offices" value={corporateOffices.length.toString()} icon={Building} />
        <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={DollarSign} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage the entire system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" data-testid="button-create-role">
              <Plus className="h-4 w-4 mr-2" />
              Create New Role
            </Button>
            <Button variant="outline" className="w-full justify-start" data-testid="button-add-hostel">
              <Building2 className="h-4 w-4 mr-2" />
              Add Hostel
            </Button>
            <Button variant="outline" className="w-full justify-start" data-testid="button-view-reports">
              <FileText className="h-4 w-4 mr-2" />
              View All Reports
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Statistics</CardTitle>
            <CardDescription>Real-time metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between" data-testid="stat-members">
              <span className="text-sm text-muted-foreground">Total Members</span>
              <span className="font-semibold">{members.length}</span>
            </div>
            <div className="flex justify-between" data-testid="stat-meals">
              <span className="text-sm text-muted-foreground">Total Meals Recorded</span>
              <span className="font-semibold">{meals.length}</span>
            </div>
            <div className="flex justify-between" data-testid="stat-payments">
              <span className="text-sm text-muted-foreground">Total Payments</span>
              <span className="font-semibold">{payments.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderHostelAdminDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-dashboard">Hostel Dashboard</h1>
          <p className="text-muted-foreground">Manage your hostel</p>
        </div>
        <Badge variant="secondary" data-testid="badge-role">Hostel Admin</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Your Hostel" value={hostels.length > 0 ? hostels[0].name : 'N/A'} icon={Building2} />
        <StatCard title="Members" value={members.length.toString()} icon={Users} />
        <StatCard title="Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={DollarSign} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your hostel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" data-testid="button-add-member">
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
            <Button variant="outline" className="w-full justify-start" data-testid="button-record-meal">
              <Utensils className="h-4 w-4 mr-2" />
              Record Meals
            </Button>
            <Button variant="outline" className="w-full justify-start" data-testid="button-view-payments">
              <DollarSign className="h-4 w-4 mr-2" />
              View Payments
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hostel Statistics</CardTitle>
            <CardDescription>Your hostel metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between" data-testid="stat-members">
              <span className="text-sm text-muted-foreground">Total Members</span>
              <span className="font-semibold">{members.length}</span>
            </div>
            <div className="flex justify-between" data-testid="stat-meals">
              <span className="text-sm text-muted-foreground">Meals This Month</span>
              <span className="font-semibold">{meals.length}</span>
            </div>
            <div className="flex justify-between" data-testid="stat-hostel-info">
              <span className="text-sm text-muted-foreground">Capacity</span>
              <span className="font-semibold">{hostels.length > 0 ? hostels[0].capacity : 'N/A'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCorporateAdminDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-dashboard">Corporate Dashboard</h1>
          <p className="text-muted-foreground">Manage your corporate office</p>
        </div>
        <Badge variant="secondary" data-testid="badge-role">Corporate Admin</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard title="Your Office" value={corporateOffices.length > 0 ? corporateOffices[0].name : 'N/A'} icon={Building} />
        <StatCard title="Employees" value={members.length.toString()} icon={Users} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your office</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" data-testid="button-add-employee">
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
            <Button variant="outline" className="w-full justify-start" data-testid="button-view-reports">
              <FileText className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Office Statistics</CardTitle>
            <CardDescription>Your office metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between" data-testid="stat-employees">
              <span className="text-sm text-muted-foreground">Total Employees</span>
              <span className="font-semibold">{members.length}</span>
            </div>
            <div className="flex justify-between" data-testid="stat-meals">
              <span className="text-sm text-muted-foreground">Meals This Month</span>
              <span className="font-semibold">{meals.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderIndividualMemberDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-dashboard">My Dashboard</h1>
          <p className="text-muted-foreground">View your meal records and costs</p>
        </div>
        <Badge variant="outline" data-testid="badge-role">Member</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard title="My Meals This Month" value={meals.length.toString()} icon={Utensils} />
        <StatCard title="My Costs" value={`$${totalRevenue.toFixed(2)}`} icon={DollarSign} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Meal Records</CardTitle>
          <CardDescription>Your recent meal activity</CardDescription>
        </CardHeader>
        <CardContent>
          {meals.length > 0 ? (
            <div className="space-y-2">
              {meals.slice(0, 5).map((meal: any, index: number) => (
                <div key={index} className="flex justify-between items-center border-b pb-2" data-testid={`meal-record-${index}`}>
                  <span className="text-sm">{meal.mealType}</span>
                  <span className="text-xs text-muted-foreground">{new Date(meal.date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No meal records found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  if (isSuperAdmin) return renderSuperAdminDashboard();
  if (isHostelAdmin) return renderHostelAdminDashboard();
  if (isCorporateAdmin) return renderCorporateAdminDashboard();
  if (isIndividualMember) return renderIndividualMemberDashboard();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold" data-testid="heading-dashboard">Welcome</h1>
      <p className="text-muted-foreground">Loading your dashboard...</p>
    </div>
  );
}
