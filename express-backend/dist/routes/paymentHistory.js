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
        const paymentHistorys = yield prismaClient_1.default.paymentHistory.findMany();
        res.status(200).json(paymentHistorys);
    }
    catch (error) {
        res.status(500).json({ error: 'Error retrieving paymentHistorys' });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const paymentHistory = yield prismaClient_1.default.paymentHistory.findUnique({ where: { id } });
        if (paymentHistory) {
            res.status(200).json(paymentHistory);
        }
        else {
            res.status(404).json({ error: 'paymentHistory not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error retrieving paymentHistory' });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, payment_method, amount, comment, customer_id } = req.body;
    try {
        const newpaymentHistory = yield prismaClient_1.default.paymentHistory.create({
            data: {
                old_id: -1,
                date,
                payment_method,
                amount,
                comment,
                customer_id,
            },
        });
        res.status(201).json(newpaymentHistory);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating paymentHistory' });
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { date, payment_method, amount, comment, customer_id, } = req.body;
    try {
        const updatedpaymentHistory = yield prismaClient_1.default.paymentHistory.update({
            where: { id },
            data: {
                date,
                payment_method,
                amount,
                comment,
                customer_id,
            },
        });
        res.status(200).json(updatedpaymentHistory);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating paymentHistory' });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        yield prismaClient_1.default.paymentHistory.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting paymentHistory' });
    }
}));
router.get('/customer/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const paymentHistory = yield prismaClient_1.default.paymentHistory.findMany({ where: { customer_id: id } });
        if (paymentHistory) {
            res.status(200).json(paymentHistory);
        }
        else {
            res.status(404).json({ error: 'paymentHistory not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error retrieving paymentHistory' });
    }
}));
exports.default = router;
//# sourceMappingURL=paymentHistory.js.map