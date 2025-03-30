import { renderHook, act } from '@testing-library/react'
import { useSignatures } from './useSignatures'

// Mock da API
jest.mock('@/services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}))

describe('useSignatures', () => {
  const mockSignatures = [
    {
      id: '1',
      documentId: 'doc1',
      userId: 'user1',
      signatureData: 'base64signature1',
      createdAt: new Date(),
    },
    {
      id: '2',
      documentId: 'doc1',
      userId: 'user2',
      signatureData: 'base64signature2',
      createdAt: new Date(),
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useSignatures())

    expect(result.current.signatures).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should fetch signatures successfully', async () => {
    const { result } = renderHook(() => useSignatures())
    const mockApi = require('@/services/api').api

    mockApi.get.mockResolvedValueOnce({ data: mockSignatures })

    await act(async () => {
      await result.current.fetchSignatures('doc1')
    })

    expect(result.current.signatures).toEqual(mockSignatures)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should handle fetch error', async () => {
    const { result } = renderHook(() => useSignatures())
    const mockApi = require('@/services/api').api

    mockApi.get.mockRejectedValueOnce(new Error('Failed to fetch'))

    await act(async () => {
      await result.current.fetchSignatures('doc1')
    })

    expect(result.current.signatures).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe('Erro ao carregar assinaturas')
  })

  it('should create signature successfully', async () => {
    const { result } = renderHook(() => useSignatures())
    const mockApi = require('@/services/api').api

    const newSignature = {
      documentId: 'doc1',
      userId: 'user1',
      signatureData: 'base64signature',
    }

    mockApi.post.mockResolvedValueOnce({ data: { ...newSignature, id: '3' } })

    await act(async () => {
      await result.current.createSignature(newSignature)
    })

    expect(result.current.signatures).toHaveLength(1)
    expect(result.current.signatures[0]).toMatchObject(newSignature)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should delete signature successfully', async () => {
    const { result } = renderHook(() => useSignatures())
    const mockApi = require('@/services/api').api

    mockApi.delete.mockResolvedValueOnce({ data: { id: '1' } })

    await act(async () => {
      await result.current.deleteSignature('1')
    })

    expect(result.current.signatures).toHaveLength(0)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should handle signature operations error', async () => {
    const { result } = renderHook(() => useSignatures())
    const mockApi = require('@/services/api').api

    mockApi.post.mockRejectedValueOnce(new Error('Failed to create'))

    await act(async () => {
      await result.current.createSignature({
        documentId: 'doc1',
        userId: 'user1',
        signatureData: 'base64signature',
      })
    })

    expect(result.current.signatures).toHaveLength(0)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe('Erro ao processar assinatura')
  })

  it('should validate signature data before creating', async () => {
    const { result } = renderHook(() => useSignatures())

    await act(async () => {
      await result.current.createSignature({
        documentId: 'doc1',
        userId: 'user1',
        signatureData: '',
      })
    })

    expect(result.current.signatures).toHaveLength(0)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe('Dados da assinatura são obrigatórios')
  })

  it('should handle document not found error', async () => {
    const { result } = renderHook(() => useSignatures())
    const mockApi = require('@/services/api').api

    mockApi.post.mockRejectedValueOnce({ response: { status: 404 } })

    await act(async () => {
      await result.current.createSignature({
        documentId: 'nonexistent',
        userId: 'user1',
        signatureData: 'base64signature',
      })
    })

    expect(result.current.signatures).toHaveLength(0)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe('Documento não encontrado')
  })
}) 