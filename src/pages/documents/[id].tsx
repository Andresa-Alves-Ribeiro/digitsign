import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import withAuth from "@/components/withAuth";
import Loading from '@/components/Loading';

function DocumentViewPage() {
    const router = useRouter();
    const { id } = router.query;
    const [document, setDocument] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSigning, setIsSigning] = useState(false);

    useEffect(() => {
        if (id) {
            fetchDocument();
        }
    }, [id]);

    const fetchDocument = async () => {
        try {
            setError(null);
            const res = await fetch(`/api/documents/${id}`);
            if (!res.ok) {
                throw new Error('Erro ao carregar o documento');
            }
            const data = await res.json();
            setDocument(data);
        } catch (error) {
            console.error("Error fetching document:", error);
            setError('Não foi possível carregar o documento. Tente novamente mais tarde.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignDocument = async () => {
        try {
            setIsSigning(true);
            const res = await fetch(`/api/documents/${id}/sign`, {
                method: 'POST',
            });
            
            if (!res.ok) {
                throw new Error('Erro ao assinar o documento');
            }
            
            await fetchDocument();
        } catch (error) {
            console.error("Error signing document:", error);
            setError('Não foi possível assinar o documento. Tente novamente mais tarde.');
        } finally {
            setIsSigning(false);
        }
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <Loading />
                <p className="mt-4">Carregando documento...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="container mx-auto p-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                <p>{error}</p>
            </div>
        </div>
    );

    if (!document) return (
        <div className="container mx-auto p-4">
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
                <p>Documento não encontrado</p>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{document.name}</h1>
                {document.status === "PENDING" && (
                    <button
                        onClick={handleSignDocument}
                        disabled={isSigning}
                        className={`px-4 py-2 rounded-md text-white ${
                            isSigning 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {isSigning ? 'Assinando...' : 'Assinar Documento'}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="font-semibold mb-2">Informações do Documento</h2>
                    <div className="space-y-2">
                        <p><span className="font-medium">Status:</span> 
                            <span className={`ml-2 px-2 py-1 rounded-full text-sm ${
                                document.status === "PENDING" 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : 'bg-green-100 text-green-800'
                            }`}>
                                {document.status === "PENDING" ? "Pendente" : "Assinado"}
                            </span>
                        </p>
                        <p><span className="font-medium">Data de upload:</span> {new Date(document.createdAt).toLocaleDateString()}</p>
                        <p><span className="font-medium">Tamanho do arquivo:</span> {(document.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                </div>
            </div>

            <div className="border rounded-lg shadow-lg overflow-hidden">
                <iframe
                    src={`/uploads/${document.fileKey}`}
                    className="w-full h-[600px]"
                    title={document.name}
                />
            </div>
        </div>
    );
}

export default withAuth(DocumentViewPage);