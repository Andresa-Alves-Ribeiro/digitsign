import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        }
    }
}

// Esquema de validação para login
const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const validatedData = loginSchema.parse(credentials);

          const user = await prisma.user.findUnique({
            where: { email: validatedData.email },
          });

          if (!user) {
            console.error('User not found:', validatedData.email);
            throw new Error('Usuário não encontrado');
          }

          const isValid = await bcrypt.compare(
            validatedData.password,
            user.password
          );

          if (!isValid) {
            console.error('Invalid password for user:', validatedData.email);
            throw new Error('Senha incorreta');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error('Auth error:', error);
          if (error instanceof z.ZodError) {
            throw new Error('Dados de login inválidos');
          }
          throw new Error(error instanceof Error ? error.message : 'Erro na autenticação');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      console.error('User signed in:', user.email);
    },
    async signOut({ token }) {
      console.error('User signed out:', token.email);
    },
  },
}; 