'use client';

import { useState } from 'react';

interface Document {
  id: string;
  name: string;
}

export default function DashboardPage() {
  const [documents, _setDocuments] = useState<Document[]>([]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
            Recent Documents
          </h2>
          {documents.length === 0 ? (
            <p className="text-neutral-600 dark:text-neutral-400">No recent documents</p>
          ) : (
            <ul className="space-y-2">
              {documents.map((doc) => (
                <li key={doc.id} className="text-neutral-700 dark:text-neutral-300">
                  {doc.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
} 