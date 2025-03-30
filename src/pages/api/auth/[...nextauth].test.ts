import { createMocks } from 'node-mocks-http'
import handler from './[...nextauth]'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}))

describe('NextAuth API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should authenticate user with valid credentials', async () => {
    const hashedPassword = await hash('password123', 10)
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
    }

    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const responseData = JSON.parse(res._getData())
    expect(responseData).toHaveProperty('user')
    expect(responseData.user).toMatchObject({
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
    })
  })

  it('should return error for invalid credentials', async () => {
    const hashedPassword = await hash('password123', 10)
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
    }

    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'wrongpassword',
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(401)
    const responseData = JSON.parse(res._getData())
    expect(responseData).toHaveProperty('error', 'Credenciais inválidas')
  })

  it('should return error for non-existent user', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        email: 'nonexistent@example.com',
        password: 'password123',
      },
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(401)
    const responseData = JSON.parse(res._getData())
    expect(responseData).toHaveProperty('error', 'Usuário não encontrado')
  })
}) 