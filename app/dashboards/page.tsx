'use client';

import { useState } from 'react';
import { useApiKeys } from '../hooks/useApiKeys';
import PlanSection from '../components/dashboard/PlanSection';
import ApiKeysTable from '../components/dashboard/ApiKeysTable';
import CreateApiKeyModal from '../components/CreateApiKeyModal';
import Toast from '../components/Toast';
import ContactSupport from '../components/dashboard/ContactSupport';

export default function DashboardPage() {
  const {
    apiKeys,
    isLoading,
    error,
    visibleKeys,
    createApiKey,
    deleteApiKey,
    toggleKeyVisibility,
  } = useApiKeys();

  const [isCreating, setIsCreating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleCopyToClipboard = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      showNotification('API key copied successfully!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    const success = await deleteApiKey(id);
    if (success) {
      showNotification('API key deleted successfully!');
    }
  };

  return (
    <div className="min-h-screen p-8">
      {showToast && <Toast message={toastMessage} />}
      <div className="max-w-6xl mx-auto">
        <PlanSection />

        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold text-white">API Keys</h2>
              <p className="text-sm text-gray-400 mt-1">
                The key is used to authenticate your requests to the Research API.
              </p>
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
            >
              <span>+</span>
              New API Key
            </button>
          </div>

          <ApiKeysTable
            apiKeys={apiKeys}
            visibleKeys={visibleKeys}
            onToggleVisibility={toggleKeyVisibility}
            onCopy={handleCopyToClipboard}
            onDelete={handleDeleteApiKey}
          />
        </div>

        <ContactSupport />

        <CreateApiKeyModal
          isOpen={isCreating}
          onClose={() => setIsCreating(false)}
          onSubmit={async (name) => {
            const success = await createApiKey(name);
            if (success) {
              setIsCreating(false);
              showNotification('API key created successfully!');
            } else {
              showNotification('Failed to create API key. Please try again later.');
            }
          }}
        />
      </div>
    </div>
  );
}