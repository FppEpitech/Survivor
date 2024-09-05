"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = __importDefault(require("../prismaClient"));
const accountsLegacy_1 = require("../legacy/accountsLegacy");
const loginRouter = (0, express_1.Router)();
const generateToken = (userId) => {
    const expiresIn = 24 * 60 * 60;
    return jsonwebtoken_1.default.sign({ id: userId }, process.env.SECRET, { expiresIn });
};
const createNewUserLegacy = (legacyUser, password) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    if (!hashedPassword) {
        throw new Error("Failed hashing your password");
    }
    const employee = yield prismaClient_1.default.employee.create({
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
    return employee;
});
const updateHashedpwd = (legacyUser, password) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    if (!hashedPassword) {
        throw new Error("Failed hashing your password");
    }
    const employee = yield prismaClient_1.default.employee.update({
        where: {
            id: legacyUser.id
        },
        data: {
            hashed_password: hashedPassword,
        },
    });
    if (!employee)
        throw new Error("Failed replicating new user in new db.");
    return employee;
});
function updateLastConnection(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedEmployee = yield prismaClient_1.default.employee.update({
            where: { id },
            data: {
                last_login: new Date(),
            },
        });
        console.log(id);
        return true;
    });
}
loginRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ msg: "Bad parameters" });
    try {
        let user = yield prismaClient_1.default.employee.findUnique({
            where: { email: email },
        });
        if (!user || user.hashed_password == "") {
            let updateJustPassword = !(user == null);
            let existsOnLegacyToken = yield (0, accountsLegacy_1.accountExistsLegacy)(email, password);
            if (existsOnLegacyToken != undefined) {
                let legacyUser = yield (0, accountsLegacy_1.getLegacyProfile)(existsOnLegacyToken);
                if (!legacyUser)
                    return res.status(400).json({ msg: "Failed to fetch the data." });
                user = (!updateJustPassword) ? yield createNewUserLegacy(legacyUser, req.body.password) : yield updateHashedpwd(legacyUser, password);
            }
            else {
                return res.status(409).json({ msg: "Invalid Credentials" });
            }
        }
        const isValidPassword = yield bcryptjs_1.default.compare(password, user === null || user === void 0 ? void 0 : user.hashed_password);
        if (!isValidPassword && user == null)
            return res.status(409).json({ msg: "Invalid Credentials" });
        const token = generateToken(user.id);
        yield updateLastConnection(user.id);
        return res.status(200).json({ token: token });
    }
    catch (error) {
        return res.status(500).json({ msg: `Internal Server Error ${error}` });
    }
}));
exports.default = loginRouter;
//# sourceMappingURL=login.js.map