'use client';

import { useState } from 'react';
import { useApiKeys } from '../hooks/useApiKeys';
import PlanSection from '../components/dashboard/PlanSection';
import ApiKeysTable from '../components/dashboard/ApiKeysTable';
import CreateApiKeyModal from '../components/CreateApiKeyModal';
import Toast from '../components/Toast';
import ContactSupport from '../components/dashboard/ContactSupport';

export default function DashboardContent() {
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
    <div className="container mx-auto max-w-7xl">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Your dashboard content */}
      </div>
    </div>
  );
} 