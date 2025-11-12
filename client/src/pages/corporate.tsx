import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, MapPin, Phone, Mail } from "lucide-react";
import type { CorporateOffice } from "@shared/schema";

export default function CorporatePage() {
  const { data: offices, isLoading } = useQuery<CorporateOffice[]>({
    queryKey: ['/api/corporate'],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading corporate offices...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Corporate Offices</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {offices?.map((office) => (
          <Card key={office.id} data-testid={`card-corporate-${office.id}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                {office.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <span className="text-muted-foreground">{office.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{office.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{office.contactEmail}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
