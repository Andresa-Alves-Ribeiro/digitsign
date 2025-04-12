import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import withAuth from '@/features/auth/withAuth';
import UploadComponent from '@/features/upload/UploadComponent';

function UploadPage(): JSX.Element {
  return (
    <div className="px-4 py-8 h-full bg-zinc-100">
      <UploadComponent />
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