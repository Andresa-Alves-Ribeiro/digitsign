import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Handle OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ 
            message: 'Method not allowed',
            allowedMethods: ['POST']
        });
    }

    try {
        console.log('Received registration request:', { body: req.body });
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            console.log('Missing required fields:', { name, email, password: !!password });
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
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
        return res.status(201).json({ 
            message: 'User created successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Error in register handler:', err);
        
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                return res.status(400).json({ message: 'Email already registered' });
            }
        }

        if (err instanceof Prisma.PrismaClientInitializationError) {
            console.error('Database connection error:', err);
            return res.status(500).json({ message: 'Database connection error' });
        }
        
        return res.status(500).json({ 
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' && err instanceof Error ? err.message : undefined
        });
    }
} 