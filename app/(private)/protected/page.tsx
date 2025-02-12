'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import debounce from 'lodash/debounce';

// Inactivity timeout in milliseconds (30 minutes)
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;
const WARNING_TIME = 5 * 60 * 1000; // Show warning 5 minutes before expiry

export default function ProtectedPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);

  // Debounced activity refresh
  const debouncedActivityRefresh = useCallback(
    debounce(() => {
      console.log('🔄 Refreshing activity timestamp...');
      fetch('/api/protected', {
        method: 'POST',
        credentials: 'include'
      }).catch(error => console.error('Error updating activity:', error));
    }, 1000), // Debounce for 1 second
    []
  );

  // Activity tracking effect
  useEffect(() => {
    console.log('🎯 Setting up activity tracking...');
    
    let inactivityTimer: NodeJS.Timeout;
    let warningTimer: NodeJS.Timeout;

    const resetInactivityTimer = () => {
      console.log('⏱️ Resetting inactivity timer');
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
      setShowExpiryWarning(false);
      
      // Set warning timer
      warningTimer = setTimeout(() => {
        console.log('⚠️ Session expiring soon');
        setShowExpiryWarning(true);
      }, INACTIVITY_TIMEOUT - WARNING_TIME);

      // Set expiry timer
      inactivityTimer = setTimeout(() => {
        console.log('⚠️ Session expired, redirecting...');
        router.push('/playground');
      }, INACTIVITY_TIMEOUT);

      // Refresh activity timestamp
      debouncedActivityRefresh();
    };

    // Set up event listeners for user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    activityEvents.forEach(event => {
      window.addEventListener(event, resetInactivityTimer);
    });

    // Initial timer setup
    resetInactivityTimer();

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up activity tracking...');
      debouncedActivityRefresh.cancel();
      clearTimeout(inactivityTimer);
      clearTimeout(warningTimer);
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [router, debouncedActivityRefresh]);

  // Original authorization effect - maintained as is
  useEffect(() => {
    const validateAccess = async () => {
      console.log('🔐 Auth Cookie State:', {
        timestamp: new Date().toISOString(),
        allCookies: document.cookie.split(';').map(c => c.trim().split('=')[0]),
        hasSupabaseCookies: document.cookie.includes('supabase'),
        hasNextAuthCookies: document.cookie.includes('next-auth')
      });
      
      console.log('🔄 Starting protected page validation...');
      
      try {
        const cookies = document.cookie;
        console.log('📝 Current cookies:', cookies);

        console.log('🚀 Making request to /api/protected...');
        const response = await fetch('/api/protected', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        console.log('📡 API Response status:', response.status);

        if (response.ok) {
          console.log('✅ Access validated successfully');
          setIsAuthorized(true);
        } else {
          console.log('❌ Access denied, redirecting to playground');
          try {
            const errorData = await response.json();
            console.log('Error details:', errorData);
          } catch (e) {
            console.log('No error details available');
          }
          router.push('/playground');
        }
      } catch (error) {
        console.error('💥 Error during validation:', error);
        router.push('/playground');
      } finally {
        console.log('🏁 Validation process completed');
        setIsLoading(false);
      }
    };

    console.log('🎬 Protected page effect triggered');
    validateAccess();
  }, [router]);

  // Original loading state
  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-xl text-gray-400">Loading...</div>
      </div>
    );
  }

  // Original unauthorized state
  if (!isAuthorized) {
    return null;
  }

  // Original UI render
  return (
    <div className="min-h-screen p-8 relative">
      {showExpiryWarning && (
        <div className="fixed top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-md shadow-lg">
          Session expiring soon. Move mouse or press key to extend.
        </div>
      )}
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-rose-200 via-purple-200 to-blue-200 dark:from-rose-900 dark:via-purple-900 dark:to-blue-900 rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">King Lear: A Modern Retelling</h1>
          <p className="text-lg opacity-80">
            A brief modern interpretation of Shakespeare's classic tragedy
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed space-y-6">
              In the gleaming towers of a global corporation, aging CEO King Lear prepares for retirement. His 
              empire, built over decades, stands as a testament to his business acumen. But now, faced with 
              succession planning, he makes a fateful decision: he'll divide his company among his three daughters 
              based on how well they can express their loyalty to him.
            </p>
            
            <p className="text-gray-300 leading-relaxed mt-4">
              Goneril and Regan, the elder daughters, masterfully play to their father's ego. In sleek 
              boardrooms, they deliver perfectly crafted speeches about their devotion, each promising to 
              uphold his legacy. But Cordelia, his youngest and most talented successor, refuses to participate 
              in this corporate theatre. She simply states that she loves him as a daughter should - no more, 
              no less. Her honesty, so out of place in this world of corporate politics, enrages Lear.
            </p>

            <p className="text-gray-300 leading-relaxed mt-4">
              In a shocking press release, Lear disinherits Cordelia and divides the company between Goneril 
              and Regan. His loyal COO, Kent, protests this rash decision and is immediately fired. Meanwhile, 
              a competing firm quickly hires Cordelia, recognizing her integrity and skill.
            </p>

            <p className="text-gray-300 leading-relaxed mt-4">
              As Lear steps down, retaining only his title and a small team, his world begins to unravel. 
              Goneril and Regan, now controlling the company, gradually strip away his remaining influence. 
              They reduce his staff, cancel his corporate cards, and eventually lock him out of the building 
              he built. His mental health deteriorates as he faces the bitter reality of his mistakes.
            </p>

            <p className="text-gray-300 leading-relaxed mt-4">
              Parallel to this, a subplot unfolds involving the company's CFO, Gloucester, and his two sons. 
              Edmund, his illegitimate son, fabricates evidence suggesting his legitimate brother Edgar is 
              planning to steal from the company. This corporate espionage leads to Edgar's flight and 
              Gloucester's brutal ousting when he remains loyal to Lear.
            </p>

            <p className="text-gray-300 leading-relaxed mt-4">
              The company descends into chaos as Goneril and Regan compete for power, each forming dangerous 
              alliances. When a hostile takeover threatens the company, Cordelia returns with a rescue plan. 
              But it's too late - the board has been corrupted, the company's reputation is in tatters, and 
              Lear's mental state has collapsed completely.
            </p>

            <p className="text-gray-300 leading-relaxed mt-4">
              In the tragic conclusion, Cordelia's attempt to save both her father and the company fails. 
              Corporate raiders destroy what remains of Lear's empire. Goneril poisons Regan in a final power 
              play before taking her own life. Lear, finally reconciled with Cordelia, dies in grief when she 
              becomes a casualty of the hostile takeover. The company, like its founder, falls victim to the 
              very human flaws of pride, greed, and misplaced trust.
            </p>

            <p className="text-gray-300 leading-relaxed mt-4">
              This modern tragedy serves as a stark reminder that even in today's corporate world, the fundamental 
              human elements of Shakespeare's play - pride, loyalty, betrayal, and love - remain as relevant as ever. 
              The story warns us that power without wisdom, and authority without understanding, can lead to the 
              downfall of even the mightiest enterprises.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 