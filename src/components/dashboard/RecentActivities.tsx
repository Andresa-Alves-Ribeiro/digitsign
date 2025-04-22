import Link from 'next/link';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { Document } from '@/types/interfaces';
import { DocumentStatus } from '@/types/enums/document';

interface RecentActivitiesProps {
  documents: Document[];
}

export default function RecentActivities({ documents }: RecentActivitiesProps) {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-700">Atividades Recentes</h3>

        <Link href="/documents" className="inline-flex items-center w-max px-4 py-1.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
        >
          Ver todos
        </Link>
      </div>

      <div className="space-y-4">
        {documents.length > 0 ? (
          documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                doc.status === DocumentStatus.SIGNED 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {doc.status === DocumentStatus.SIGNED ? 'Assinado' : 'Pendente'}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">Nenhum documento encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
} 