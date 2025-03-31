import { create } from 'zustand'
import { Document } from '@/types/interfaces'
import { DocumentState as DocumentStateType } from '@/types/interfaces'

interface DocumentStore extends DocumentStateType {
  setDocuments: (documents: Document[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addDocument: (document: Document) => void;
  updateDocument: (document: Document) => void;
  deleteDocument: (documentId: string) => void;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],
  isLoading: false,
  error: null,
  setDocuments: (documents) => set({ documents }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  addDocument: (document) => set((state) => ({ 
    documents: [...state.documents, document] 
  })),
  updateDocument: (document) => set((state) => ({
    documents: state.documents.map((doc) => 
      doc.id === document.id ? document : doc
    )
  })),
  deleteDocument: (documentId) => set((state) => ({
    documents: state.documents.filter((doc) => doc.id !== documentId)
  })),
})) 