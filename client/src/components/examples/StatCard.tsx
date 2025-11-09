import { StatCard } from '../stat-card';
import { Users } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard title="Total Users" value="1,234" icon={Users} trend="12% from last month" trendUp={true} />
      <StatCard title="Active Hostels" value="45" icon={Users} trend="5% from last month" trendUp={true} />
      <StatCard title="Monthly Revenue" value="$12,450" icon={Users} trend="3% from last month" trendUp={false} />
    </div>
  );
}
