import { PrismaClient, User, Document, Signature } from '@prisma/client'
import { prisma } from '../prisma'

// Mock PrismaClient before importing prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findUnique: jest.fn().mockImplementation(() => Promise.resolve(null)),
      create: jest.fn().mockImplementation(() => Promise.resolve(null)),
      update: jest.fn().mockImplementation(() => Promise.resolve(null)),
      delete: jest.fn().mockImplementation(() => Promise.resolve(null)),
    },
    document: {
      findMany: jest.fn().mockImplementation(() => Promise.resolve([])),
      findUnique: jest.fn().mockImplementation(() => Promise.resolve(null)),
      create: jest.fn().mockImplementation(() => Promise.resolve(null)),
      update: jest.fn().mockImplementation(() => Promise.resolve(null)),
      delete: jest.fn().mockImplementation(() => Promise.resolve(null)),
    },
    signature: {
      create: jest.fn().mockImplementation(() => Promise.resolve(null)),
      findUnique: jest.fn().mockImplementation(() => Promise.resolve(null)),
      update: jest.fn().mockImplementation(() => Promise.resolve(null)),
    },
    $connect: jest.fn().mockImplementation(() => Promise.resolve()),
    $disconnect: jest.fn().mockImplementation(() => Promise.resolve()),
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

    it('should reuse the same instance in development', async () => {
      const originalEnv = process.env.NODE_ENV
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'development',
        writable: true
      })

      // Import the module again
      jest.isolateModules(async () => {
        const { prisma: newPrisma } = await import('../prisma')
        expect(newPrisma).toBe(prisma)
      })

      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        writable: true
      })
    })
  })

  describe('User Operations', () => {
    const mockUser: User = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashedpassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    it('should find a user by id', async () => {
      (mockPrismaClient.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

      await prisma.user.findUnique({
        where: { id: '1' },
      })

      expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })

    it('should create a new user', async () => {
      (mockPrismaClient.user.create as jest.Mock).mockResolvedValue(mockUser)

      await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          password: 'hashedpassword',
        },
      })

      expect(mockPrismaClient.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          password: 'hashedpassword',
        },
      })
    })
  })

  describe('Document Operations', () => {
    const mockDocument: Document = {
      id: '1',
      name: 'Test Document',
      fileKey: 'test-file-key',
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'DRAFT',
      mimeType: 'application/pdf',
      size: 1024,
    }

    it('should find documents by user id', async () => {
      (mockPrismaClient.document.findMany as jest.Mock).mockResolvedValue([mockDocument])

      await prisma.document.findMany({
        where: { userId: '1' },
      })

      expect(mockPrismaClient.document.findMany).toHaveBeenCalledWith({
        where: { userId: '1' },
      })
    })

    it('should create a new document', async () => {
      (mockPrismaClient.document.create as jest.Mock).mockResolvedValue(mockDocument)

      await prisma.document.create({
        data: {
          name: 'Test Document',
          fileKey: 'test-file-key',
          userId: '1',
          status: 'DRAFT',
          mimeType: 'application/pdf',
          size: 1024,
        },
      })

      expect(mockPrismaClient.document.create).toHaveBeenCalledWith({
        data: {
          name: 'Test Document',
          fileKey: 'test-file-key',
          userId: '1',
          status: 'DRAFT',
          mimeType: 'application/pdf',
          size: 1024,
        },
      })
    })

    it('should update a document', async () => {
      const updatedDocument = {
        ...mockDocument,
        name: 'Updated Document',
      } as Document

      const mockUpdate = mockPrismaClient.document.update as jest.Mock
      mockUpdate.mockResolvedValue(updatedDocument)

      await prisma.document.update({
        where: { id: '1' },
        data: { name: 'Updated Document' },
      })

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: 'Updated Document' },
      })
    })

    it('should delete a document', async () => {
      (mockPrismaClient.document.delete as jest.Mock).mockResolvedValue(mockDocument)

      await prisma.document.delete({
        where: { id: '1' },
      })

      expect(mockPrismaClient.document.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })
  })

  describe('Signature Operations', () => {
    const mockSignature: Signature = {
      id: '1',
      documentId: '1',
      userId: '1',
      signatureImg: 'base64data',
      createdAt: new Date(),
      signedAt: null,
    }

    it('should create a new signature', async () => {
      (mockPrismaClient.signature.create as jest.Mock).mockResolvedValue(mockSignature)

      await prisma.signature.create({
        data: {
          documentId: '1',
          userId: '1',
          signatureImg: 'base64data',
        },
      })

      expect(mockPrismaClient.signature.create).toHaveBeenCalledWith({
        data: {
          documentId: '1',
          userId: '1',
          signatureImg: 'base64data',
        },
      })
    })

    it('should find a signature by id', async () => {
      (mockPrismaClient.signature.findUnique as jest.Mock).mockResolvedValue(mockSignature)

      await prisma.signature.findUnique({
        where: { id: '1' },
      })

      expect(mockPrismaClient.signature.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      })
    })

    it('should update a signature', async () => {
      const updatedSignature = {
        ...mockSignature,
        signatureImg: 'newbase64data',
      } as Signature

      const mockUpdate = mockPrismaClient.signature.update as jest.Mock
      mockUpdate.mockResolvedValue(updatedSignature)

      await prisma.signature.update({
        where: { id: '1' },
        data: { signatureImg: 'newbase64data' },
      })

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { signatureImg: 'newbase64data' },
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      const mockConnect = mockPrismaClient.$connect as jest.Mock
      const error = new Error('Connection failed')
      mockConnect.mockRejectedValue(error)

      await expect(prisma.$connect()).rejects.toThrow('Connection failed')
    })

    it('should handle database operation errors', async () => {
      const mockFindUnique = mockPrismaClient.user.findUnique as jest.Mock
      const error = new Error('Operation failed')
      mockFindUnique.mockRejectedValue(error)

      await expect(
        prisma.user.findUnique({
          where: { id: '1' },
        })
      ).rejects.toThrow('Operation failed')
    })
  })
}) 