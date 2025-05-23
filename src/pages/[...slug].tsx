import { useRouter } from 'next/router';
import { NotFoundPage } from '@/components/NotFoundPage';
import { GetServerSideProps } from 'next';

export default function CatchAllRoute() {
  const router = useRouter();
  const { slug } = router.query;
  
  // Converte o array de slugs em uma string de caminho
  const path = Array.isArray(slug) ? `/${slug.join('/')}` : '/';
  
  return <NotFoundPage path={path} />;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
}; 