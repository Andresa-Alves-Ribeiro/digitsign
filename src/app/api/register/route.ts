import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('Received registration request:', { body });
        
        const { name, email, password } = body;

        if (!name || !email || !password) {
            console.log('Missing required fields:', { name, email, password: !!password });
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Validate password length
        if (password.length < 6) {
            return NextResponse.json(
                { message: 'Password must be at least 6 characters long' },
                { status: 400 }
            );
        }

        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);
        
        console.log('Creating user in database...');
        const user = await prisma.user.create({
            data: {
                id: uuidv4(),
                name,
                email,
                password: hashedPassword,
            },
        });

        console.log('User created successfully:', { userId: user.id, email: user.email });
        return NextResponse.json(
            { 
                message: 'User created successfully',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            },
            { status: 201 }
        );
    } catch (err) {
        console.error('Error in register handler:', err);
        
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                return NextResponse.json(
                    { message: 'Email already registered' },
                    { status: 400 }
                );
            }
        }

        if (err instanceof Prisma.PrismaClientInitializationError) {
            console.error('Database connection error:', err);
            return NextResponse.json(
                { message: 'Database connection error' },
                { status: 500 }
            );
        }
        
        return NextResponse.json(
            { 
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' && err instanceof Error ? err.message : undefined
            },
            { status: 500 }
        );
    }
} 