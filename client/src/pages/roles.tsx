import { useQuery, useMutation } from "@tanstack/react-query";
import { RolePermissionMatrix } from "@/components/role-permission-matrix";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function RolesPage() {
  const { toast } = useToast();

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ['/api/roles'],
    queryFn: () => apiRequest('/api/roles')
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ roleId, permissions }: { roleId: string; permissions: string[] }) =>
      apiRequest(`/api/roles/${roleId}`, {
        method: 'PUT',
        body: JSON.stringify({ permissions })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/roles'] });
      toast({
        title: "Success",
        description: "Role permissions updated"
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
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">Create and manage user roles and permissions</p>
        </div>
        <Button data-testid="button-create-role">
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>
      
      <RolePermissionMatrix 
        roles={roles}
        onUpdate={(roleId, permissions) => updateRoleMutation.mutate({ roleId, permissions })}
      />
    </div>
  );
}
