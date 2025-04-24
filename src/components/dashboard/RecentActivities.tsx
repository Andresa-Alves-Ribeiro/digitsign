import Link from 'next/link';
import { DocumentTextIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Document } from '@/types/interfaces';
import { DocumentStatus } from '@/types/enums/document';
import { FC } from 'react';
import { motion } from 'framer-motion';

interface RecentActivitiesProps {
  documents: Document[];
}

const RecentActivities: FC<RecentActivitiesProps> = ({ documents }): JSX.Element => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-700">Atividades Recentes</h3>

        <Link href="/documents">
          <motion.div 
            className="inline-flex items-center w-max px-4 py-1.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ver todos
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </motion.div>
        </Link>
      </div>

      <motion.div 
        className="space-y-4"
        variants={containerVariants}
      >
        {documents.length > 0 ? (
          documents.map((doc, _index) => (
            <motion.div
              key={doc.id}
              variants={itemVariants}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                </motion.div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                  <p className='text-sm text-gray-500'>
                    {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <motion.span 
                className={`px-2 py-1 text-xs font-medium rounded-md ${
                  doc.status === DocumentStatus.SIGNED 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {doc.status === DocumentStatus.SIGNED ? 'Assinado' : 'Pendente'}
              </motion.span>
            </motion.div>
          ))
        ) : (
          <motion.div 
            className="text-center py-6"
            variants={itemVariants}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            </motion.div>
            <p className="text-gray-500">Nenhum documento encontrado</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default RecentActivities; 