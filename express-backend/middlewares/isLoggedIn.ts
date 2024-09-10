import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient'

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).json({ msg: "No token." });
    const token = authHeader.split(' ')[1];
    if (!token)
        return res.status(401).json({ msg: "Token is not valid" });
    jwt.verify(token, process.env.SECRET as string, async (err, decoded: any) => {
        if (err)
            return res.status(401).json({ msg: "Token is not valid" });
        const userId = decoded.id;
        try {
            const user = await prisma.employee.findUnique({ where: { id: userId } });
            if (!user)
                return res.status(401).json({ msg: "Token is not valid" });
            (req as any).middlewareId = userId;
            (req as any).middlewareUser = user;
            next();
        } catch (error) {
            return res.status(500).json({ msg: "Internal server error" });
        }
    });
};

export default authenticateToken;
