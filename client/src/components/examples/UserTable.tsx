import { UserTable } from '../user-table';

export default function UserTableExample() {
  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Super Admin', entityType: 'Individual', status: 'Active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Hostel Owner', entityType: 'Hostel', status: 'Active' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Corporate Admin', entityType: 'Corporate', status: 'Inactive' },
  ];

  return (
    <div className="p-6">
      <UserTable 
        users={mockUsers}
        onEdit={(user) => console.log('Edit user:', user)}
        onDelete={(userId) => console.log('Delete user:', userId)}
      />
    </div>
  );
}
