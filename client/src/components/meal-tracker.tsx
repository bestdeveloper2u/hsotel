import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface MealTrackerProps {
  members?: Array<{ id: string; name: string }>;
  onRecordMeal?: (data: { memberId: string; mealType: string; date: Date }) => void;
}

export function MealTracker({ members = [], onRecordMeal }: MealTrackerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [selectedMealType, setSelectedMealType] = useState<string>("");

  const handleSubmit = () => {
    if (selectedMember && selectedMealType && selectedDate) {
      onRecordMeal?.({ 
        memberId: selectedMember, 
        mealType: selectedMealType, 
        date: selectedDate 
      });
      console.log('Meal recorded:', { memberId: selectedMember, mealType: selectedMealType, date: selectedDate });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Meal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Member</label>
          <Select value={selectedMember} onValueChange={setSelectedMember}>
            <SelectTrigger data-testid="select-member">
              <SelectValue placeholder="Choose a member" />
            </SelectTrigger>
            <SelectContent>
              {members.map((member) => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Meal Type</label>
          <div className="flex gap-2">
            {['Breakfast', 'Lunch', 'Dinner'].map((type) => (
              <Button
                key={type}
                variant={selectedMealType === type ? 'default' : 'outline'}
                onClick={() => setSelectedMealType(type)}
                data-testid={`button-meal-${type.toLowerCase()}`}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </div>

        <Button 
          onClick={handleSubmit} 
          className="w-full"
          disabled={!selectedMember || !selectedMealType || !selectedDate}
          data-testid="button-record-meal"
        >
          Record Meal
        </Button>
      </CardContent>
    </Card>
  );
}
