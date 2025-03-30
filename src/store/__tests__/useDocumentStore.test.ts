import { act } from '@testing-library/react'
import { useDocumentStore } from '../useDocumentStore'
import { Document } from '@prisma/client'

describe('useDocumentStore', () => {
  const mockDocument: Document = {
    id: '1',
    title: 'Test Document',
    content: 'Test Content',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
    status: 'PENDING',
    signatureId: null,
  }

  const mockDocument2: Document = {
    ...mockDocument,
    id: '2',
    title: 'Test Document 2',
  }

  beforeEach(() => {
    // Limpa o store antes de cada teste
    act(() => {
      useDocumentStore.setState({
        documents: [],
        isLoading: false,
        error: null,
      })
    })
  })

  describe('setDocuments', () => {
    it('should set documents', () => {
      act(() => {
        useDocumentStore.getState().setDocuments([mockDocument])
      })

      expect(useDocumentStore.getState().documents).toEqual([mockDocument])
    })
  })

  describe('addDocument', () => {
    it('should add a document', () => {
      act(() => {
        useDocumentStore.getState().addDocument(mockDocument)
      })

      expect(useDocumentStore.getState().documents).toEqual([mockDocument])
    })

    it('should add multiple documents', () => {
      act(() => {
        useDocumentStore.getState().addDocument(mockDocument)
        useDocumentStore.getState().addDocument(mockDocument2)
      })

      expect(useDocumentStore.getState().documents).toEqual([mockDocument, mockDocument2])
    })
  })

  describe('updateDocument', () => {
    it('should update a document', () => {
      const updatedDocument = { ...mockDocument, title: 'Updated Title' }

      act(() => {
        useDocumentStore.getState().setDocuments([mockDocument])
        useDocumentStore.getState().updateDocument(updatedDocument)
      })

      expect(useDocumentStore.getState().documents[0].title).toBe('Updated Title')
    })

    it('should not update non-existent document', () => {
      act(() => {
        useDocumentStore.getState().setDocuments([mockDocument])
        useDocumentStore.getState().updateDocument(mockDocument2)
      })

      expect(useDocumentStore.getState().documents).toEqual([mockDocument])
    })
  })

  describe('deleteDocument', () => {
    it('should delete a document', () => {
      act(() => {
        useDocumentStore.getState().setDocuments([mockDocument, mockDocument2])
        useDocumentStore.getState().deleteDocument(mockDocument.id)
      })

      expect(useDocumentStore.getState().documents).toEqual([mockDocument2])
    })

    it('should not delete non-existent document', () => {
      act(() => {
        useDocumentStore.getState().setDocuments([mockDocument])
        useDocumentStore.getState().deleteDocument('non-existent-id')
      })

      expect(useDocumentStore.getState().documents).toEqual([mockDocument])
    })
  })

  describe('loading state', () => {
    it('should set loading state', () => {
      act(() => {
        useDocumentStore.getState().setLoading(true)
      })

      expect(useDocumentStore.getState().isLoading).toBe(true)

      act(() => {
        useDocumentStore.getState().setLoading(false)
      })

      expect(useDocumentStore.getState().isLoading).toBe(false)
    })
  })

  describe('error state', () => {
    it('should set error state', () => {
      const errorMessage = 'Test error'

      act(() => {
        useDocumentStore.getState().setError(errorMessage)
      })

      expect(useDocumentStore.getState().error).toBe(errorMessage)

      act(() => {
        useDocumentStore.getState().setError(null)
      })

      expect(useDocumentStore.getState().error).toBeNull()
    })
  })

  describe('store initialization', () => {
    it('should initialize with default values', () => {
      const state = useDocumentStore.getState()

      expect(state.documents).toEqual([])
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('complex operations', () => {
    it('should handle multiple operations in sequence', () => {
      act(() => {
        const store = useDocumentStore.getState()
        
        // Add documents
        store.addDocument(mockDocument)
        store.addDocument(mockDocument2)
        
        // Update a document
        store.updateDocument({ ...mockDocument, title: 'Updated' })
        
        // Delete a document
        store.deleteDocument(mockDocument2.id)
      })

      const finalState = useDocumentStore.getState()
      expect(finalState.documents).toHaveLength(1)
      expect(finalState.documents[0].title).toBe('Updated')
    })

    it('should maintain state consistency during operations', () => {
      act(() => {
        const store = useDocumentStore.getState()
        
        store.setLoading(true)
        store.addDocument(mockDocument)
        store.setError('Temporary error')
        store.updateDocument(mockDocument)
        store.setError(null)
        store.setLoading(false)
      })

      const finalState = useDocumentStore.getState()
      expect(finalState.documents).toHaveLength(1)
      expect(finalState.isLoading).toBe(false)
      expect(finalState.error).toBeNull()
    })
  })
}) 