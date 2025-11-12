import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Clock, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { MealPrice } from "@shared/schema";

export default function MealPricesPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    breakfastPrice: "0.00",
    lunchPrice: "0.00",
    dinnerPrice: "0.00"
  });
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  const { data: mealPrice, isLoading } = useQuery<MealPrice | null>({
    queryKey: ['/api/meal-prices'],
  });

  useEffect(() => {
    if (mealPrice) {
      setFormData({
        breakfastPrice: mealPrice.breakfastPrice || "0.00",
        lunchPrice: mealPrice.lunchPrice || "0.00",
        dinnerPrice: mealPrice.dinnerPrice || "0.00"
      });

      // Calculate remaining edit time
      const sixHoursInMs = 6 * 60 * 60 * 1000;
      const lastUpdateTime = mealPrice.updatedAt 
        ? new Date(mealPrice.updatedAt).valueOf() 
        : new Date(mealPrice.createdAt!).valueOf();
      const timeSinceUpdate = Date.now() - lastUpdateTime;
      const remaining = sixHoursInMs - timeSinceUpdate;
      setRemainingTime(remaining > 0 ? remaining : 0);
    }
  }, [mealPrice]);

  useEffect(() => {
    if (remainingTime !== null && remainingTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime(prev => {
          if (prev === null || prev <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [remainingTime]);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('POST', '/api/meal-prices', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meal-prices'] });
      toast({ title: "Success", description: "Meal prices created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest('PUT', `/api/meal-prices/${mealPrice?.id}`, data);
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/meal-prices'] });
      toast({ title: "Success", description: "Meal prices updated successfully" });
      if (data.remainingEditTime) {
        setRemainingTime(data.remainingEditTime);
      }
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      breakfastPrice: formData.breakfastPrice,
      lunchPrice: formData.lunchPrice,
      dinnerPrice: formData.dinnerPrice,
      effectiveDate: new Date().toISOString()
    };

    if (mealPrice) {
      if (remainingTime === 0) {
        toast({
          title: "Error",
          description: "Cannot edit meal prices more than 6 hours after last update",
          variant: "destructive"
        });
        return;
      }
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading meal prices...</div>
      </div>
    );
  }

  const canEdit = remainingTime === null || remainingTime > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meal Prices</h1>
        <p className="text-muted-foreground">Manage meal pricing for your organization</p>
      </div>

      {mealPrice && remainingTime !== null && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Edit Window
            </CardTitle>
            <CardDescription>
              {canEdit 
                ? `You have ${formatTime(remainingTime)} remaining to edit meal prices`
                : "Edit window has expired. Meal prices cannot be modified after 6 hours."}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Current Meal Prices</CardTitle>
          <CardDescription>
            Set prices for breakfast, lunch, and dinner
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="breakfastPrice">Breakfast Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="breakfastPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.breakfastPrice}
                    onChange={(e) => setFormData({ ...formData, breakfastPrice: e.target.value })}
                    className="pl-9"
                    disabled={!canEdit}
                    data-testid="input-breakfast-price"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lunchPrice">Lunch Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lunchPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.lunchPrice}
                    onChange={(e) => setFormData({ ...formData, lunchPrice: e.target.value })}
                    className="pl-9"
                    disabled={!canEdit}
                    data-testid="input-lunch-price"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dinnerPrice">Dinner Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dinnerPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.dinnerPrice}
                    onChange={(e) => setFormData({ ...formData, dinnerPrice: e.target.value })}
                    className="pl-9"
                    disabled={!canEdit}
                    data-testid="input-dinner-price"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={!canEdit || createMutation.isPending || updateMutation.isPending}
                data-testid="button-save-prices"
              >
                <Save className="w-4 h-4 mr-2" />
                {(createMutation.isPending || updateMutation.isPending) ? 'Saving...' : 'Save Prices'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {mealPrice && (
        <Card>
          <CardHeader>
            <CardTitle>Price History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{mealPrice.updatedAt ? new Date(mealPrice.updatedAt).toLocaleString() : new Date(mealPrice.createdAt!).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Effective Date:</span>
                <span>{new Date(mealPrice.effectiveDate!).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
