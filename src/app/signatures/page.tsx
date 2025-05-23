'use client';

import { useState } from 'react';

interface Signature {
  id: string;
  name: string;
}

export default function SignaturesPage() {
  const [signatures, _setSignatures] = useState<Signature[]>([]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">
        Signatures
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
            Your Signatures
          </h2>
          {signatures.length === 0 ? (
            <p className="text-neutral-600 dark:text-neutral-400">No signatures yet</p>
          ) : (
            <ul className="space-y-2">
              {signatures.map((signature) => (
                <li key={signature.id} className="text-neutral-700 dark:text-neutral-300">
                  {signature.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
} 