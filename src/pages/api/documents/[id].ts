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
        console.log('Starting delete operation...')
        const session = await getServerSession(req, res, authOptions)
        if (!session?.user?.id) {
            return res.status(401).json({ error: 'Não autorizado' })
        }

        const { id } = req.query
        console.log('Document ID:', id)
        if (typeof id !== 'string') {
            return res.status(400).json({ error: 'ID inválido' })
        }

        const document = await prisma.document.findUnique({
            where: { id },
            include: { signature: true }
        })
        console.log('Found document:', document)

        if (!document) {
            return res.status(404).json({ error: 'Documento não encontrado' })
        }

        if (document.userId !== session.user.id) {
            return res.status(403).json({ error: 'Acesso negado' })
        }

        // Primeiro, excluir a assinatura se existir
        if (document.signature) {
            console.log('Deleting associated signature...')
            await prisma.signature.delete({
                where: { documentId: id }
            })
            console.log('Signature deleted successfully')
        }

        // Depois, excluir o registro do banco de dados
        console.log('Deleting document from database...')
        await prisma.document.delete({
            where: { id }
        })
        console.log('Database record deleted successfully')

        // Por fim, tentar excluir o arquivo físico
        const filePath = path.join(process.cwd(), 'uploads', document.fileKey)
        console.log('Attempting to delete file:', filePath)
        try {
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath)
                console.log('Physical file deleted successfully')
            } else {
                console.log('Physical file not found at path:', filePath)
            }
        } catch (fileError) {
            console.error('Erro ao excluir arquivo físico:', fileError)
            // Não retornamos erro aqui, pois o documento já foi excluído do banco
            // Apenas logamos o erro para monitoramento
        }

        return res.json({ message: 'Documento excluído com sucesso' })
    } catch (error) {
        console.error('Detailed error in delete operation:', error)
        if (error instanceof Error) {
            console.error('Error name:', error.name)
            console.error('Error message:', error.message)
            console.error('Error stack:', error.stack)
        }
        return res.status(500).json({ error: 'Erro interno ao excluir documento' })
    }
} 