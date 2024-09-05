import {Router, Request, Response}  from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient'
import {getLegacyProfile, accountExistsLegacy} from '../legacy/accountsLegacy';
import { Employee } from '@prisma/client';

const loginRouter = Router();

const generateToken = (userId: number) => {
    const expiresIn = 24 * 60 * 60;
    return jwt.sign({ id: userId }, process.env.SECRET as string, { expiresIn });
};

const createNewUserLegacy = async (legacyUser: Employee, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
        throw new Error("Failed hashing your password");
    }
    const employee = await prisma.employee.create({
        data: {
            old_id: legacyUser.id,
            birth_date: legacyUser.birth_date,
            name: legacyUser.name,
            surname: legacyUser.surname,
            email: legacyUser.email,
            gender: legacyUser.gender,
            work: legacyUser.work,
            hashed_password: hashedPassword,
            image_url: legacyUser.image_url,
        },
    });
    if (!employee)
        throw new Error("Failed replicating new user in new db.");
    return employee
};

const updateHashedpwd = async (legacyUser: Employee, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
        throw new Error("Failed hashing your password");
    }
    const employee = await prisma.employee.update({
        where: {
            id: legacyUser.id
        },
        data: {
            hashed_password: hashedPassword,
        },
    });
    if (!employee)
        throw new Error("Failed replicating new user in new db.");
    return employee
};

async function updateLastConnection(id : number) {
        const updatedEmployee = await prisma.employee.update({
          where: { id },
          data: {
            last_login: new Date(),
          },
        });
        console.log(id)
        return true;
}

loginRouter.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ msg: "Bad parameters" });
    try {
        let user : Employee | null = await prisma.employee.findUnique({
            where: { email: email },
        });
        if (!user || user.hashed_password == "") {
            let updateJustPassword = !(user == null)
            let existsOnLegacyToken = await accountExistsLegacy(email, password);
            if (existsOnLegacyToken != undefined) {
                let legacyUser : Employee = await getLegacyProfile(existsOnLegacyToken)
                if (!legacyUser)
                    return res.status(400).json({ msg: "Failed to fetch the data." });
                user = (!updateJustPassword) ? await createNewUserLegacy(legacyUser, req.body.password) : await updateHashedpwd(legacyUser, password);
            } else {
                return res.status(409).json({ msg: "Invalid Credentials" });
            }
        }
        const isValidPassword = await bcrypt.compare(password, user?.hashed_password);

        if (!isValidPassword && user == null)
            return res.status(409).json({ msg: "Invalid Credentials" });
        const token = generateToken(user.id);
        await updateLastConnection(user.id)
        return res.status(200).json({ token: token });
    } catch (error) {
        return res.status(500).json({ msg: `Internal Server Error ${error}`});
    }
});

export default loginRouter