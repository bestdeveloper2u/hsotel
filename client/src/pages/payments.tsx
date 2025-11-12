import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, DollarSign, Calendar, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Payment } from "@shared/schema";

export default function PaymentsPage() {
  const { data: payments, isLoading } = useQuery<Payment[]>({
    queryKey: ['/api/payments'],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading payments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payments</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {payments?.map((payment) => (
          <Card key={payment.id} data-testid={`card-payment-${payment.id}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  <span className="text-lg">Payment #{payment.id.slice(0, 8)}</span>
                </div>
                <Badge variant={
                  payment.status === 'Paid' ? 'default' :
                  payment.status === 'Pending' ? 'secondary' : 'destructive'
                }>
                  {payment.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-lg font-semibold">${payment.amount}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {payment.entityType}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
