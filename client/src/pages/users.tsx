import { UserTable } from "@/components/user-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function UsersPage() {
  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Super Admin', entityType: 'Individual', status: 'Active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Hostel Owner', entityType: 'Hostel', status: 'Active' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Corporate Admin', entityType: 'Corporate', status: 'Active' },
    { id: '4', name: 'Alice Williams', email: 'alice@example.com', role: 'Member', entityType: 'Individual', status: 'Active' },
    { id: '5', name: 'Charlie Brown', email: 'charlie@example.com', role: 'Member', entityType: 'Hostel', status: 'Inactive' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage all users in the system</p>
        </div>
        <Button data-testid="button-add-user">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>
      
      <UserTable 
        users={mockUsers}
        onEdit={(user) => console.log('Edit user:', user)}
        onDelete={(userId) => console.log('Delete user:', userId)}
      />
    </div>
  );
}
