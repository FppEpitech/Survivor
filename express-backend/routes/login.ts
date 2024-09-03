import {Router, Request, Response}  from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient'

const router = Router();

interface StrBody {
    email: string;
    password: string;
}

router.post('/login', async (req: Request<{}, {}, StrBody>, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ msg: "Bad parameter" });
    try {
        const user = await prisma.employee.findUnique({
            where: { email: email },
        });

        if (!user) {
            return res.status(409).json({ msg: "Invalid Credentials" });
        }
        const isValidPassword = await bcrypt.compare(password, user.hashed_password);

        if (isValidPassword) {
            const expiresIn = 24 * 60 * 60;
            const token = jwt.sign({ id: user.id }, process.env.SECRET as string, {
                expiresIn: expiresIn,
            });

            return res.status(200).json({ token: token });
        } else {
            return res.status(409).json({ msg: "Invalid Credentials" });
        }
    } catch (error) {
        return res.status(500).json({ msg: "Internal Server Error"});
    }
});

// router.post('/register', async (req, res, next) => {
//     if (!req.body.email || !req.body.password || !req.body.name || !req.body.firstname)
//         return res.status(400).json({ msg: "Bad parameter" });
//         user_mail_exist(req.body.email, (exists) => {
//         if (exists)
//             return res.status(409).json({ msg: "Account already exists" });
//         bcrypt.hash(req.body.password, 10, function(errhash, hash) {
//         if (errhash)
//             return res.status(500).json({ msg: "Internal server error" });
//     create_user(req.body.email, hash, req.body.name, req.body.firstname,  (code, newuser) => {
//             const expiresIn = 24 * 60 * 60;
//             const token = jwt.sign({id: newuser.id}, process.env.SECRET, {
//                 expiresIn: expiresIn,
//             });
//             return res.status(200).json({ token : token});
//         })
//     });  
//   })
// });

module.exports = router;
