import { RolePermissionMatrix } from '../role-permission-matrix';

export default function RolePermissionMatrixExample() {
  const mockRoles = [
    { id: '1', name: 'Super Admin', permissions: ['Manage Users', 'Manage Roles', 'Manage Hostels', 'Manage Members', 'View Reports', 'Manage Payments', 'Manage Feedback'] },
    { id: '2', name: 'Hostel Owner', permissions: ['Manage Members', 'View Reports', 'Manage Payments'] },
    { id: '3', name: 'Corporate Admin', permissions: ['Manage Members', 'View Reports'] },
  ];

  return (
    <div className="p-6">
      <RolePermissionMatrix 
        roles={mockRoles}
        onUpdate={(roleId, permissions) => console.log('Update role:', roleId, permissions)}
      />
    </div>
  );
}
