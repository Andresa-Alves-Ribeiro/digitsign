import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import withAuth from "@/features/auth/withAuth";
import UploadComponent from "@/features/upload/UploadComponent";

function UploadPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Upload de Documento</h1>
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