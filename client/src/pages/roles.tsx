import { RolePermissionMatrix } from "@/components/role-permission-matrix";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function RolesPage() {
  const mockRoles = [
    { id: '1', name: 'Super Admin', permissions: ['Manage Users', 'Manage Roles', 'Manage Hostels', 'Manage Members', 'View Reports', 'Manage Payments', 'Manage Feedback'] },
    { id: '2', name: 'Hostel Owner', permissions: ['Manage Members', 'View Reports', 'Manage Payments'] },
    { id: '3', name: 'Corporate Admin', permissions: ['Manage Members', 'View Reports'] },
    { id: '4', name: 'Member', permissions: ['View Reports'] },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">Create and manage user roles and permissions</p>
        </div>
        <Button data-testid="button-create-role">
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>
      
      <RolePermissionMatrix 
        roles={mockRoles}
        onUpdate={(roleId, permissions) => console.log('Update role:', roleId, permissions)}
      />
    </div>
  );
}
