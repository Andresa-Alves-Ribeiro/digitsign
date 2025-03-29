import { create } from 'zustand'
import { Document } from '@prisma/client'

interface DocumentState {
  documents: Document[]
  isLoading: boolean
  error: string | null
  setDocuments: (documents: Document[]) => void
  addDocument: (document: Document) => void
  updateDocument: (document: Document) => void
  deleteDocument: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useDocumentStore = create<DocumentState>((set) => ({
  documents: [],
  isLoading: false,
  error: null,
  setDocuments: (documents) => set({ documents }),
  addDocument: (document) =>
    set((state) => ({ documents: [...state.documents, document] })),
  updateDocument: (document) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === document.id ? document : doc
      ),
    })),
  deleteDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
})) 