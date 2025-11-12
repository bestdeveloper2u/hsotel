import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, User, Bell, Shield, Database } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card data-testid="card-account-settings">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Settings
            </CardTitle>
            <CardDescription>
              Manage your account information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" data-testid="button-edit-profile">
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        <Card data-testid="card-notifications">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" data-testid="button-notification-settings">
              Manage Notifications
            </Button>
          </CardContent>
        </Card>

        <Card data-testid="card-security">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security
            </CardTitle>
            <CardDescription>
              Update your password and security settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" data-testid="button-change-password">
              Change Password
            </Button>
          </CardContent>
        </Card>

        <Card data-testid="card-system">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              System Settings
            </CardTitle>
            <CardDescription>
              Configure system-wide preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" data-testid="button-system-settings">
              System Preferences
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
