import { MealTracker } from '../meal-tracker';

export default function MealTrackerExample() {
  const mockMembers = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Bob Johnson' },
  ];

  return (
    <div className="p-6 max-w-md">
      <MealTracker 
        members={mockMembers}
        onRecordMeal={(data) => console.log('Record meal:', data)}
      />
    </div>
  );
}
