import { useRouter } from 'next/router';

export const useDocumentActions = () => {
    const router = useRouter();

    const onSign = (documentId: string) => {
        router.push(`/documents/${documentId}/sign`);
    };

    const onDelete = async (documentId: string) => {
        if (!confirm('Tem certeza que deseja excluir este documento?')) {
            return;
        }

        try {
            const res = await fetch(`/api/documents/${documentId}/delete`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erro ao excluir documento');
            }

            router.push('/documents');
        } catch (error) {
            console.error('Erro ao excluir documento:', error);
            throw error;
        }
    };

    return {
        onSign,
        onDelete
    };
}; 