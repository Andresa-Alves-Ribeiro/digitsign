import { create } from 'zustand'
import { Document } from '@prisma/client'
import { DocumentState as DocumentStateType } from '@/types/interfaces'

interface DocumentStore extends DocumentStateType {
  setDocuments: (documents: Document[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],
  loading: false,
  error: null,
  setDocuments: (documents) => set({ documents }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
})) 