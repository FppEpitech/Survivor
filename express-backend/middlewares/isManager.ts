import { Request, Response, NextFunction } from 'express';
import prisma from '../prismaClient';

async function isManager(req: Request, res: Response, next: NextFunction) {
  const employee = (req as any).middlewareUser;
  if (employee?.work === 'Coach') {
    return res.status(403).json({ message: "Access denied. Coaches cannot access this route." });
  } else {
    next();
  }
}

export default isManager;
