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
const router = express_1.default.Router();
const prismaClient_1 = __importDefault(require("../prismaClient"));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clothes = yield prismaClient_1.default.clothe.findMany();
        res.status(200).json(clothes);
    }
    catch (error) {
        res.status(500).json({ error: 'Error retrieving clothes' });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        const clothe = yield prismaClient_1.default.clothe.findUnique({ where: { id } });
        if (clothe) {
            res.status(200).json(clothe);
        }
        else {
            res.status(404).json({ error: 'Clothe not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error retrieving clothe' });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.body;
    try {
        const newClothe = yield prismaClient_1.default.clothe.create({
            data: { type, old_id: -1 }
        });
        res.status(201).json(newClothe);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating clothe' });
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    const { type } = req.body;
    try {
        const updatedClothe = yield prismaClient_1.default.clothe.update({ where: { id },
            data: { type }
        });
        res.status(200).json(updatedClothe);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating clothe' });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = parseInt(req.params.id);
    try {
        yield prismaClient_1.default.clothe.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting clothe' });
    }
}));
exports.default = router;
//# sourceMappingURL=clothes.js.map