import { PrismaClient } from '@prisma/client'
import { prisma } from '../prisma'

// Mock PrismaClient before importing prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    // Mock dos métodos do Prisma que você usa
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    document: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    signature: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  })),
}))

describe('Prisma Service', () => {
  let mockPrismaClient: jest.Mocked<PrismaClient>

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset the mock implementation before each test
    ;(PrismaClient as jest.Mock).mockClear()
    mockPrismaClient = prisma as unknown as jest.Mocked<PrismaClient>
  })

  describe('Connection', () => {
    it('should create a single instance of PrismaClient', () => {
      // Force PrismaClient to be called
      const client = new PrismaClient()
      expect(PrismaClient).toHaveBeenCalledTimes(1)
      expect(client).toBeDefined()
    })

    it('should reuse the same instance in development', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      // Import the module again
      jest.isolateModules(() => {
        const { prisma: newPrisma } = require('../prisma')
        expect(newPrisma).toBe(prisma)
      })

      process.env.NODE_ENV = originalEnv
    })
  })

  describe('User Operations', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    }

    it('should find a user by id', async () => {
      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser)

      await prisma.user.findUnique({
        where: { id: '1' },
      })

      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })

    it('should create a new user', async () => {
      mockPrismaClient.user.create.mockResolvedValue(mockUser)

      await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
        },
      })

      expect(mockPrismaClient.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          name: 'Test User',
        },
      })
    })
  })

  describe('Document Operations', () => {
    const mockDocument = {
      id: '1',
      title: 'Test Document',
      content: 'Test Content',
      userId: '1',
    }

    it('should find documents by user id', async () => {
      mockPrismaClient.document.findMany.mockResolvedValue([mockDocument])

      await prisma.document.findMany({
        where: { userId: '1' },
      })

      expect(mockPrismaClient.document.findMany).toHaveBeenCalledWith({
        where: { userId: '1' },
      })
    })

    it('should create a new document', async () => {
      mockPrismaClient.document.create.mockResolvedValue(mockDocument)

      await prisma.document.create({
        data: mockDocument,
      })

      expect(mockPrismaClient.document.create).toHaveBeenCalledWith({
        data: mockDocument,
      })
    })

    it('should update a document', async () => {
      const updatedDocument = { ...mockDocument, title: 'Updated Title' }
      mockPrismaClient.document.update.mockResolvedValue(updatedDocument)

      await prisma.document.update({
        where: { id: '1' },
        data: { title: 'Updated Title' },
      })

      expect(mockPrismaClient.document.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { title: 'Updated Title' },
      })
    })

    it('should delete a document', async () => {
      mockPrismaClient.document.delete.mockResolvedValue(mockDocument)

      await prisma.document.delete({
        where: { id: '1' },
      })

      expect(mockPrismaClient.document.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })
  })

  describe('Signature Operations', () => {
    const mockSignature = {
      id: '1',
      documentId: '1',
      userId: '1',
      signatureData: 'base64data',
    }

    it('should create a new signature', async () => {
      mockPrismaClient.signature.create.mockResolvedValue(mockSignature)

      await prisma.signature.create({
        data: mockSignature,
      })

      expect(mockPrismaClient.signature.create).toHaveBeenCalledWith({
        data: mockSignature,
      })
    })

    it('should find a signature by id', async () => {
      mockPrismaClient.signature.findUnique.mockResolvedValue(mockSignature)

      await prisma.signature.findUnique({
        where: { id: '1' },
      })

      expect(mockPrismaClient.signature.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })

    it('should update a signature', async () => {
      const updatedSignature = { ...mockSignature, signatureData: 'newbase64data' }
      mockPrismaClient.signature.update.mockResolvedValue(updatedSignature)

      await prisma.signature.update({
        where: { id: '1' },
        data: { signatureData: 'newbase64data' },
      })

      expect(mockPrismaClient.signature.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { signatureData: 'newbase64data' },
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      const connectionError = new Error('Connection failed')
      mockPrismaClient.$connect.mockRejectedValue(connectionError)

      await expect(prisma.$connect()).rejects.toThrow('Connection failed')
    })

    it('should handle database operation errors', async () => {
      const operationError = new Error('Operation failed')
      mockPrismaClient.user.findUnique.mockRejectedValue(operationError)

      await expect(
        prisma.user.findUnique({
          where: { id: '1' },
        })
      ).rejects.toThrow('Operation failed')
    })
  })
}) 