import { create } from 'zustand';
import { Document } from '@/types/interfaces';

interface DocumentState {
  documents: Document[];
  loading: boolean;
  error: string | null;
  setDocuments: (documents: Document[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addDocument: (document: Document) => void;
  updateDocument: (documentId: string, updates: Partial<Document>) => void;
  removeDocument: (documentId: string) => void;
}

const useDocumentStore = create<DocumentState>((set) => ({
  documents: [],
  loading: false,
  error: null,

  setDocuments: (documents) => set({ documents }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  addDocument: (document) =>
    set((state) => ({
      documents: [...state.documents, document],
    })),

  updateDocument: (documentId, updates) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === documentId ? { ...doc, ...updates } : doc
      ),
    })),

  removeDocument: (documentId) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== documentId),
    })),
}));

export default useDocumentStore; 