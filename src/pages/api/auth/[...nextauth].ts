import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

interface User {
    id: string;
    email: string;
    name: string;
}

declare module "next-auth" {
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
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const validatedData = loginSchema.parse(credentials);

                    const user = await prisma.user.findUnique({
                        where: { email: validatedData.email },
                    });

                    if (!user) throw new Error("Usuário não encontrado");

                    const isValid = await bcrypt.compare(
                        validatedData.password,
                        user.password
                    );

                    if (!isValid) throw new Error("Senha incorreta");

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    throw new Error(error instanceof Error ? error.message : "Erro na autenticação");
                }
            },
        }),
    ],
    session: {
        strategy: "jwt" as SessionStrategy,
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT; user: User | undefined }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export default handler;