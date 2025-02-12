const handleCreateApiKey = async (name: string) => {
  try {
    const response = await fetch('/api/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.code === 'AUTH_REQUIRED') {
        // Handle unauthenticated user
        console.log('User not authenticated, redirecting to login...');
        window.location.href = data.redirectUrl;
        return;
      }

      if (data.isAuthError) {
        console.log('Authentication error occurred');
        // Handle authentication-related errors
        return;
      }

      throw new Error(data.error || 'Failed to create API key');
    }

    // Handle successful creation
    console.log('API key created successfully:', data.apiKey);

  } catch (error) {
    console.error('Error creating API key:', error);
    // Handle other errors
  }
}; 