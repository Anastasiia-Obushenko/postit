import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import prisma from '../../../prisma/client'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const session = await getServerSession(req, res, authOptions)
        if (!session) { return res.status(401).json({ message: 'Please sign in' }) }
        // Get user
        const prismaUser = await prisma.user.findUnique({
            where: { email: session?.user?.email },
        })
        try {
            const { title, postId } = req.body.data
            if (!title.length) {
                return res.status(401).json({ message: 'Please do not leave this empty' })
            }
            const result = await prisma.comment.create({
                data: {
                    message: title,
                    userId: prismaUser?.id,
                    postId,
                },
            })
            res.status(200).json(result)
        } catch (error) {
            res.status(403).json({ error: 'Error has occured' })
        }
    }

}
