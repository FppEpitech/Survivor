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
        const encounters = yield prismaClient_1.default.encounter.findMany();
        res.status(200).json(encounters);
    }
    catch (error) {
        res.status(500).json({ error: 'Error retrieving encounters' });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const encounter = yield prismaClient_1.default.encounter.findUnique({ where: { id } });
        if (encounter) {
            res.status(200).json(encounter);
        }
        else {
            res.status(404).json({ error: 'Encounter not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error retrieving encounter' });
    }
}));
router.get('/customer/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid customer ID' });
    }
    try {
        const encounters = yield prismaClient_1.default.encounter.findMany({
            where: {
                customer_id: id,
            },
            select: {
                id: true,
                customer_id: true,
                date: true,
                rating: true,
                comment: true,
                source: true,
            },
            orderBy: {
                date: 'desc',
            },
        });
        if (encounters.length === 0) {
            return res.status(404).json({ error: 'No encounters found for this customer' });
        }
        res.status(200).json(encounters);
    }
    catch (error) {
        console.error('Error retrieving encounters:', error);
        res.status(500).json({ error: 'Error retrieving encounters' });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customer_id, date, rating, comment, source } = req.body;
    try {
        const newEncounter = yield prismaClient_1.default.encounter.create({
            data: {
                customer_id,
                date,
                rating,
                comment,
                source,
                old_id: -1,
            },
        });
        res.status(201).json(newEncounter);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating encounter' });
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { customer_id, date, rating, comment, source } = req.body;
    try {
        const updatedEncounter = yield prismaClient_1.default.encounter.update({ where: { id },
            data: {
                customer_id,
                date,
                rating,
                comment,
                source,
            },
        });
        res.status(200).json(updatedEncounter);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating encounter' });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        yield prismaClient_1.default.encounter.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting encounter' });
    }
}));
exports.default = router;
//# sourceMappingURL=encounters.js.map