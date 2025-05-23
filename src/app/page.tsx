'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-8">
          Welcome to DigitSign
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
              Get Started
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              Start managing your digital signatures and documents efficiently.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 