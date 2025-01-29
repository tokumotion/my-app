import { useState } from 'react';

export default function ContactSupport() {
  const [showContactMessage, setShowContactMessage] = useState(false);

  return (
    <div className="mt-8 text-center">
      <p className="text-gray-400">
        Have any questions, feedback or need support? We'd love to hear from you!
      </p>
      <button 
        onClick={() => setShowContactMessage(true)}
        className="mt-4 px-6 py-2 border border-gray-700 text-white rounded-full hover:bg-gray-800 transition-colors"
      >
        Contact us
      </button>

      {/* Contact Us Modal */}
      {showContactMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md">
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our support system is coming soon! In the meantime, you can reach us at support@example.com
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowContactMessage(false)}
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