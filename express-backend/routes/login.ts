import {Router, Request, Response}  from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient'
import {getLegacyProfile, accountExistsLegacy} from '../legacy/accountsLegacy';
import { Employee } from '@prisma/client';

const loginRouter = Router();

loginRouter.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ msg: "Bad parameters" });
    try {
        let user = await prisma.employee.findUnique({
            where: { email: email },
        });
        if (!user) {
            let existsOnLegacyToken = await accountExistsLegacy(email, password);
            if (existsOnLegacyToken != undefined) {
                let legacyUser : Employee = await getLegacyProfile(existsOnLegacyToken)
                if (!legacyUser) return res.status(400).json({ msg: "Bad parameters" });
                await bcrypt.hash(req.body.password, 10, async (errhash, hash) => {
                    user = await prisma.employee.create({
                        data: {
                            old_id: legacyUser.id,
                            birth_date: legacyUser.birth_date,
                            name: legacyUser.name,
                            surname: legacyUser.surname,
                            email: legacyUser.email,
                            gender: legacyUser.gender,
                            work: legacyUser.work,
                            hashed_password: hash,
                        }
                    })
                })
            } else {
                return res.status(409).json({ msg: "Invalid Credentials" });
            }
        }
        const isValidPassword = await bcrypt.compare(password, (user as any).hashed_password);

        if (isValidPassword) {
            const expiresIn = 24 * 60 * 60;
            const token = jwt.sign({ id: (user as any).id }, process.env.SECRET as string, {
                expiresIn: expiresIn,
            });
            return res.status(200).json({ token: token });
        } else {
            return res.status(409).json({ msg: "Invalid Credentials" });
        }
    } catch (error) {
        return res.status(500).json({ msg: `Internal Server Error ${error}`});
    }
});

export default loginRouter