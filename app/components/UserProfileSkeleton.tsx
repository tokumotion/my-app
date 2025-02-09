export default function UserProfileSkeleton() {
  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="flex-1">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
} 