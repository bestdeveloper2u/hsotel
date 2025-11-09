import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const permissions = [
  "Manage Users",
  "Manage Roles",
  "Manage Hostels",
  "Manage Members",
  "View Reports",
  "Manage Payments",
  "Manage Feedback",
];

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

interface RolePermissionMatrixProps {
  roles: Role[];
  onUpdate?: (roleId: string, permissions: string[]) => void;
}

export function RolePermissionMatrix({ roles, onUpdate }: RolePermissionMatrixProps) {
  const [localRoles, setLocalRoles] = useState(roles);

  const togglePermission = (roleId: string, permission: string) => {
    setLocalRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.includes(permission);
        const newPermissions = hasPermission
          ? role.permissions.filter(p => p !== permission)
          : [...role.permissions, permission];
        onUpdate?.(roleId, newPermissions);
        return { ...role, permissions: newPermissions };
      }
      return role;
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Permission Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                {permissions.map((permission) => (
                  <TableHead key={permission} className="text-center">
                    {permission}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {localRoles.map((role) => (
                <TableRow key={role.id} data-testid={`row-role-${role.id}`}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  {permissions.map((permission) => (
                    <TableCell key={permission} className="text-center">
                      <Checkbox
                        checked={role.permissions.includes(permission)}
                        onCheckedChange={() => togglePermission(role.id, permission)}
                        data-testid={`checkbox-${role.id}-${permission.toLowerCase().replace(/\s+/g, '-')}`}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
