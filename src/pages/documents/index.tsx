import { useSession, getSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { GetServerSideProps } from 'next';
import PageHeader from '@/components/PageHeader';
import Loading from '@/components/ui/Loading';
import DocumentList from '@/components/documents/DocumentList';
import withAuth from '@/features/auth/withAuth';

function DocumentsPage() {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center bg-component-bg-light dark:bg-component-bg-dark">
        <Loading text="Carregando documentos..." />
      </div>
    );
  }

  if (status === 'authenticated') {
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
              title="Meus Documentos"
              description="Gerencie todos os seus documentos"
              showNewDocumentButton={true}
            />
          </motion.div>

          <DocumentList />
        </div>
      </div>
    );
  }

  return null;
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

export default withAuth(DocumentsPage); 