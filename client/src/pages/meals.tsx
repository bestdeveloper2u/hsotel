import { MealTracker } from "@/components/meal-tracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MealsPage() {
  const mockMembers = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Bob Johnson' },
    { id: '4', name: 'Alice Williams' },
    { id: '5', name: 'Charlie Brown' },
  ];

  const mockChartData = [
    { name: 'Mon', breakfast: 45, lunch: 52, dinner: 48 },
    { name: 'Tue', breakfast: 48, lunch: 50, dinner: 47 },
    { name: 'Wed', breakfast: 46, lunch: 53, dinner: 49 },
    { name: 'Thu', breakfast: 50, lunch: 51, dinner: 50 },
    { name: 'Fri', breakfast: 47, lunch: 49, dinner: 46 },
    { name: 'Sat', breakfast: 42, lunch: 45, dinner: 43 },
    { name: 'Sun', breakfast: 40, lunch: 43, dinner: 41 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meal Tracking</h1>
        <p className="text-muted-foreground">Record and track daily meals</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <MealTracker 
          members={mockMembers}
          onRecordMeal={(data) => console.log('Record meal:', data)}
        />

        <Card>
          <CardHeader>
            <CardTitle>Weekly Meal Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="breakfast" fill="hsl(var(--chart-1))" />
                <Bar dataKey="lunch" fill="hsl(var(--chart-2))" />
                <Bar dataKey="dinner" fill="hsl(var(--chart-3))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
