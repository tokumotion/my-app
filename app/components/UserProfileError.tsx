type UserProfileErrorProps = {
  error: Error;
  onRetry: () => void;
};

export default function UserProfileError({ error, onRetry }: UserProfileErrorProps) {
  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-800">
      <div className="text-red-500 text-sm">{error.message}</div>
      <button 
        onClick={onRetry}
        className="mt-2 text-sm text-blue-500 hover:text-blue-600"
      >
        Try Again
      </button>
    </div>
  );
} 