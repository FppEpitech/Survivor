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
const prismaClient_1 = __importDefault(require("../prismaClient"));
const router = express_1.default.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield prismaClient_1.default.customer.findMany();
        res.status(200).json(customers);
    }
    catch (error) {
        res.status(500).json({ error: 'Error retrieving customers' });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const customer = yield prismaClient_1.default.customer.findUnique({ where: { id } });
        if (customer) {
            res.status(200).json(customer);
        }
        else {
            res.status(404).json({ error: 'Customer not found' });
        }
    }
    catch (error) {
        console.error('Error retrieving customer:', error);
        res.status(500).json({ error: 'Error retrieving customer' });
    }
}));
router.get('/:id/image', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const customer = yield prismaClient_1.default.customer.findUnique({ where: { id } });
        if (customer) {
            res.status(200).json(customer.image_url);
        }
        else {
            res.status(404).json({ error: 'Customer not found' });
        }
    }
    catch (error) {
        console.error('Error retrieving customer:', error);
        res.status(500).json({ error: 'Error retrieving customer' });
    }
}));
router.get('/:id/clothes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid customer ID' });
    }
    try {
        const customer = yield prismaClient_1.default.customer.findUnique({
            where: { id },
        });
        if (customer) {
            console.log('Customer clothes:', customer.clothes);
            res.status(200).json(customer.clothes);
        }
        else {
            res.status(404).json({ error: 'Customer not found' });
        }
    }
    catch (error) {
        console.error('Error retrieving customer:', error);
        res.status(500).json({ error: 'Error retrieving customer' });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, surname, birth_date, gender, description, astrological_sign, image_url, coach_id, clothes } = req.body;
    try {
        const newCustomer = yield prismaClient_1.default.customer.create({
            data: {
                email,
                name,
                surname,
                birth_date,
                gender,
                description,
                astrological_sign,
                old_id: -1,
                image_url,
                coach_id,
                clothes: JSON.stringify(clothes),
            },
        });
        res.status(201).json(newCustomer);
    }
    catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({ error: 'Error creating customer' });
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { email, name, surname, birth_date, gender, description, astrological_sign = "Unknown", coach_id, image_url } = req.body;
    try {
        const updatedCustomer = yield prismaClient_1.default.customer.update({
            where: { id },
            data: {
                email,
                name,
                surname,
                birth_date,
                gender,
                description,
                astrological_sign,
                coach_id,
                image_url
            },
        });
        res.status(200).json(updatedCustomer);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating customer' });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        yield prismaClient_1.default.customer.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting customer' });
    }
}));
exports.default = router;
//# sourceMappingURL=customers.js.map