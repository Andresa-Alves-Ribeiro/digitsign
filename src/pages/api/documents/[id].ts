import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Método não permitido' })
    }

    try {
        const session = await getServerSession(req, res, authOptions)
        if (!session?.user?.id) {
            return res.status(401).json({ error: 'Não autorizado' })
        }

        const { id } = req.query
        if (typeof id !== 'string') {
            return res.status(400).json({ error: 'ID inválido' })
        }

        const document = await prisma.document.findUnique({
            where: { id }
        })

        if (!document) {
            return res.status(404).json({ error: 'Documento não encontrado' })
        }

        if (document.userId !== session.user.id) {
            return res.status(403).json({ error: 'Acesso negado' })
        }

        const filePath = path.join(process.cwd(), 'uploads', document.fileKey)

        // Excluir o arquivo físico
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }

        // Excluir o registro do banco de dados
        await prisma.document.delete({
            where: { id }
        })

        return res.json({ message: 'Documento excluído com sucesso' })
    } catch (error) {
        console.error('Erro ao excluir documento:', error)
        return res.status(500).json({ error: 'Erro interno ao excluir documento' })
    }
} 