import { useQuery, useMutation } from "@tanstack/react-query";
import { UserTable } from "@/components/user-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  roleId: string | null;
  entityType: string;
  status: string;
}

export default function UsersPage() {
  const { toast } = useToast();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const data = await apiRequest('/api/users');
      return data.map((u: any) => ({
        ...u,
        role: u.roleId || 'No Role',
        status: 'Active'
      }));
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => apiRequest(`/api/users/${userId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "Success",
        description: "User deleted successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
        users={users}
        onEdit={(user) => console.log('Edit user:', user)}
        onDelete={(userId) => deleteMutation.mutate(userId)}
      />
    </div>
  );
}
