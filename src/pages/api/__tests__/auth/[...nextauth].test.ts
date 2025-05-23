import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';

// Mock do prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn()
    }
  }
}));

// Mock do bcryptjs
jest.mock('bcryptjs', () => ({
  compare: jest.fn()
}));

describe('NextAuth Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Credentials Provider', () => {
    it('should have credentials provider configured', () => {
      expect(authOptions.providers).toHaveLength(1);
      expect(authOptions.providers[0].id).toBe('credentials');
      expect(authOptions.providers[0].name).toBe('Credentials');
    });

    it('should validate required credentials', () => {
      const provider = authOptions.providers[0];
      const credentials = provider.credentials;

      expect(credentials).toHaveProperty('email');
      expect(credentials).toHaveProperty('password');

      expect(credentials.email.label).toBe('Email');
      expect(credentials.email.type).toBe('email');
      expect(credentials.email.required).toBe(true);

      expect(credentials.password.label).toBe('Password');
      expect(credentials.password.type).toBe('password');
      expect(credentials.password.required).toBe(true);
    });

    it('should authorize valid credentials', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password'
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);
      (compare as jest.Mock).mockResolvedValueOnce(true);

      const provider = authOptions.providers[0];
      const result = await provider.authorize({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: 'test@example.com'
        }
      });
      expect(compare).toHaveBeenCalledWith('password123', 'hashed_password');
    });

    it('should reject invalid credentials', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

      const provider = authOptions.providers[0];
      const result = await provider.authorize({
        email: 'test@example.com',
        password: 'wrong_password'
      });

      expect(result).toBeNull();
    });

    it('should reject when password does not match', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed_password'
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);
      (compare as jest.Mock).mockResolvedValueOnce(false);

      const provider = authOptions.providers[0];
      const result = await provider.authorize({
        email: 'test@example.com',
        password: 'wrong_password'
      });

      expect(result).toBeNull();
    });
  });

  describe('Callbacks', () => {
    it('should have jwt callback configured', () => {
      expect(authOptions.callbacks).toHaveProperty('jwt');
      expect(typeof authOptions.callbacks.jwt).toBe('function');
    });

    it('should have session callback configured', () => {
      expect(authOptions.callbacks).toHaveProperty('session');
      expect(typeof authOptions.callbacks.session).toBe('function');
    });

    it('should include user data in jwt token', async () => {
      const mockToken = {};
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      };

      const result = await authOptions.callbacks.jwt({
        token: mockToken,
        user: mockUser
      });

      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email
      });
    });

    it('should include user data in session', async () => {
      const mockSession = {
        user: {}
      };
      const mockToken = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      };

      const result = await authOptions.callbacks.session({
        session: mockSession,
        token: mockToken
      });

      expect(result.user).toEqual({
        id: mockToken.id,
        name: mockToken.name,
        email: mockToken.email
      });
    });
  });

  describe('Configuration Options', () => {
    it('should have secure session configuration', () => {
      expect(authOptions.session.strategy).toBe('jwt');
    });

    it('should have appropriate pages configuration', () => {
      expect(authOptions.pages).toEqual({
        signIn: '/login',
        signOut: '/login',
        error: '/login'
      });
    });

    it('should have debug mode disabled in production', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      expect(authOptions.debug).toBe(false);

      process.env.NODE_ENV = originalNodeEnv;
    });
  });
}); 