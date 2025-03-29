import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await prisma.user.create({
            data: {
                id: uuidv4(),
                name,
                email,
                password: hashedPassword,
            },
        });

        return res.status(201).json({ message: 'User created successfully' });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'Email already registered' });
        }
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
} 