import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function NewDocumentButton() {
  return (
    <Link
      href="/documents/upload"
      className="inline-flex items-center w-max px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
    >
      <PlusIcon className="h-5 w-5 mr-2" />
            Novo Documento
    </Link>
  );
}
