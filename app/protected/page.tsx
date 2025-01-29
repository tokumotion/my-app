'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const validateAccess = async () => {
      const apiKey = sessionStorage.getItem('temp_api_key');
      
      if (!apiKey) {
        router.push('/playground');
        return;
      }

      try {
        const response = await fetch('/api/protected', {
          headers: {
            'x-api-key': apiKey
          }
        });

        if (response.ok) {
          setIsAuthorized(true);
        } else {
          router.push('/playground');
        }
      } catch (error) {
        router.push('/playground');
      } finally {
        setIsLoading(false);
      }
    };

    validateAccess();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-xl text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen p-8">
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