'use client';

import { useState } from 'react';

interface Template {
  id: string;
  name: string;
}

export default function TemplatesPage() {
  const [templates, _setTemplates] = useState<Template[]>([]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Templates
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Your Templates
          </h2>
          {templates.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No templates yet</p>
          ) : (
            <ul className="space-y-2">
              {templates.map((template) => (
                <li key={template.id} className="text-gray-700 dark:text-gray-300">
                  {template.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
} 