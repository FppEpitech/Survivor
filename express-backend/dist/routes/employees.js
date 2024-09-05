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
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prismaClient_1 = __importDefault(require("../prismaClient"));
const router = express_1.default.Router();
router.get('/me', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let me = yield prismaClient_1.default.employee.findUnique({ where: { id: req.middlewareId } });
        if (!me)
            throw new Error("Failed getting employee's informations");
        res.status(200).json(me);
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting employee' });
    }
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield prismaClient_1.default.employee.findMany();
        res.status(200).json(employees);
    }
    catch (error) {
        res.status(500).json({ error: 'Error retrieving employees' });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const employee = yield prismaClient_1.default.employee.findUnique({ where: { id } });
        if (employee) {
            res.status(200).json(employee);
        }
        else {
            res.status(404).json({ error: 'employee not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error retrieving employee' });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, surname, birth_date, gender, work, password, image_url, } = req.body;
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        if (!hashedPassword) {
            throw new Error("Failed hashing your password");
        }
        const newEmployee = yield prismaClient_1.default.employee.create({
            data: {
                email,
                name,
                surname,
                birth_date,
                gender,
                work,
                hashed_password: hashedPassword,
                old_id: -1,
                image_url: image_url,
            },
        });
        res.status(201).json(newEmployee);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error creating employee' });
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { email, name, surname, birth_date, gender, work, } = req.body;
    try {
        const updatedEmployee = yield prismaClient_1.default.employee.update({
            where: { id },
            data: {
                email,
                name,
                surname,
                birth_date,
                gender,
                work,
            }
        });
        res.status(200).json(updatedEmployee);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating employee' });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        yield prismaClient_1.default.employee.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting employee' });
    }
}));
router.get('/customers/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        let customers = yield prismaClient_1.default.customer.findMany({ where: { coach_id: id } });
        res.status(200).json(customers);
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting employee' });
    }
}));
exports.default = router;
//# sourceMappingURL=employees.js.map