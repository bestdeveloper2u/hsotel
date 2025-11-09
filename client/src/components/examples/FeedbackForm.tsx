import { FeedbackForm } from '../feedback-form';

export default function FeedbackFormExample() {
  return (
    <div className="p-6 max-w-md">
      <FeedbackForm 
        onSubmit={(data) => console.log('Feedback:', data)}
      />
    </div>
  );
}
