// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import prisma from '../../../prisma/client'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const session = await getServerSession(req, res, authOptions)
        if (!session)
            return res.status(401).json({ message: 'Please sign in' })
        // Get Auth Users Posts
        try {
            const data = await prisma.user.findUnique({
                where: {
                    email: session.user?.email,
                },
                include: {
                    Post: {
                        orderBy: {
                            createdAt:'desc'
                        },
                        include: {
                            comments:true
                        }
                    }
                }
            })
            res.status(200).json(data)
        } catch (error) {
            res.status(403).json({ error: 'Error has occured' })
        }
    }

}
