import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Document } from '@prisma/client';

interface DocumentPageProps {
  document: Document | null;
  error: string | null;
}

export const getDocumentServerSideProps: GetServerSideProps<DocumentPageProps> = async (context) => {
  const session = await getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: '/401',
        permanent: false,
      },
    };
  }

  const { id } = context.params ?? {};
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/documents/${id}/metadata`, {
      headers: {
        Cookie: context.req.headers.cookie ?? '',
      },
    });
    
    if (!res.ok) {
      if (res.status === 404) {
        return {
          redirect: {
            destination: '/404',
            permanent: false,
          },
        };
      }
      
      if (res.status === 403) {
        return {
          redirect: {
            destination: '/403',
            permanent: false,
          },
        };
      }
      
      return {
        redirect: {
          destination: '/500',
          permanent: false,
        },
      };
    }

    const document = await res.json() as Document;
    
    return {
      props: {
        document,
        error: null,
      },
    };
  } catch (error) {
    console.error('Error fetching document:', error);
    return {
      redirect: {
        destination: '/500',
        permanent: false,
      },
    };
  }
}; 