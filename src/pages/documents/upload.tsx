import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import withAuth from '@/features/auth/withAuth';
import UploadComponent from '@/features/upload/UploadComponent';
import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import { MAX_FILE_SIZE_MB } from '@/constants/app';
import { DocumentArrowUpIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/react/24/outline';

function UploadPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <PageHeader
            title="Upload de Documentos"
            description={
              <div className="flex flex-col gap-1">
                <span className="text-sm text-neutral-500">Faça o upload do seu documento para assinar de forma segura e rápida</span>
              </div>
            }
            showNewDocumentButton={false}
          />
        </motion.div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <UploadComponent />
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-component-bg-light dark:bg-component-bg-dark rounded-xl shadow-sm p-6 space-y-6 border border-neutral-100 dark:border-neutral-700"
            >
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                  Requisitos do Documento
                </h3>
                <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Formato PDF
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Tamanho máximo de {MAX_FILE_SIZE_MB} MB
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Documento legível e sem senha
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center">
                  <DocumentArrowUpIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
                  Dicas Importantes
                </h3>
                <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-300">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verifique se o documento está completo antes do upload
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Certifique-se que a página está corretamente visível
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Para documentos grandes, considere dividir em partes menores
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-3 flex items-center">
                  <ClockIcon className="h-5 w-5 text-amber-500 dark:text-amber-400 mr-2" />
                  Processo de Upload
                </h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-200 dark:bg-neutral-700"></div>
                  <div className="space-y-4">
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-green-500 dark:bg-green-400"></div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">Selecione o arquivo PDF</p>
                    </div>
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-green-500 dark:bg-green-400"></div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">Clique em &quot;Enviar Documento&quot;</p>
                    </div>
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-green-500 dark:bg-green-400"></div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">Aguarde o processamento</p>
                    </div>
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-green-500 dark:bg-green-400"></div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300">Documento pronto para assinatura</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-component-bg-light dark:bg-component-bg-dark rounded-lg p-4 border border-green-100 dark:border-green-900/30">
                <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2 flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Precisa de ajuda?
                </h4>
                <p className="text-sm text-green-600 dark:text-green-300">
                  Se você encontrar algum problema durante o upload, você pode entrar em contato através do nosso email de suporte:{' '}
                  <a
                    href="mailto:andresa_15ga@hotmail.com"
                    className="text-green-700 dark:text-green-200 hover:text-green-800 dark:hover:text-green-100 underline transition-colors duration-200"
                  >
                    andresa_15ga@hotmail.com
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default withAuth(UploadPage); 