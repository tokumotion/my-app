import { useState } from 'react';

export default function PlanSection() {
  const [showManagePlanMessage, setShowManagePlanMessage] = useState(false);

  return (
    <div className="mb-8 bg-gradient-to-r from-rose-200 via-purple-200 to-blue-200 dark:from-rose-900 dark:via-purple-900 dark:to-blue-900 rounded-lg p-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">CURRENT PLAN</h2>
          <h1 className="text-4xl font-bold mb-6">Researcher</h1>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              API Usage
              <span className="text-sm opacity-60">ⓘ</span>
            </h3>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-white rounded-full h-2 w-0" />
            </div>
            <p className="text-sm">0/1,000 Credits</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowManagePlanMessage(true)}
          className="bg-white/90 text-black px-4 py-2 rounded-lg hover:bg-white transition-colors"
        >
          Manage Plan
        </button>
      </div>

      {showManagePlanMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md">
            <h3 className="text-xl font-bold mb-4">Coming Soon!</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We're working hard to bring you plan management features. Stay tuned for updates!
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowManagePlanMessage(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 