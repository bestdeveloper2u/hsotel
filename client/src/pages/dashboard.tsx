import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, Building, DollarSign, Plus, FileText } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { title: "Total Users", value: "1,234", icon: Users, trend: "12% from last month", trendUp: true },
    { title: "Active Hostels", value: "45", icon: Building2, trend: "5% from last month", trendUp: true },
    { title: "Corporate Offices", value: "28", icon: Building, trend: "8% from last month", trendUp: true },
    { title: "Monthly Revenue", value: "$12,450", icon: DollarSign, trend: "3% from last month", trendUp: false },
  ];

  const recentActivity = [
    { id: 1, user: "John Doe", action: "registered as Individual", time: "2 hours ago" },
    { id: 2, user: "Sunshine Hostel", action: "added 5 new members", time: "4 hours ago" },
    { id: 3, user: "Tech Corp", action: "made a payment of $500", time: "6 hours ago" },
    { id: 4, user: "Jane Smith", action: "submitted feedback", time: "8 hours ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
        </div>
        <Button data-testid="button-new-user">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
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
              View Reports
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3" data-testid={`activity-${activity.id}`}>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
