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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prismaClient_1 = __importDefault(require("../prismaClient"));
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ msg: "No token." });
    const token = authHeader.split(' ')[1];
    if (!token)
        return res.status(401).json({ msg: "Token is not valid" });
    jsonwebtoken_1.default.verify(token, process.env.SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.status(401).json({ msg: "Token is not valid" });
        const userId = decoded.id;
        try {
            const user = yield prismaClient_1.default.employee.findUnique({ where: { id: userId } });
            if (!user)
                return res.status(401).json({ msg: "Token is not valid" });
            req.middlewareId = userId;
            next();
        }
        catch (error) {
            return res.status(500).json({ msg: "Internal server error" });
        }
    }));
});
exports.default = authenticateToken;
//# sourceMappingURL=isLoggedIn.js.map