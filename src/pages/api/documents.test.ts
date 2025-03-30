import { createMocks } from 'node-mocks-http'
import handler from './documents'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    document: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

describe('Documents API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/documents', () => {
    it('should return all documents for authenticated user', async () => {
      const mockDocuments = [
        {
          id: '1',
          title: 'Test Document 1',
          content: 'Test Content 1',
          userId: 'user1',
        },
        {
          id: '2',
          title: 'Test Document 2',
          content: 'Test Content 2',
          userId: 'user1',
        },
      ]

      ;(prisma.document.findMany as jest.Mock).mockResolvedValue(mockDocuments)

      const { req, res } = createMocks({
        method: 'GET',
        headers: {
          'x-user-id': 'user1',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const responseData = JSON.parse(res._getData())
      expect(responseData).toEqual(mockDocuments)
    })

    it('should return 401 for unauthenticated user', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(401)
      const responseData = JSON.parse(res._getData())
      expect(responseData).toHaveProperty('error', 'Não autorizado')
    })
  })

  describe('POST /api/documents', () => {
    it('should create a new document', async () => {
      const mockDocument = {
        id: '1',
        title: 'New Document',
        content: 'New Content',
        userId: 'user1',
      }

      ;(prisma.document.create as jest.Mock).mockResolvedValue(mockDocument)

      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          'x-user-id': 'user1',
        },
        body: {
          title: 'New Document',
          content: 'New Content',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(201)
      const responseData = JSON.parse(res._getData())
      expect(responseData).toEqual(mockDocument)
    })

    it('should validate required fields', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        headers: {
          'x-user-id': 'user1',
        },
        body: {
          title: '',
          content: '',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(400)
      const responseData = JSON.parse(res._getData())
      expect(responseData).toHaveProperty('error', 'Título e conteúdo são obrigatórios')
    })
  })

  describe('PUT /api/documents/:id', () => {
    it('should update an existing document', async () => {
      const mockDocument = {
        id: '1',
        title: 'Updated Document',
        content: 'Updated Content',
        userId: 'user1',
      }

      ;(prisma.document.findUnique as jest.Mock).mockResolvedValue(mockDocument)
      ;(prisma.document.update as jest.Mock).mockResolvedValue(mockDocument)

      const { req, res } = createMocks({
        method: 'PUT',
        headers: {
          'x-user-id': 'user1',
        },
        body: {
          title: 'Updated Document',
          content: 'Updated Content',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(200)
      const responseData = JSON.parse(res._getData())
      expect(responseData).toEqual(mockDocument)
    })

    it('should return 404 for non-existent document', async () => {
      ;(prisma.document.findUnique as jest.Mock).mockResolvedValue(null)

      const { req, res } = createMocks({
        method: 'PUT',
        headers: {
          'x-user-id': 'user1',
        },
        body: {
          title: 'Updated Document',
          content: 'Updated Content',
        },
      })

      await handler(req, res)

      expect(res._getStatusCode()).toBe(404)
      const responseData = JSON.parse(res._getData())
      expect(responseData).toHaveProperty('error', 'Documento não encontrado')
    })
  })
}) 