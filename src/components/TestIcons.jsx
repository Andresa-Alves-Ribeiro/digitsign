import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function TestIcons() {
  return (
    <div className="p-4 bg-component-bg-light dark:bg-component-bg-dark rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Teste de Ícones</h2>
      <div className="flex space-x-4">
        <div className="flex flex-col items-center">
          <SunIcon className="h-8 w-8 text-yellow-500" />
          <span className="mt-2">Sol</span>
        </div>
        <div className="flex flex-col items-center">
          <MoonIcon className="h-8 w-8 text-blue-500" />
          <span className="mt-2">Lua</span>
        </div>
      </div>
    </div>
  );
} 