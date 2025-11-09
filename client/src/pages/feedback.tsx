import { FeedbackForm } from "@/components/feedback-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export default function FeedbackPage() {
  const mockFeedback = [
    { id: 1, user: 'John Doe', rating: 5, category: 'Food Quality', comment: 'Excellent meals every day!', date: '2024-01-15' },
    { id: 2, user: 'Jane Smith', rating: 4, category: 'Service', comment: 'Great service, very friendly staff.', date: '2024-01-14' },
    { id: 3, user: 'Bob Johnson', rating: 3, category: 'Cleanliness', comment: 'Good but could be better.', date: '2024-01-13' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Feedback</h1>
        <p className="text-muted-foreground">View and submit feedback</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <FeedbackForm 
          onSubmit={(data) => console.log('Feedback:', data)}
        />

        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockFeedback.map((item) => (
                <div key={item.id} className="border-b pb-4 last:border-0" data-testid={`feedback-${item.id}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{item.user}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <Badge variant="secondary">{item.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.comment}</p>
                  <p className="text-xs text-muted-foreground mt-2">{item.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
