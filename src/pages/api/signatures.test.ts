import { createMocks } from 'node-mocks-http'
import handler from './signatures'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    signature: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    document: {
      findUnique: jest.fn(),
    },
  },
}))

describe('Signatures API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/signatures', () => {
    it('should return all signatures for a document', async () => {
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

      ;(prisma.signature.findMany as jest.Mock).mockResolvedValue(mockSignatures)

      const { req, res } = createMocks({
        method: 'GET',
        query: {
          documentId: 'doc1',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const responseData = JSON.parse(res._getData())
      expect(responseData).toEqual(mockSignatures)
    })

    it('should return 400 if documentId is missing', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const responseData = JSON.parse(res._getData())
      expect(responseData).toHaveProperty('error', 'ID do documento é obrigatório')
    })
  })

  describe('POST /api/signatures', () => {
    it('should create a new signature', async () => {
      const mockDocument = {
        id: 'doc1',
        title: 'Test Document',
      }

      const mockSignature = {
        id: '1',
        documentId: 'doc1',
        userId: 'user1',
        signatureData: 'base64signature',
        createdAt: new Date(),
      }

      ;(prisma.document.findUnique as jest.Mock).mockResolvedValue(mockDocument)
      ;(prisma.signature.create as jest.Mock).mockResolvedValue(mockSignature)

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          documentId: 'doc1',
          userId: 'user1',
          signatureData: 'base64signature',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(201)
      const responseData = JSON.parse(res._getData())
      expect(responseData).toEqual(mockSignature)
    })

    it('should return 404 if document does not exist', async () => {
      ;(prisma.document.findUnique as jest.Mock).mockResolvedValue(null)

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          documentId: 'nonexistent',
          userId: 'user1',
          signatureData: 'base64signature',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(404)
      const responseData = JSON.parse(res._getData())
      expect(responseData).toHaveProperty('error', 'Documento não encontrado')
    })

    it('should validate required fields', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          documentId: 'doc1',
          userId: 'user1',
          signatureData: '',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const responseData = JSON.parse(res._getData())
      expect(responseData).toHaveProperty('error', 'Dados da assinatura são obrigatórios')
    })
  })

  describe('DELETE /api/signatures/:id', () => {
    it('should delete an existing signature', async () => {
      const mockSignature = {
        id: '1',
        documentId: 'doc1',
        userId: 'user1',
        signatureData: 'base64signature',
        createdAt: new Date(),
      }

      ;(prisma.signature.findUnique as jest.Mock).mockResolvedValue(mockSignature)
      ;(prisma.signature.delete as jest.Mock).mockResolvedValue(mockSignature)

      const { req, res } = createMocks({
        method: 'DELETE',
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const responseData = JSON.parse(res._getData())
      expect(responseData).toEqual(mockSignature)
    })

    it('should return 404 for non-existent signature', async () => {
      ;(prisma.signature.findUnique as jest.Mock).mockResolvedValue(null)

      const { req, res } = createMocks({
        method: 'DELETE',
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(404)
      const responseData = JSON.parse(res._getData())
      expect(responseData).toHaveProperty('error', 'Assinatura não encontrada')
    })
  })
}) 