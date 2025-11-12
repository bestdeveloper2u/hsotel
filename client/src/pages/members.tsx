import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, Mail, Phone, Calendar, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Member } from "@shared/schema";

export default function MembersPage() {
  const { data: members, isLoading } = useQuery<Member[]>({
    queryKey: ['/api/members'],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading members...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Members</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {members?.map((member) => (
          <Card key={member.id} data-testid={`card-member-${member.id}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="w-5 h-5" />
                {member.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{member.email}</span>
              </div>
              {member.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{member.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Joined: {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {member.mealPlanType && <Badge variant="outline">{member.mealPlanType}</Badge>}
                <Badge variant={member.isActive ? 'default' : 'secondary'}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
