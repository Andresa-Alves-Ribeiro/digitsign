import { renderHook, act } from '@testing-library/react'
import { useDocuments } from './useDocuments'

// Mock da API
jest.mock('@/services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}))

describe('useDocuments', () => {
  const mockDocuments = [
    {
      id: '1',
      title: 'Document 1',
      content: 'Content 1',
      userId: 'user1',
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Document 2',
      content: 'Content 2',
      userId: 'user1',
      createdAt: new Date(),
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useDocuments())

    expect(result.current.documents).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should fetch documents successfully', async () => {
    const { result } = renderHook(() => useDocuments())
    const mockApi = require('@/services/api').api

    mockApi.get.mockResolvedValueOnce({ data: mockDocuments })

    await act(async () => {
      await result.current.fetchDocuments()
    })

    expect(result.current.documents).toEqual(mockDocuments)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should handle fetch error', async () => {
    const { result } = renderHook(() => useDocuments())
    const mockApi = require('@/services/api').api

    mockApi.get.mockRejectedValueOnce(new Error('Failed to fetch'))

    await act(async () => {
      await result.current.fetchDocuments()
    })

    expect(result.current.documents).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe('Erro ao carregar documentos')
  })

  it('should create document successfully', async () => {
    const { result } = renderHook(() => useDocuments())
    const mockApi = require('@/services/api').api

    const newDocument = {
      title: 'New Document',
      content: 'New Content',
    }

    mockApi.post.mockResolvedValueOnce({ data: { ...newDocument, id: '3' } })

    await act(async () => {
      await result.current.createDocument(newDocument)
    })

    expect(result.current.documents).toHaveLength(1)
    expect(result.current.documents[0]).toMatchObject(newDocument)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should update document successfully', async () => {
    const { result } = renderHook(() => useDocuments())
    const mockApi = require('@/services/api').api

    const updatedDocument = {
      id: '1',
      title: 'Updated Document',
      content: 'Updated Content',
    }

    mockApi.put.mockResolvedValueOnce({ data: updatedDocument })

    await act(async () => {
      await result.current.updateDocument(updatedDocument)
    })

    expect(result.current.documents).toHaveLength(1)
    expect(result.current.documents[0]).toEqual(updatedDocument)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should delete document successfully', async () => {
    const { result } = renderHook(() => useDocuments())
    const mockApi = require('@/services/api').api

    mockApi.delete.mockResolvedValueOnce({ data: { id: '1' } })

    await act(async () => {
      await result.current.deleteDocument('1')
    })

    expect(result.current.documents).toHaveLength(0)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should handle document operations error', async () => {
    const { result } = renderHook(() => useDocuments())
    const mockApi = require('@/services/api').api

    mockApi.post.mockRejectedValueOnce(new Error('Failed to create'))

    await act(async () => {
      await result.current.createDocument({
        title: 'New Document',
        content: 'New Content',
      })
    })

    expect(result.current.documents).toHaveLength(0)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe('Erro ao processar documento')
  })
}) 