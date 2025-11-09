import { useQuery, useMutation } from "@tanstack/react-query";
import { FeedbackForm } from "@/components/feedback-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function FeedbackPage() {
  const { toast } = useToast();

  const { data: feedbacks = [] } = useQuery({
    queryKey: ['/api/feedback'],
    queryFn: () => apiRequest('/api/feedback')
  });

  const submitFeedbackMutation = useMutation({
    mutationFn: (data: { rating: number; category: string; comment: string }) =>
      apiRequest('/api/feedback', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/feedback'] });
      toast({
        title: "Success",
        description: "Feedback submitted successfully"
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Feedback</h1>
        <p className="text-muted-foreground">View and submit feedback</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FeedbackForm 
          onSubmit={(data) => submitFeedbackMutation.mutate(data)}
        />

        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feedbacks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No feedback yet</p>
              ) : (
                feedbacks.slice(0, 10).map((item: any) => (
                  <div key={item.id} className="border-b pb-4 last:border-0" data-testid={`feedback-${item.id}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">User {item.userId.slice(0, 8)}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: item.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <Badge variant="secondary">{item.category}</Badge>
                    </div>
                    {item.comment && <p className="text-sm text-muted-foreground">{item.comment}</p>}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
