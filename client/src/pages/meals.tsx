import { useQuery, useMutation } from "@tanstack/react-query";
import { MealTracker } from "@/components/meal-tracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiRequest } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function MealsPage() {
  const { toast } = useToast();

  const { data: members = [] } = useQuery({
    queryKey: ['/api/members'],
    queryFn: () => apiRequest('/api/members')
  });

  const { data: meals = [] } = useQuery({
    queryKey: ['/api/meals'],
    queryFn: () => apiRequest('/api/meals')
  });

  const recordMealMutation = useMutation({
    mutationFn: (data: { memberId: string; mealType: string; date: Date }) =>
      apiRequest('/api/meals', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meals'] });
      toast({
        title: "Success",
        description: "Meal recorded successfully"
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
          members={members}
          onRecordMeal={(data) => recordMealMutation.mutate(data)}
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
