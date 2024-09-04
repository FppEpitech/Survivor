import { Employee } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import prisma from '../prismaClient'

const isManager = async (req: Request, res: Response, next: NextFunction) => {
    let employee : Employee | null = await prisma.employee.findUnique({
        where: {id : (req as any).middlewareId}
    });
    if (!employee || !(req as any).middlewareId) return await res.status(500).json({ error: "Internal server error." });
    if (employee.work == 'Coach') return await res.status(401).json({error: "Not authorized."});
    next();
};

export default isManager;
